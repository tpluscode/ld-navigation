/// <reference path="LdNavigation.ts" />

class LdNavigationContextElement extends HTMLElement {

    createdCallback() {
        if(this.getAttribute('base')) {
            LdNavigation.Context.base = this.getAttribute('base');
        }

        if(this.getAttribute('client-base-path')) {
            LdNavigation.Context.clientBasePath = this.getAttribute('client-base-path');
        }
    }

    attributeChangedCallback(attr, oldVal, newVal) {
        switch(attr) {
            case 'base':
                LdNavigation.Context.base = newVal;
                break;
            case 'client-base-path':
                LdNavigation.Context.clientBasePath = newVal;
                break;
        }
    }
}

document.registerElement('ld-navigation-context', LdNavigationContextElement);