import LdNavigator from './LdNavigator';
import Helpers from './LdNavigation';

const resourceUrlAttrName = 'resource-url';

class LinkedDataLink extends HTMLElement {
    constructor() {
        super();

        if (this.hasAttribute(resourceUrlAttrName)) {
            this.resourceUrl = this.getAttribute(resourceUrlAttrName);
        }

        if(this._anchor) {
            this._anchor.addEventListener('click', navigate.bind(this));
        } else {
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

        if(this._anchor) {
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
        if(this.resourceUrl) {
            const state = LdNavigator.getStatePath(this.resourceUrl);

            if (LdNavigator.useHashFragment) {
                this._anchor.href = '#' + state;
            } else {
                this._anchor.href = state;
            }
        } else {
            this._anchor.removeAttribute('href');
        }
    }
}

function navigate(e) {
    Helpers.fireNavigation(this, this.resourceUrl);
    e.preventDefault();
}

window.customElements.define('ld-link',  LinkedDataLink);
