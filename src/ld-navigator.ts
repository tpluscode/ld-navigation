/// <reference path="LdNavigation.ts" />

class LdNavigatorElement extends HTMLElement {
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
        this.base = this.getAttribute('base');
        this.clientBasePath = this.getAttribute('client-base-path');
        LdNavigator.Instance.useHashFragment = this.getAttribute('use-hash-fragment') !== null;

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
            case 'use-hash-fragment':
                LdNavigator.Instance.useHashFragment = newVal !== null;
                break;
        }
    }

    get resourceUrl():string {
        return LdNavigator.Instance.resourceUrl;
    }

    get resourcePath(): string {
        return LdNavigator.Instance.resourcePath;
    }

    get statePath() {
        return LdNavigator.Instance.statePath;
    }

    get base(): string {
        return LdNavigator.Instance.base;
    }

    set base(url:string) {
        LdNavigator.Instance.base = url;
    }

    get clientBasePath(): string{
        return LdNavigator.Instance.clientBasePath;
    }

    set clientBasePath(clientBasePath: string) {
        LdNavigator.Instance.clientBasePath = clientBasePath || '';
    }

    get useHashFragment(): boolean {
        return LdNavigator.Instance.useHashFragment;
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
            document.location.hash = LdNavigator.Instance.getStatePath(e.detail.resourceUrl);
        } else if (e.detail.resourceUrl !== history.state) {
            history.pushState(e.detail.resourceUrl, '', LdNavigator.Instance.getStatePath(e.detail.resourceUrl));
        }

        if(prevUrl !== this.resourceUrl){
            notifyResourceUrlChanged(this);
        }
    }

    private _navigateOnPopstate() {
        if (this.useHashFragment === false) {
            notifyResourceUrlChanged(this);
        }
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
