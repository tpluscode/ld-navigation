/// <reference path="LdNavigation.ts" />

class LdNavigatorElement extends HTMLElement {
    private _resourceUrl;

    createdCallback() {
        this.base = this.getAttribute('base') || '';

        window.addEventListener('ld-navigated', (e: CustomEvent) => this.resourceUrl = e.detail.resourceUrl);
    }

    get base(): string {
        return LdNavigation.Context.base;
    }
    set base(url: string){
        LdNavigation.Context.base = url;
    }

    get resourceUrl(): string {
        return this._resourceUrl;
    }
    set resourceUrl(url: string) {
        this._resourceUrl = url;

        this.dispatchEvent(new CustomEvent('resource-url-changed', {
            detail: {
                value: url
            }
        }));
    }

    attributeChangedCallback(attr, oldVal, newVal) {
        if(attr === 'base') {
            this.base = newVal;
        }
    }
}

document.registerElement('ld-navigator', LdNavigatorElement);
