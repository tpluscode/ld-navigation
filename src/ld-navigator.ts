/// <reference path="LdNavigation.ts" />

class LdNavigatorElement extends HTMLElement {
    private _base;
    private _clientBasePath;
    private _handlers;

    attachedCallback() {
        this._handlers = [];

        this._handlers.push({ event: 'ld-navigated', handler: this._handleNavigation.bind(this) });
        this._handlers.push({ event: 'popstate', handler: this._navigateOnPopstate.bind(this) });
        this._handlers.push({ event: 'hashchange', handler: this._notifyOnHashchange.bind(this) });

        this._handlers.forEach(h => {
            window.addEventListener(h.event, h.handler);
        });

        notifyResourceUrlChanged(this);
    }

    createdCallback() {
        this.base = this.getAttribute('base') || '';
        this.clientBasePath = this.getAttribute('client-base-path') || '';

        if (!(window.history && window.history.pushState)) {
            this.useHashFragment = true;
        }
    }

    detachedCallback() {
        this._handlers.forEach(h => {
            window.removeEventListener(h.event, h.handler);
        });
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
        const path = this.resourcePath;

        if(/^http:\/\//.test(path)) {
            return path + document.location.search;
        } else {
            return this._base + '/' + path + document.location.search;
        }
    }

    get resourcePath(): string {
        const path = (this.useHashFragment
            ? document.location.hash.substr(1, document.location.hash.length - 1)
            : document.location.pathname).replace(/^\//, '');

        if(this._clientBasePath) {
            return path.replace(new RegExp('^' + this._clientBasePath + '\/'), '');
        }

        return path;
    }

    get statePath() {
        return '/' + this.resourcePath;
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

    get useHashFragment(): boolean {
        return this.getAttribute('use-hash-fragment') !== null
    }

    set useHashFragment(useHash: boolean) {
        if(useHash) {
            this.setAttribute('use-hash-fragment', '');
        } else{
            this.removeAttribute('use-hash-fragment');
        }
    }

    private _handleNavigation(e: CustomEvent) {
        let prevUrl = this.resourceUrl;

        if (this.useHashFragment) {
            document.location.hash = this._getStatePath(e.detail.resourceUrl);
        } else if (e.detail.resourceUrl !== history.state) {
            history.pushState(e.detail.resourceUrl, '', this._getStatePath(e.detail.resourceUrl));
        }

        if(prevUrl !== this.resourceUrl){
            notifyResourceUrlChanged(this);
        }
    }

    private _getStatePath(absoluteUrl: string): string {

        let resourcePath;

        if (this._resourceUrlMatchesBase(absoluteUrl)) {
            resourcePath = absoluteUrl.replace(new RegExp('^' + this.base), '');
        } else if (this.useHashFragment) {
            resourcePath = absoluteUrl;
        } else {
            resourcePath = '/' + absoluteUrl;
        }

        if(this.clientBasePath && this.useHashFragment === false) {
            return '/' + this.clientBasePath + resourcePath;
        }

        return resourcePath;
    }

    private _navigateOnPopstate() {
        if (this.useHashFragment === false) {
            notifyResourceUrlChanged(this);
        }
    }

    private _resourceUrlMatchesBase(absoluteUrl: string): boolean {
        return !!this.base && !!absoluteUrl.match('^' + this.base);
    }

    private _notifyOnHashchange() {
        if (this.useHashFragment) {
            notifyResourceUrlChanged(this);
        }
    }
}

function notifyResourceUrlChanged(elem: LdNavigatorElement) {
    elem.dispatchEvent(new CustomEvent('resource-url-changed', {
        detail: {
            value: elem.resourceUrl
        }
    }));
}

document['registerElement']('ld-navigator', LdNavigatorElement);
