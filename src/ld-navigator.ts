/// <reference path="LdNavigation.ts" />

class LdNavigatorElement extends HTMLElement {
    private _resourceUrl;
    private _ldNavigatedHandler;

    attachedCallback() {
        this._ldNavigatedHandler = handleLdNavigated.bind(this);
        window.addEventListener('ld-navigated', this._ldNavigatedHandler);
        notifyResourceUrlChanged.call(this, this.resourceUrl);
    }

    detachedCallback() {
        window.removeEventListener('ld-navigated', this._ldNavigatedHandler);
    }

    get resourceUrl():string {
        if (!this._resourceUrl) {
            var path = document.location.pathname;

            if(LdNavigation.Context.clientBasePath) {
                path = path.replace('\/' + LdNavigation.Context.clientBasePath, '');
            }

            this._resourceUrl = LdNavigation.Context.base + path + document.location.search;
        }

        return this._resourceUrl;
    }

    set resourceUrl(url:string) {
        if (this._resourceUrl != url) {
            this._resourceUrl = url;
            notifyResourceUrlChanged.call(this, url);
        }
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
