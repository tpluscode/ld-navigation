/// <reference path="LdNavigation.ts" />

class LdNavigatorElement extends HTMLElement {
    private _resourceUrl;
    private _ldNavigatedHandler;
    private _historyHandler;
    private _base;
    private _clientBasePath;
    private _popstateHandler;
    private _hashchangeHandler;

    attachedCallback() {
        this._ldNavigatedHandler = handleLdNavigated.bind(this);
        window.addEventListener('ld-navigated', this._ldNavigatedHandler);
        notifyResourceUrlChanged.call(this, this.resourceUrl);

        this._historyHandler = (e: CustomEvent) => {
            if (usesHashFragment(this)) {
                document.location.hash = getStatePath.call(this, e.detail.resourceUrl);
            } else if (e.detail.resourceUrl !== history.state) {
                history.pushState(e.detail.resourceUrl, '', getStatePath.call(this, e.detail.resourceUrl));
            }
        };
        window.addEventListener('ld-navigated', this._historyHandler);

        this._popstateHandler = () => {
            if (usesHashFragment(this) === false) {
                LdNavigation.Helpers.fireNavigation(this, history.state);
            }
        };
        window.addEventListener('popstate', this._popstateHandler);

        this._hashchangeHandler = hashChanged.bind(this);
        window.addEventListener('hashchange', this._hashchangeHandler);
    }

    detachedCallback() {
        window.removeEventListener('ld-navigated', this._ldNavigatedHandler);
        window.removeEventListener('ld-navigated',this._historyHandler);
        window.removeEventListener('popstate',this._popstateHandler);
        window.removeEventListener('hashchange', this._hashchangeHandler);
    }

    createdCallback() {
        this.base = this.getAttribute('base') || '';
        this.clientBasePath = this.getAttribute('client-base-path') || '';

        if (!(window.history && window.history.pushState)) {
            this.setAttribute('use-hash-fragment', '');
        }
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
            var path = usesHashFragment(this)
                ? document.location.hash.substr(1, document.location.hash.length - 1)
                : document.location.pathname;

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

function getStatePath(absoluteUrl: string): string {

    var resourcePath;

    if (resourceUrlMatchesBase.call(this, absoluteUrl)) {
        resourcePath = absoluteUrl.replace(new RegExp('^' + this.base), '');
    } else if (usesHashFragment(this)) {
        resourcePath = absoluteUrl;
    } else {
        resourcePath = '/' + absoluteUrl;
    }

    if(this.clientBasePath && usesHashFragment(this) === false) {
        return '/' + this.clientBasePath + resourcePath;
    }

    return resourcePath;
}

function hashChanged() {
    if (usesHashFragment(this)) {
        notifyResourceUrlChanged.call(this, this.resourceUrl);
    }
}

function resourceUrlMatchesBase(absoluteUrl: string): boolean {
    return !!this.base && !!absoluteUrl.match('^' + this.base);
}

function usesHashFragment(historyElement: HTMLElement): boolean {
    return historyElement.getAttribute('use-hash-fragment') !== null;
}

document.registerElement('ld-navigator', LdNavigatorElement);
