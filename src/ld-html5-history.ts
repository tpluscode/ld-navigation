/// <reference path="LdNavigation.ts" />

'use strict';

class Html5HistoryElement extends HTMLElement {

    attachedCallback(){
        window.addEventListener('ld-navigated', (e: CustomEvent) => {
            history.pushState(e.detail.resourceUrl, '', this.getStatePath(e.detail.resourceUrl));
        });
    }

    private getStatePath(absoluteUrl: string): string {

        if(LdNavigation.Context.base){
            return absoluteUrl.replace(new RegExp('^' + LdNavigation.Context.base), '');
        }

        return '/' + absoluteUrl;
    }
}

document.registerElement('ld-html5-history', Html5HistoryElement);