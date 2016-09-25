/// <reference path="LdNavigation.ts" />

class LdNavigatorElement extends HTMLElement {
    private _resourceUrl;

    createdCallback() {
        this.base = this.getAttribute('base') || '';
        window.addEventListener('ld-navigated', this._handleLdNavigated);
    }

    attachedCallback() {
        notifyResourceUrlChanged.call(this, this.resourceUrl);
    }

    detachedCallback() {
        window.removeEventListener('ld-navigated', this._handleLdNavigated);
    }

    get base():string {
        return LdNavigation.Context.base;
    }

    set base(url:string) {
        LdNavigation.Context.base = url;
        this._resourceUrl = null;
        notifyResourceUrlChanged.call(this, url);
    }

    get resourceUrl():string {
        if (!this._resourceUrl) {
            this._resourceUrl = LdNavigation.Context.base + document.location.pathname + document.location.search;
        }

        return this._resourceUrl;
    }

    set resourceUrl(url:string) {
        if (this._resourceUrl != url) {
            this._resourceUrl = url;
            notifyResourceUrlChanged.call(this, url);
        }
    }

    attributeChangedCallback(attr, oldVal, newVal) {
        if (attr === 'base') {
            this.base = newVal;
        }
    }

    _handleLdNavigated(e:CustomEvent) {
        this.resourceUrl = e.detail.resourceUrl
    }
}

function notifyResourceUrlChanged(url) {
    this.dispatchEvent(new CustomEvent('resource-url-changed', {
        detail: {
            value: url
        }
    }));
}

document.registerElement('ld-navigator', LdNavigatorElement);
