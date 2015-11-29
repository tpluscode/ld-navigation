/// <reference path="LdNavigation.ts" />

'use strict';

class Html5HistoryElement extends HTMLElement {

    attachedCallback(){
        window.addEventListener('ld-navigated', (e: CustomEvent) => {
            history.pushState(e.detail.resourceUrl, '', '/' + e.detail.resourceUrl);
        });
    }

    get resourceUrl(): string {
        var resourcePath = document.location.pathname + document.location.search;

        return LdNavigation.Context.base + resourcePath;
    }
}

document.registerElement('ld-html5-history', Html5HistoryElement);