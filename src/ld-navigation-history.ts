/// <reference path="LdNavigation.ts" />

'use strict';
(function (window, document) {
    var currentResourceUrl;

    class NavigationHistoryElement extends HTMLElement {

        createdCallback() {
            if (!(window.history && window.history.pushState)) {
                this.setAttribute('use-hash-fragment', '');
            }
        }

        attachedCallback() {
            if (document.location.hash) {
                hashChanged.call(this);
            }

            window.addEventListener('ld-navigated', (e: CustomEvent) => {
                currentResourceUrl = e.detail.resourceUrl;

                if (usesHashFragment(this)) {
                    document.location.hash = this.getStatePath(e.detail.resourceUrl);
                } else if (e.detail.resourceUrl !== history.state) {
                    history.pushState(e.detail.resourceUrl, '', this.getStatePath(e.detail.resourceUrl));
                }
            });

            window.addEventListener('popstate', () => {
                if (usesHashFragment(this) === false) {
                    LdNavigation.Helpers.fireNavigation(this, history.state);
                }
            });

            window.addEventListener('hashchange', hashChanged.bind(this));
        }

        private getStatePath(absoluteUrl: string): string {

            if (resourceUrlMatchesBase(absoluteUrl)) {
                return absoluteUrl.replace(new RegExp('^' + LdNavigation.Context.base), '');
            }

            if (usesHashFragment(this)) {
                return absoluteUrl;
            }

            return '/' + absoluteUrl;
        }
    }

    function hashChanged() {
        if (usesHashFragment(this)) {
            var resourceUrl = document.location.hash.substr(1, document.location.hash.length - 1);

            if (!resourceUrl.match('^http://')) {
                resourceUrl = LdNavigation.Context.base + resourceUrl;
            }

            if (currentResourceUrl !== resourceUrl) {
                LdNavigation.Helpers.fireNavigation(this, resourceUrl);
            }
        }
    }

    function resourceUrlMatchesBase(absoluteUrl: string): boolean {
        return !!LdNavigation.Context.base && !!absoluteUrl.match('^' + LdNavigation.Context.base);
    }

    function usesHashFragment(historyElement: NavigationHistoryElement): boolean {
        return historyElement.getAttribute('use-hash-fragment') !== null;
    }

    document.registerElement('ld-navigation-history', NavigationHistoryElement);
})(window, document);