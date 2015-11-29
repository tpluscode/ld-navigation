/// <reference path="LdNavigation.ts" />

'use strict';
const resourceUrlAttrName = 'resource-url';

class LinkedDataLink extends HTMLAnchorElement {
    private _resourceUrl:string;

    createdCallback() {
        if (this.hasAttribute(resourceUrlAttrName)) {
            this.resourceUrl = this.getAttribute(resourceUrlAttrName);
        }

        this.addEventListener('click', e => {
            LdNavigation.Helpers.fireNavigation(this, this.resourceUrl);
            e.preventDefault();
        });
    }

    get resourceUrl():string {
        return this._resourceUrl;
    }

    set resourceUrl(url:string) {
        this._resourceUrl = url;
        this.setAttribute('href', url);
    }

    attributeChangedCallback(attr, oldVal, newVal) {
        if (attr === resourceUrlAttrName) {
            this.resourceUrl = newVal;
        }
    }
}

document.registerElement('ld-link', {
    prototype: LinkedDataLink.prototype,
    extends: 'a'
});