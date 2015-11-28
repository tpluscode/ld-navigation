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
        this.baseUrl = this.getAttribute('base-url') || '';
    };
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
    Object.defineProperty(Html5HistoryElement.prototype, "baseUrl", {
        get: function () {
            return this._baseURL;
        },
        set: function (url) {
            this._baseURL = url;
            this.dispatchEvent(new CustomEvent('resource-url-changed', {
                detail: {
                    value: this.resourceUrl
                }
            }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Html5HistoryElement.prototype, "resourceUrl", {
        get: function () {
            var resourcePath = document.location.pathname + document.location.search;
            return this.baseUrl + resourcePath;
        },
        enumerable: true,
        configurable: true
    });
    Html5HistoryElement.prototype.attributeChangedCallback = function (attr, oldVal, newVal) {
        if (attr === 'base-url') {
            this.baseUrl = newVal;
        }
    };
    return Html5HistoryElement;
})(HTMLElement);
document.registerElement('ld-html5-history', Html5HistoryElement);
//# sourceMappingURL=ld-html5-history.js.map