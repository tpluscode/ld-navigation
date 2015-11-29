/// <reference path="LdNavigation.ts" />

class LdNavigatorElement extends HTMLElement {

    createdCallback() {
        this.base = this.getAttribute('base');
    }

    get base(): string {
        return LdNavigation.Context.base;
    }
    set base(url: string){
        LdNavigation.Context.base = url;
    }

    attributeChangedCallback(attr, oldVal, newVal) {
        if(attr === 'base') {
            this.base = newVal;
        }
    }
}

document.registerElement('ld-navigator', LdNavigatorElement);
