var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LdNavigation;
(function (LdNavigation) {
    var Helpers = (function () {
        function Helpers() {
        }
        Helpers.fireNavigation = function (dispatcher, resourceUrl) {
            dispatcher.dispatchEvent(new CustomEvent('ld-navigated', {
                detail: {
                    resourceUrl: resourceUrl
                },
                bubbles: true
            }));
        };
        return Helpers;
    }());
    LdNavigation.Helpers = Helpers;
})(LdNavigation || (LdNavigation = {}));
/// <reference path="LdNavigation.ts" />
var resourceUrlAttrName = 'resource-url';
var LinkedDataLink = (function (_super) {
    __extends(LinkedDataLink, _super);
    function LinkedDataLink() {
        _super.apply(this, arguments);
    }
    LinkedDataLink.prototype.createdCallback = function () {
        if (this.hasAttribute(resourceUrlAttrName)) {
            this.resourceUrl = this.getAttribute(resourceUrlAttrName);
        }
        if (this._anchor) {
            this._anchor.addEventListener('click', navigate.bind(this));
        }
        else {
            this.addEventListener('click', navigate.bind(this));
        }
    };
    Object.defineProperty(LinkedDataLink.prototype, "resourceUrl", {
        get: function () {
            return this._resourceUrl;
        },
        set: function (url) {
            this._resourceUrl = url;
            this.removeAttribute('href');
            if (this._anchor) {
                this._setLink();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LinkedDataLink.prototype, "_anchor", {
        get: function () {
            return this.querySelector('a');
        },
        enumerable: true,
        configurable: true
    });
    LinkedDataLink.prototype.attributeChangedCallback = function (attr, oldVal, newVal) {
        if (attr === resourceUrlAttrName) {
            this.resourceUrl = newVal;
        }
    };
    LinkedDataLink.prototype._setLink = function () {
        if (this.resourceUrl) {
            var state = LdNavigator.Instance.getStatePath(this.resourceUrl);
            if (LdNavigator.Instance.useHashFragment) {
                this._anchor.href = '#' + state;
            }
            else {
                this._anchor.href = state;
            }
        }
        else {
            this._anchor.removeAttribute('href');
        }
    };
    return LinkedDataLink;
}(HTMLElement));
function navigate(e) {
    LdNavigation.Helpers.fireNavigation(this, this.resourceUrl);
    e.preventDefault();
}
document['registerElement']('ld-link', {
    prototype: LinkedDataLink.prototype
});
/// <reference path="LdNavigation.ts" />
var LdNavigatorElement = (function (_super) {
    __extends(LdNavigatorElement, _super);
    function LdNavigatorElement() {
        _super.apply(this, arguments);
    }
    LdNavigatorElement.prototype.attachedCallback = function () {
        this._handlers = [];
        this._handlers.push({ event: 'ld-navigated', handler: this._handleNavigation.bind(this) });
        this._handlers.push({ event: 'popstate', handler: this._navigateOnPopstate.bind(this) });
        this._handlers.push({ event: 'hashchange', handler: this._notifyOnHashchange.bind(this) });
        this._handlers.forEach(function (h) {
            window.addEventListener(h.event, h.handler);
        });
        notifyResourceUrlChanged(this);
    };
    LdNavigatorElement.prototype.createdCallback = function () {
        this.base = this.getAttribute('base');
        this.clientBasePath = this.getAttribute('client-base-path');
        LdNavigator.Instance.useHashFragment = this.getAttribute('use-hash-fragment') !== null;
        if (!(window.history && window.history.pushState)) {
            this.useHashFragment = true;
        }
    };
    LdNavigatorElement.prototype.detachedCallback = function () {
        this._handlers.forEach(function (h) {
            window.removeEventListener(h.event, h.handler);
        });
    };
    LdNavigatorElement.prototype.attributeChangedCallback = function (attr, oldVal, newVal) {
        switch (attr) {
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
    };
    Object.defineProperty(LdNavigatorElement.prototype, "resourceUrl", {
        get: function () {
            return LdNavigator.Instance.resourceUrl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LdNavigatorElement.prototype, "resourcePath", {
        get: function () {
            return LdNavigator.Instance.resourcePath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LdNavigatorElement.prototype, "statePath", {
        get: function () {
            return LdNavigator.Instance.statePath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LdNavigatorElement.prototype, "base", {
        get: function () {
            return LdNavigator.Instance.base;
        },
        set: function (url) {
            LdNavigator.Instance.base = url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LdNavigatorElement.prototype, "clientBasePath", {
        get: function () {
            return LdNavigator.Instance.clientBasePath;
        },
        set: function (clientBasePath) {
            LdNavigator.Instance.clientBasePath = clientBasePath || '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LdNavigatorElement.prototype, "useHashFragment", {
        get: function () {
            return LdNavigator.Instance.useHashFragment;
        },
        set: function (useHash) {
            if (useHash) {
                this.setAttribute('use-hash-fragment', '');
            }
            else {
                this.removeAttribute('use-hash-fragment');
            }
        },
        enumerable: true,
        configurable: true
    });
    LdNavigatorElement.prototype._handleNavigation = function (e) {
        var prevUrl = this.resourceUrl;
        if (this.useHashFragment) {
            document.location.hash = LdNavigator.Instance.getStatePath(e.detail.resourceUrl);
        }
        else if (e.detail.resourceUrl !== history.state) {
            history.pushState(e.detail.resourceUrl, '', LdNavigator.Instance.getStatePath(e.detail.resourceUrl));
        }
        if (prevUrl !== this.resourceUrl) {
            notifyResourceUrlChanged(this);
        }
    };
    LdNavigatorElement.prototype._navigateOnPopstate = function () {
        if (this.useHashFragment === false) {
            notifyResourceUrlChanged(this);
        }
    };
    LdNavigatorElement.prototype._notifyOnHashchange = function () {
        if (this.useHashFragment) {
            notifyResourceUrlChanged(this);
        }
    };
    return LdNavigatorElement;
}(HTMLElement));
function notifyResourceUrlChanged(elem) {
    elem.dispatchEvent(new CustomEvent('resource-url-changed', {
        detail: {
            value: elem.resourceUrl
        }
    }));
}
document['registerElement']('ld-navigator', LdNavigatorElement);
var LdNavigator;
(function (LdNavigator_1) {
    var LdNavigator = (function () {
        function LdNavigator() {
            this._base = '';
            this.clientBasePath = '';
            this.useHashFragment = false;
        }
        Object.defineProperty(LdNavigator.prototype, "base", {
            get: function () {
                return this._base;
            },
            set: function (url) {
                if (url && url.replace) {
                    url = url.replace(new RegExp('/$'), '');
                }
                this._base = url || '';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LdNavigator.prototype, "resourcePath", {
            get: function () {
                var path = (this.useHashFragment
                    ? document.location.hash.substr(1, document.location.hash.length - 1)
                    : document.location.pathname).replace(/^\//, '');
                if (this.clientBasePath) {
                    return path.replace(new RegExp('^' + this.clientBasePath + '\/'), '');
                }
                return path;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LdNavigator.prototype, "statePath", {
            get: function () {
                return this.resourcePath;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LdNavigator.prototype, "resourceUrl", {
            get: function () {
                var path = this.resourcePath;
                if (/^http:\/\//.test(path)) {
                    return path + document.location.search;
                }
                else {
                    return this.base + '/' + path + document.location.search;
                }
            },
            enumerable: true,
            configurable: true
        });
        LdNavigator.prototype.getStatePath = function (absoluteUrl) {
            var resourcePath = absoluteUrl.replace(new RegExp('^' + this.base), '');
            if (resourcePath[0] !== '/') {
                resourcePath = '/' + resourcePath;
            }
            if (this.clientBasePath && this.useHashFragment === false) {
                return '/' + this.clientBasePath + resourcePath;
            }
            return resourcePath;
        };
        LdNavigator.prototype._resourceUrlMatchesBase = function (absoluteUrl) {
            return !!this.base && !!absoluteUrl.match('^' + this.base);
        };
        return LdNavigator;
    }());
    LdNavigator_1.Instance = new LdNavigator();
})(LdNavigator || (LdNavigator = {}));
//# sourceMappingURL=ld-navigation.js.map