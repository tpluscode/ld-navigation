class LdNavigator {
    private _base: string = '';
    clientBasePath: string = '';
    useHashFragment: boolean = false;

    get base() {
        return this._base;
    }

    set base(url:string) {
        if (url && url.replace) {
            url = url.replace(new RegExp('/$'), '');
        }

        this._base = url || '';
    }

    get resourcePath(): string {
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

    get resourceUrl():string {
        const path = this.resourcePath;

        if (/^http:\/\//.test(path)) {
            return path + document.location.search;
        } else {
            return this.base + '/' + path + document.location.search;
        }
    }

    getStatePath(absoluteUrl: string): string {

        let resourcePath = absoluteUrl.replace(new RegExp('^' + this.base), '');

        if(resourcePath[0] !== '/') {
            resourcePath = '/' + resourcePath;
        }

        if(this.clientBasePath && this.useHashFragment === false) {
            return '/' + this.clientBasePath + resourcePath;
        }

        return resourcePath;
    }

    private _resourceUrlMatchesBase(absoluteUrl: string): boolean {
        return !!this.base && !!absoluteUrl.match('^' + this.base);
    }
}

export default new LdNavigator();
