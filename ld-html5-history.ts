'use strict';

class Html5HistoryElement extends HTMLElement {
    private _baseURL: string;

    createdCallback() {
        this._baseURL = '';
    }

    get baseURL(): string {
        return this._baseURL;
    }
    set baseURL(url: string ){
        this._baseURL = url;
    }

    attributeChangedCallback(attr, oldVal, newVal) {
        if(attr === 'baseurl'){
            this.baseURL = newVal;
        }
    }
}

document.registerElement('ld-html5-history', Html5HistoryElement);