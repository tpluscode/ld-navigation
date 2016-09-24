/// <reference path="LdNavigation.ts" />

'use strict';

class Html5HistoryElement extends HTMLElement {

    createdCallback() {
        if (!(window.history && window.history.pushState)) {
            this.setAttribute('use-hash-fragment', '');
        }
    }

    attachedCallback() {
        window.addEventListener('ld-navigated', (e: CustomEvent) => {
            if (usesHashFragment(this)) {
                document.location.hash = e.detail.resourceUrl;
            } else if (e.detail.resourceUrl !== history.state) {
                history.pushState(e.detail.resourceUrl, '', this.getStatePath(e.detail.resourceUrl));
            }
        });

        window.addEventListener('popstate', () => {
            if (usesHashFragment(this) === false) {
                LdNavigation.Helpers.fireNavigation(this, history.state);
            }
        });

        window.addEventListener('hashchange', () => {
            if (usesHashFragment(this)) {
                var resourceUrl = document.location.hash.substr(1, document.location.hash.length - 1);
                LdNavigation.Helpers.fireNavigation(this, resourceUrl);
            }
        });
    }

    private getStatePath(absoluteUrl: string): string {

        if (LdNavigation.Context.base === new URL(absoluteUrl).origin) {
            return absoluteUrl.replace(new RegExp('^' + LdNavigation.Context.base), '');
        }

        return '/' + absoluteUrl;
    }
}

function usesHashFragment(historyElement: Html5HistoryElement): boolean {
    return historyElement.getAttribute('use-hash-fragment') !== null;
}

document.registerElement('ld-html5-history', Html5HistoryElement);