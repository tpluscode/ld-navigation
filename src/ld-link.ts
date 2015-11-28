/// <reference path="LdNavigation.ts" />

'use strict';

class LinkedDataLink extends HTMLAnchorElement {
    private _resourceUrl;

    get resourceUrl(): string {
        return this._resourceUrl;
    }

    set resourceUrl(url: string) {

    }
}

document.registerElement('ld-link', LinkedDataLink);