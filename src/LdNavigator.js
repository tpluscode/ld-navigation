class LdNavigator {
    constructor() {
        this._base = ''
        this.clientBasePath = ''
        this.useHashFragment = false
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

        if(this.clientBasePath) {
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
        } else {
            return this.base + '/' + path + document.location.search;
        }
    }

    getStatePath(absoluteUrl) {

        let resourcePath = absoluteUrl.replace(new RegExp('^' + this.base), '');

        if(resourcePath[0] !== '/') {
            resourcePath = '/' + resourcePath;
        }

        if(this.clientBasePath && this.useHashFragment === false) {
            return '/' + this.clientBasePath + resourcePath;
        }

        return resourcePath;
    }

    _resourceUrlMatchesBase(absoluteUrl) {
        return !!this.base && !!absoluteUrl.match('^' + this.base);
    }
}

export default new LdNavigator();
