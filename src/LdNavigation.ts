module LdNavigation {

    class LdContext {
        private _base;

        constructor() {
            this._base = '';
        }

        get base(): string {
            return this._base;
        }

        set base(url: string) {
            if (url && url.replace) {
                url = url.replace(new RegExp('/$'), '');
            }

            this._base = url;
        }

        clear() {
            this.base = '';
        }
    }

    var context = new LdContext();

    if(LdNavigation && LdNavigation.Context){
        context.base = LdNavigation.Context.base;
    }

    export var Context = context;
}