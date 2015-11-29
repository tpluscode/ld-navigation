/// <reference path="LdNavigation.ts" />

'use strict';

class Html5HistoryElement extends HTMLElement {

    attachedCallback() {
        window.addEventListener('ld-navigated', (e:CustomEvent) => {
            if (e.detail.resourceUrl !== history.state) {
                history.pushState(e.detail.resourceUrl, '', this.getStatePath(e.detail.resourceUrl));
            }
        });

        window.addEventListener('popstate', (e: CustomEvent) => {
            this.dispatchEvent(new CustomEvent('ld-navigated', {
                detail: {
                    resourceUrl: history.state
                },
                 bubbles: true
            }));
        });
    }

    private getStatePath(absoluteUrl:string):string {

        if (LdNavigation.Context.base === new URL(absoluteUrl).origin) {
            return absoluteUrl.replace(new RegExp('^' + LdNavigation.Context.base), '');
        }

        return '/' + absoluteUrl;
    }
}

document.registerElement('ld-html5-history', Html5HistoryElement);