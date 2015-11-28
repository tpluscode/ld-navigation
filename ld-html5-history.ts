/// <reference path="LdNavigation.ts" />

'use strict';

class Html5HistoryElement extends HTMLElement {

    attachedCallback(){
        window.addEventListener('popstate', () => {
            this.dispatchEvent(new CustomEvent('resource-url-changed', {
                detail:{
                    value: this.resourceUrl
                }
            }));
        });
    }

    get resourceUrl(): string {
        var resourcePath = document.location.pathname + document.location.search;

        return LdNavigation.Context.base + resourcePath;
    }
}

document.registerElement('ld-html5-history', Html5HistoryElement);