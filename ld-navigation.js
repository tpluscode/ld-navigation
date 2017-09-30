(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.LdNavigation = {})));
}(this, (function (exports) { 'use strict';

class LdNavigator {
    constructor() {
        this._base = '';
        this.clientBasePath = '';
        this.useHashFragment = false;
    }
    get base() {
        return this._base;
    }
    set base(url) {
        if (url && url.replace) {
            url = url.replace(new RegExp('/$'), '');
        }
        this._base = url || '';
    }
    get resourcePath() {
        const path = (this.useHashFragment
            ? document.location.hash.substr(1, document.location.hash.length - 1)
            : document.location.pathname).replace(/^\//, '');
        if (this.clientBasePath) {
            return path.replace(new RegExp('^' + this.clientBasePath + '\/'), '');
        }
        return path;
    }
    get statePath() {
        return this.resourcePath;
    }
    get resourceUrl() {
        const path = this.resourcePath;
        if (/^http:\/\//.test(path)) {
            return path + document.location.search;
        }
        else {
            return this.base + '/' + path + document.location.search;
        }
    }
    getStatePath(absoluteUrl) {
        let resourcePath = absoluteUrl.replace(new RegExp('^' + this.base), '');
        if (resourcePath[0] !== '/') {
            resourcePath = '/' + resourcePath;
        }
        if (this.clientBasePath && this.useHashFragment === false) {
            return '/' + this.clientBasePath + resourcePath;
        }
        return resourcePath;
    }
    _resourceUrlMatchesBase(absoluteUrl) {
        return !!this.base && !!absoluteUrl.match('^' + this.base);
    }
}
var LdNavigator$1 = new LdNavigator();

class Helpers {
    static fireNavigation(dispatcher, resourceUrl) {
        dispatcher.dispatchEvent(new CustomEvent('ld-navigated', {
            detail: {
                resourceUrl: resourceUrl
            },
            bubbles: true,
            composed: true
        }));
    }
}

const resourceUrlAttrName = 'resource-url';
class LinkedDataLink extends HTMLElement {
    constructor() {
        super();
        if (this.hasAttribute(resourceUrlAttrName)) {
            this.resourceUrl = this.getAttribute(resourceUrlAttrName);
        }
        if (this._anchor) {
            this._anchor.addEventListener('click', navigate.bind(this));
        }
        else {
            this.addEventListener('click', navigate.bind(this));
        }
    }
    static get observedAttributes() {
        return [
            resourceUrlAttrName
        ];
    }
    get resourceUrl() {
        return this._resourceUrl;
    }
    set resourceUrl(url) {
        this._resourceUrl = url;
        this.removeAttribute('href');
        if (this._anchor) {
            this._setLink();
        }
    }
    get _anchor() {
        return this.querySelector('a');
    }
    attributeChangedCallback(attr, oldVal, newVal) {
        if (attr === resourceUrlAttrName) {
            this.resourceUrl = newVal;
        }
    }
    _setLink() {
        if (this.resourceUrl) {
            const state = LdNavigator$1.getStatePath(this.resourceUrl);
            if (LdNavigator$1.useHashFragment) {
                this._anchor.href = '#' + state;
            }
            else {
                this._anchor.href = state;
            }
        }
        else {
            this._anchor.removeAttribute('href');
        }
    }
}
function navigate(e) {
    Helpers.fireNavigation(this, this.resourceUrl);
    e.preventDefault();
}
window.customElements.define('ld-link', LinkedDataLink);

class LdNavigatorElement extends HTMLElement {
    connectedCallback() {
        this._handlers = [];
        this._handlers.push({ event: 'ld-navigated', handler: this._handleNavigation.bind(this) });
        this._handlers.push({ event: 'popstate', handler: this._navigateOnPopstate.bind(this) });
        this._handlers.push({ event: 'hashchange', handler: this._notifyOnHashchange.bind(this) });
        this._handlers.forEach(h => {
            window.addEventListener(h.event, h.handler);
        });
        notifyResourceUrlChanged(this);
    }
    constructor() {
        super();
        this.base = this.getAttribute('base');
        this.clientBasePath = this.getAttribute('client-base-path');
        LdNavigator$1.useHashFragment = this.getAttribute('use-hash-fragment') !== null;
        if (!(window.history && window.history.pushState)) {
            this.useHashFragment = true;
        }
    }
    static get observedAttributes() {
        return [
            'base',
            'client-base-path',
            'use-hash-fragment'
        ];
    }
    disconnectedCallback() {
        this._handlers.forEach(h => {
            window.removeEventListener(h.event, h.handler);
        });
    }
    attributeChangedCallback(attr, oldVal, newVal) {
        switch (attr) {
            case 'base':
                this.base = newVal;
                break;
            case 'client-base-path':
                this.clientBasePath = newVal;
                break;
            case 'use-hash-fragment':
                LdNavigator$1.useHashFragment = newVal !== null;
                break;
        }
    }
    get resourceUrl() {
        return LdNavigator$1.resourceUrl;
    }
    get resourcePath() {
        return LdNavigator$1.resourcePath;
    }
    get statePath() {
        return LdNavigator$1.statePath;
    }
    get base() {
        return LdNavigator$1.base;
    }
    set base(url) {
        LdNavigator$1.base = url;
    }
    get clientBasePath() {
        return LdNavigator$1.clientBasePath;
    }
    set clientBasePath(clientBasePath) {
        LdNavigator$1.clientBasePath = clientBasePath || '';
    }
    get useHashFragment() {
        return LdNavigator$1.useHashFragment;
    }
    set useHashFragment(useHash) {
        if (useHash) {
            this.setAttribute('use-hash-fragment', '');
        }
        else {
            this.removeAttribute('use-hash-fragment');
        }
    }
    _handleNavigation(e) {
        let prevUrl = this.resourceUrl;
        if (this.useHashFragment) {
            document.location.hash = LdNavigator$1.getStatePath(e.detail.resourceUrl);
        }
        else if (e.detail.resourceUrl !== history.state) {
            history.pushState(e.detail.resourceUrl, '', LdNavigator$1.getStatePath(e.detail.resourceUrl));
        }
        if (prevUrl !== this.resourceUrl) {
            notifyResourceUrlChanged(this);
        }
    }
    _navigateOnPopstate() {
        if (this.useHashFragment === false) {
            notifyResourceUrlChanged(this);
        }
    }
    _notifyOnHashchange() {
        if (this.useHashFragment) {
            notifyResourceUrlChanged(this);
        }
    }
}
function notifyResourceUrlChanged(elem) {
    elem.dispatchEvent(new CustomEvent('resource-url-changed', {
        detail: {
            value: elem.resourceUrl
        }
    }));
}
window.customElements.define('ld-navigator', LdNavigatorElement);

exports.Helpers = Helpers;
exports.LdNavigator = LdNavigator$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ld-navigation.js.map
