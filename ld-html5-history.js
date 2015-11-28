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
//# sourceMappingURL=ld-html5-history.js.map