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
    LdNavigation.Context = new LdContext();
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
        window.addEventListener('popstate', function () {
            _this.dispatchEvent(new CustomEvent('resource-url-changed', {
                detail: {
                    value: _this.resourceUrl
                }
            }));
        });
    };
    Object.defineProperty(Html5HistoryElement.prototype, "resourceUrl", {
        get: function () {
            var resourcePath = document.location.pathname + document.location.search;
            return LdNavigation.Context.base + resourcePath;
        },
        enumerable: true,
        configurable: true
    });
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
            _this.dispatchEvent(new CustomEvent('ld-navigated', {
                detail: {
                    resourceUrl: _this.resourceUrl
                },
                bubbles: true
            }));
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
    LdNavigatorElement.prototype.attributeChangedCallback = function (attr, oldVal, newVal) {
        if (attr === 'base') {
            this.base = newVal;
        }
    };
    return LdNavigatorElement;
})(HTMLElement);
document.registerElement('ld-navigator', LdNavigatorElement);
//# sourceMappingURL=ld-navigation.js.map