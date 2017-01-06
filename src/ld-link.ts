/// <reference path="LdNavigation.ts" />

const resourceUrlAttrName = 'resource-url';

class LinkedDataLink extends HTMLAnchorElement {
    private _resourceUrl:string;
    private _anchor:HTMLAnchorElement;

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

        if(!this._anchor) {
            this._createAnchor();
        }
    }

    attributeChangedCallback(attr, oldVal, newVal) {
        if (attr === resourceUrlAttrName) {
            this.resourceUrl = newVal;
        }
    }

    private _createAnchor() {
        const state = LdNavigator.Instance.getStatePath(this.resourceUrl);
        console.log(state);
        this._anchor = document.createElement('a');

        if(LdNavigator.Instance.useHashFragment) {
            this._anchor.href = '#' + state;
        } else {
            this._anchor.href = state;
        }

        this.appendChild(this._anchor);
    }
}

document['registerElement']('ld-link', {
    prototype: LinkedDataLink.prototype
});