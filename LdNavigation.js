var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
    var context = new LdContext();
    var LdNavigatorElement = (function (_super) {
        __extends(LdNavigatorElement, _super);
        function LdNavigatorElement() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(LdNavigatorElement.prototype, "base", {
            get: function () {
                return context.base;
            },
            set: function (url) {
                context.base = url;
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
    var LdNamespaceElement = (function (_super) {
        __extends(LdNamespaceElement, _super);
        function LdNamespaceElement() {
            _super.apply(this, arguments);
        }
        return LdNamespaceElement;
    })(HTMLElement);
    LdNavigation.Context = context;
    document.registerElement('ld-navigator', LdNavigatorElement);
    document.registerElement('ld-namespace', LdNamespaceElement);
})(LdNavigation || (LdNavigation = {}));
//# sourceMappingURL=LdNavigation.js.map