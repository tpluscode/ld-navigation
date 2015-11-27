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
    Html5HistoryElement.prototype.createdCallback = function () {
        this._baseURL = '';
    };
    Object.defineProperty(Html5HistoryElement.prototype, "baseURL", {
        get: function () {
            return this._baseURL;
        },
        set: function (url) {
            this._baseURL = url;
        },
        enumerable: true,
        configurable: true
    });
    return Html5HistoryElement;
})(HTMLElement);
document.registerElement('ld-html5-history', Html5HistoryElement);
//# sourceMappingURL=ld-html5-history.js.map