'use strict';

class Html5HistoryElement extends HTMLElement {
    private _baseURL: string;

    createdCallback() {
        this.baseUrl = this.getAttribute('base-url') || '';
    }

    attachedCallback(){
        window.addEventListener('popstate', () => {
            this.dispatchEvent(new CustomEvent('resource-url-changed', {
                detail:{
                    value: this.resourceUrl
                }
            }));
        });
    }

    get baseUrl(): string {
        return this._baseURL;
    }
    set baseUrl(url: string){
        this._baseURL = url;

        this.dispatchEvent(new CustomEvent('resource-url-changed', {
            detail:{
                value: this.resourceUrl
            }
        }));
    }

    get resourceUrl(): string {
        var resourcePath = document.location.pathname + document.location.search;

        return this.baseUrl + resourcePath;
    }

    attributeChangedCallback(attr, oldVal, newVal) {
        if(attr === 'base-url'){
            this.baseUrl = newVal;
        }
    }
}

document.registerElement('ld-html5-history', Html5HistoryElement);