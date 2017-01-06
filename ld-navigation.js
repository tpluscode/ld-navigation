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
        return _super.apply(this, arguments) || this;
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
document['registerElement']('ld-link', {
    prototype: LinkedDataLink.prototype,
    extends: 'a'
});
/// <reference path="LdNavigation.ts" />
var LdNavigatorElement = (function (_super) {
    __extends(LdNavigatorElement, _super);
    function LdNavigatorElement() {
        return _super.apply(this, arguments) || this;
    }
    LdNavigatorElement.prototype.attachedCallback = function () {
        this._handlers = [];
        this._handlers.push({ event: 'ld-navigated', handler: this._handleNavigation.bind(this) });
        this._handlers.push({ event: 'popstate', handler: this._navigateOnPopstate.bind(this) });
        this._handlers.push({ event: 'hashchange', handler: this._notifyOnHashchange.bind(this) });
        this._handlers.forEach(function (h) {
            window.addEventListener(h.event, h.handler);
        });
        notifyResourceUrlChanged(this);
    };
    LdNavigatorElement.prototype.createdCallback = function () {
        this.base = this.getAttribute('base') || '';
        this.clientBasePath = this.getAttribute('client-base-path') || '';
        if (!(window.history && window.history.pushState)) {
            this.useHashFragment = true;
        }
    };
    LdNavigatorElement.prototype.detachedCallback = function () {
        this._handlers.forEach(function (h) {
            window.removeEventListener(h.event, h.handler);
        });
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
            var path = this.resourcePath;
            if (/^http:\/\//.test(path)) {
                return path + document.location.search;
            }
            else {
                return this._base + '/' + path + document.location.search;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LdNavigatorElement.prototype, "resourcePath", {
        get: function () {
            var path = (this.useHashFragment
                ? document.location.hash.substr(1, document.location.hash.length - 1)
                : document.location.pathname).replace(/^\//, '');
            if (this._clientBasePath) {
                return path.replace(new RegExp('^' + this._clientBasePath + '\/'), '');
            }
            return path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LdNavigatorElement.prototype, "statePath", {
        get: function () {
            return '/' + this.resourcePath;
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
    Object.defineProperty(LdNavigatorElement.prototype, "useHashFragment", {
        get: function () {
            return this.getAttribute('use-hash-fragment') !== null;
        },
        set: function (useHash) {
            if (useHash) {
                this.setAttribute('use-hash-fragment', '');
            }
            else {
                this.removeAttribute('use-hash-fragment');
            }
        },
        enumerable: true,
        configurable: true
    });
    LdNavigatorElement.prototype._handleNavigation = function (e) {
        var prevUrl = this.resourceUrl;
        if (this.useHashFragment) {
            document.location.hash = this._getStatePath(e.detail.resourceUrl);
        }
        else if (e.detail.resourceUrl !== history.state) {
            history.pushState(e.detail.resourceUrl, '', this._getStatePath(e.detail.resourceUrl));
        }
        if (prevUrl !== this.resourceUrl) {
            notifyResourceUrlChanged(this);
        }
    };
    LdNavigatorElement.prototype._getStatePath = function (absoluteUrl) {
        var resourcePath;
        if (this._resourceUrlMatchesBase(absoluteUrl)) {
            resourcePath = absoluteUrl.replace(new RegExp('^' + this.base), '');
        }
        else if (this.useHashFragment) {
            resourcePath = absoluteUrl;
        }
        else {
            resourcePath = '/' + absoluteUrl;
        }
        if (this.clientBasePath && this.useHashFragment === false) {
            return '/' + this.clientBasePath + resourcePath;
        }
        return resourcePath;
    };
    LdNavigatorElement.prototype._navigateOnPopstate = function () {
        if (this.useHashFragment === false) {
            notifyResourceUrlChanged(this);
        }
    };
    LdNavigatorElement.prototype._resourceUrlMatchesBase = function (absoluteUrl) {
        return !!this.base && !!absoluteUrl.match('^' + this.base);
    };
    LdNavigatorElement.prototype._notifyOnHashchange = function () {
        if (this.useHashFragment) {
            notifyResourceUrlChanged(this);
        }
    };
    return LdNavigatorElement;
}(HTMLElement));
function notifyResourceUrlChanged(elem) {
    elem.dispatchEvent(new CustomEvent('resource-url-changed', {
        detail: {
            value: elem.resourceUrl
        }
    }));
}
document['registerElement']('ld-navigator', LdNavigatorElement);
//# sourceMappingURL=ld-navigation.js.map