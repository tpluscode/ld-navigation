var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LdNavigation;
(function (LdNavigation) {
    var Helpers = (function () {
        function Helpers() {
        }
        Helpers.fireNavigation = function (dispatcher, resourceUrl) {
            dispatcher.dispatchEvent(new CustomEvent('ld-navigated', {
                detail: {
                    resourceUrl: resourceUrl
                },
                bubbles: true
            }));
        };
        return Helpers;
    }());
    LdNavigation.Helpers = Helpers;
})(LdNavigation || (LdNavigation = {}));
/// <reference path="LdNavigation.ts" />
'use strict';
var resourceUrlAttrName = 'resource-url';
var LinkedDataLink = (function (_super) {
    __extends(LinkedDataLink, _super);
    function LinkedDataLink() {
        _super.apply(this, arguments);
    }
    LinkedDataLink.prototype.createdCallback = function () {
        var _this = this;
        if (this.hasAttribute(resourceUrlAttrName)) {
            this.resourceUrl = this.getAttribute(resourceUrlAttrName);
        }
        this.addEventListener('click', function (e) {
            LdNavigation.Helpers.fireNavigation(_this, _this.resourceUrl);
            e.preventDefault();
        });
    };
    Object.defineProperty(LinkedDataLink.prototype, "resourceUrl", {
        get: function () {
            return this._resourceUrl;
        },
        set: function (url) {
            this._resourceUrl = url;
            this.setAttribute('href', url);
        },
        enumerable: true,
        configurable: true
    });
    LinkedDataLink.prototype.attributeChangedCallback = function (attr, oldVal, newVal) {
        if (attr === resourceUrlAttrName) {
            this.resourceUrl = newVal;
        }
    };
    return LinkedDataLink;
}(HTMLAnchorElement));
document.registerElement('ld-link', {
    prototype: LinkedDataLink.prototype,
    extends: 'a'
});
/// <reference path="LdNavigation.ts" />
var LdNavigationContextElement = (function (_super) {
    __extends(LdNavigationContextElement, _super);
    function LdNavigationContextElement() {
        _super.apply(this, arguments);
    }
    LdNavigationContextElement.prototype.createdCallback = function () {
        if (this.getAttribute('base')) {
            LdNavigation.Context.base = this.getAttribute('base');
        }
        if (this.getAttribute('client-base-path')) {
            LdNavigation.Context.clientBasePath = this.getAttribute('client-base-path');
        }
    };
    LdNavigationContextElement.prototype.attributeChangedCallback = function (attr, oldVal, newVal) {
        switch (attr) {
            case 'base':
                LdNavigation.Context.base = newVal;
                break;
            case 'client-base-path':
                LdNavigation.Context.clientBasePath = newVal;
                break;
        }
    };
    return LdNavigationContextElement;
}(HTMLElement));
document.registerElement('ld-navigation-context', LdNavigationContextElement);
/// <reference path="LdNavigation.ts" />
'use strict';
(function (window, document) {
    var currentResourceUrl;
    var NavigationHistoryElement = (function (_super) {
        __extends(NavigationHistoryElement, _super);
        function NavigationHistoryElement() {
            _super.apply(this, arguments);
        }
        NavigationHistoryElement.prototype.createdCallback = function () {
            if (!(window.history && window.history.pushState)) {
                this.setAttribute('use-hash-fragment', '');
            }
        };
        NavigationHistoryElement.prototype.attachedCallback = function () {
            var _this = this;
            if (document.location.hash) {
                hashChanged.call(this);
            }
            this._ldNavigatedHandler = function (e) {
                currentResourceUrl = e.detail.resourceUrl;
                if (usesHashFragment(_this)) {
                    document.location.hash = getStatePath.call(_this, e.detail.resourceUrl);
                }
                else if (e.detail.resourceUrl !== history.state) {
                    history.pushState(e.detail.resourceUrl, '', getStatePath.call(_this, e.detail.resourceUrl));
                }
            };
            window.addEventListener('ld-navigated', this._ldNavigatedHandler);
            this._popstateHandler = function () {
                if (usesHashFragment(_this) === false) {
                    LdNavigation.Helpers.fireNavigation(_this, history.state);
                }
            };
            window.addEventListener('popstate', this._popstateHandler);
            this._hashchangeHandler = hashChanged.bind(this);
            window.addEventListener('hashchange', this._hashchangeHandler);
        };
        NavigationHistoryElement.prototype.detachedCallback = function () {
            window.removeEventListener('ld-navigated', this._ldNavigatedHandler);
            window.removeEventListener('popstate', this._popstateHandler);
            window.removeEventListener('hashchange', this._hashchangeHandler);
        };
        return NavigationHistoryElement;
    }(HTMLElement));
    function getStatePath(absoluteUrl) {
        var resourcePath;
        if (resourceUrlMatchesBase(absoluteUrl)) {
            resourcePath = absoluteUrl.replace(new RegExp('^' + LdNavigation.Context.base), '');
        }
        else if (usesHashFragment(this)) {
            resourcePath = absoluteUrl;
        }
        else {
            resourcePath = '/' + absoluteUrl;
        }
        if (LdNavigation.Context.clientBasePath && usesHashFragment(this) === false) {
            return '/' + LdNavigation.Context.clientBasePath + resourcePath;
        }
        return resourcePath;
    }
    function hashChanged() {
        if (usesHashFragment(this)) {
            var resourceUrl = document.location.hash.substr(1, document.location.hash.length - 1);
            if (!/^http:\/\//.test(resourceUrl)) {
                resourceUrl = LdNavigation.Context.base + resourceUrl;
            }
            if (currentResourceUrl !== resourceUrl) {
                LdNavigation.Helpers.fireNavigation(this, resourceUrl);
            }
        }
    }
    function resourceUrlMatchesBase(absoluteUrl) {
        return !!LdNavigation.Context.base && !!absoluteUrl.match('^' + LdNavigation.Context.base);
    }
    function usesHashFragment(historyElement) {
        return historyElement.getAttribute('use-hash-fragment') !== null;
    }
    document.registerElement('ld-navigation-history', NavigationHistoryElement);
})(window, document);
/// <reference path="LdNavigation.ts" />
var LdNavigatorElement = (function (_super) {
    __extends(LdNavigatorElement, _super);
    function LdNavigatorElement() {
        _super.apply(this, arguments);
    }
    LdNavigatorElement.prototype.attachedCallback = function () {
        this._ldNavigatedHandler = handleLdNavigated.bind(this);
        window.addEventListener('ld-navigated', this._ldNavigatedHandler);
        notifyResourceUrlChanged.call(this, this.resourceUrl);
    };
    LdNavigatorElement.prototype.detachedCallback = function () {
        window.removeEventListener('ld-navigated', this._ldNavigatedHandler);
    };
    LdNavigatorElement.prototype.createdCallback = function () {
        this.base = this.getAttribute('base') || '';
        this.clientBasePath = this.getAttribute('client-base-path') || '';
    };
    LdNavigatorElement.prototype.attributeChangedCallback = function (attr, oldVal, newVal) {
        switch (attr) {
            case 'base':
                this.base = newVal;
                break;
            case 'client-base-path':
                this.clientBasePath = newVal;
                break;
        }
    };
    Object.defineProperty(LdNavigatorElement.prototype, "resourceUrl", {
        get: function () {
            var path = document.location.pathname;
            if (this._clientBasePath) {
                path = path.replace(new RegExp('\/' + this._clientBasePath + '\/'), '');
            }
            if (/^http:\/\//.test(path)) {
                return path + document.location.search;
            }
            else {
                if (this._clientBasePath) {
                    path = '/' + path;
                }
                return this._base + path + document.location.search;
            }
        },
        set: function (url) {
            if (this._resourceUrl != url) {
                this._resourceUrl = url;
                notifyResourceUrlChanged.call(this, url);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LdNavigatorElement.prototype, "base", {
        get: function () {
            return this._base;
        },
        set: function (url) {
            if (url && url.replace) {
                url = url.replace(new RegExp('/$'), '');
            }
            this._base = url || '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LdNavigatorElement.prototype, "clientBasePath", {
        get: function () {
            return this._clientBasePath;
        },
        set: function (clientBasePath) {
            this._clientBasePath = clientBasePath || '';
        },
        enumerable: true,
        configurable: true
    });
    return LdNavigatorElement;
}(HTMLElement));
function handleLdNavigated(e) {
    this.resourceUrl = e.detail.resourceUrl;
}
function notifyResourceUrlChanged(url) {
    this.dispatchEvent(new CustomEvent('resource-url-changed', {
        detail: {
            value: url
        }
    }));
}
document.registerElement('ld-navigator', LdNavigatorElement);
//# sourceMappingURL=ld-navigation.js.map