/// <reference path="LdNavigation.ts" />

class LdNavigatorElement extends HTMLElement {
    private _resourceUrl;
    private _ldNavigatedHandler;
    private _base;
    private _clientBasePath;

    attachedCallback() {
        this._ldNavigatedHandler = handleLdNavigated.bind(this);
        window.addEventListener('ld-navigated', this._ldNavigatedHandler);
        notifyResourceUrlChanged.call(this, this.resourceUrl);
    }

    detachedCallback() {
        window.removeEventListener('ld-navigated', this._ldNavigatedHandler);
    }

    createdCallback() {
        this.base = this.getAttribute('base') || '';
        this.clientBasePath = this.getAttribute('client-base-path') || '';
    }

    attributeChangedCallback(attr, oldVal, newVal) {
        switch(attr) {
            case 'base':
                this.base = newVal;
                break;
            case 'client-base-path':
                this.clientBasePath = newVal;
                break;
        }
    }

    get resourceUrl():string {
            var path = document.location.pathname;

            if(this._clientBasePath) {
                path = path.replace(new RegExp('\/' + this._clientBasePath + '\/'), '');
            }

            if(/^http:\/\//.test(path)) {
                return path + document.location.search;
            } else {
                if(this._clientBasePath) {
                    path = '/' + path;
                }

                return this._base + path + document.location.search;
            }
    }

    set resourceUrl(url:string) {
        if (this._resourceUrl != url) {
            this._resourceUrl = url;
            notifyResourceUrlChanged.call(this, url);
        }
    }

    get base(): string {
        return this._base;
    }

    set base(url:string) {
        if (url && url.replace) {
            url = url.replace(new RegExp('/$'), '');
        }

        this._base = url || '';
    }

    get clientBasePath(): string{
        return this._clientBasePath;
    }

    set clientBasePath(clientBasePath: string) {
        this._clientBasePath = clientBasePath || '';
    }
}

function handleLdNavigated(e:CustomEvent) {
    this.resourceUrl = e.detail.resourceUrl;
}

function notifyResourceUrlChanged(url) {
    this.dispatchEvent(new CustomEvent('resource-url-changed', {
        detail: {
            value: url
        }
    }));
}

document.registerElement('ld-navigator', LdNavigatorElement);
