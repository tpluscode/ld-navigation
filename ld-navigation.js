var LdNavigation;
(function (LdNavigation) {
    var LdContext = (function () {
        function LdContext() {
            this._base = '';
        }
        Object.defineProperty(LdContext.prototype, "base", {
            get: function () {
                return this._base;
            },
            set: function (url) {
                if (url && url.replace) {
                    url = url.replace(new RegExp('/$'), '');
                }
                this._base = url;
            },
            enumerable: true,
            configurable: true
        });
        LdContext.prototype.clear = function () {
            this.base = '';
        };
        return LdContext;
    })();
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
    })();
    LdNavigation.Helpers = Helpers;
    var context = new LdContext();
    if (LdNavigation && LdNavigation.Context) {
        context.base = LdNavigation.Context.base;
    }
    LdNavigation.Context = context;
})(LdNavigation || (LdNavigation = {}));
/// <reference path="LdNavigation.ts" />
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Html5HistoryElement = (function (_super) {
    __extends(Html5HistoryElement, _super);
    function Html5HistoryElement() {
        _super.apply(this, arguments);
    }
    Html5HistoryElement.prototype.attachedCallback = function () {
        var _this = this;
        window.addEventListener('ld-navigated', function (e) {
            if (e.detail.resourceUrl !== history.state) {
                history.pushState(e.detail.resourceUrl, '', _this.getStatePath(e.detail.resourceUrl));
            }
        });
        window.addEventListener('popstate', function () {
            LdNavigation.Helpers.fireNavigation(_this, history.state);
        });
    };
    Html5HistoryElement.prototype.getStatePath = function (absoluteUrl) {
        if (LdNavigation.Context.base === new URL(absoluteUrl).origin) {
            return absoluteUrl.replace(new RegExp('^' + LdNavigation.Context.base), '');
        }
        return '/' + absoluteUrl;
    };
    return Html5HistoryElement;
})(HTMLElement);
document.registerElement('ld-html5-history', Html5HistoryElement);
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
})(HTMLAnchorElement);
document.registerElement('ld-link', {
    prototype: LinkedDataLink.prototype,
    extends: 'a'
});
/// <reference path="LdNavigation.ts" />
var LdNavigatorElement = (function (_super) {
    __extends(LdNavigatorElement, _super);
    function LdNavigatorElement() {
        _super.apply(this, arguments);
    }
    LdNavigatorElement.prototype.createdCallback = function () {
        var _this = this;
        this.base = this.getAttribute('base') || '';
        window.addEventListener('ld-navigated', function (e) { return _this.resourceUrl = e.detail.resourceUrl; });
    };
    LdNavigatorElement.prototype.attachedCallback = function () {
        notifyResourceUrlChanged.call(this, this.resourceUrl);
    };
    Object.defineProperty(LdNavigatorElement.prototype, "base", {
        get: function () {
            return LdNavigation.Context.base;
        },
        set: function (url) {
            LdNavigation.Context.base = url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LdNavigatorElement.prototype, "resourceUrl", {
        get: function () {
            if (!this._resourceUrl) {
                this._resourceUrl = LdNavigation.Context.base + document.location.pathname + document.location.search;
            }
            return this._resourceUrl;
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
    LdNavigatorElement.prototype.attributeChangedCallback = function (attr, oldVal, newVal) {
        if (attr === 'base') {
            this.base = newVal;
        }
    };
    return LdNavigatorElement;
})(HTMLElement);
function notifyResourceUrlChanged(url) {
    this.dispatchEvent(new CustomEvent('resource-url-changed', {
        detail: {
            value: url
        }
    }));
}
document.registerElement('ld-navigator', LdNavigatorElement);
//# sourceMappingURL=ld-navigation.js.map