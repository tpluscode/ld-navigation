/// <reference path="LdNavigation.ts" />
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LinkedDataLink = (function (_super) {
    __extends(LinkedDataLink, _super);
    function LinkedDataLink() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(LinkedDataLink.prototype, "resourceUrl", {
        get: function () {
            return this._resourceUrl;
        },
        set: function (url) {
        },
        enumerable: true,
        configurable: true
    });
    return LinkedDataLink;
})(HTMLAnchorElement);
document.registerElement('ld-link', LinkedDataLink);
//# sourceMappingURL=ld-link.js.map