'use strict';

class Html5HistoryElement extends HTMLElement {
    private _baseURL: string;

    createdCallback() {
        this._baseURL = '';
    }

    get baseUrl(): string {
        return this._baseURL;
    }
    set baseUrl(url: string){
        this._baseURL = url;
    }

    get resourceUrl(): string {
        return '/example/path';
    }

    attributeChangedCallback(attr, oldVal, newVal) {
        if(attr === 'baseurl'){
            this.baseUrl = newVal;
        }
    }
}

document.registerElement('ld-html5-history', Html5HistoryElement);