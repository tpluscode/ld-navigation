module LdNavigation {

    class LdContext {
        private _base;

        constructor() {
            this._base = '';
        }

        get base():string {
            return this._base;
        }

        set base(url:string) {
            if (url && url.replace) {
                url = url.replace(new RegExp('/$'), '');
            }

            this._base = url;
        }

        clear() {
            this.base = '';
        }
    }

    export class Helpers {
        static fireNavigation(dispatcher:EventTarget, resourceUrl:string) {
            dispatcher.dispatchEvent(new CustomEvent('ld-navigated', {
                detail: {
                    resourceUrl: resourceUrl
                },
                bubbles: true
            }));
        }
    }

    var context = new LdContext();

    if (LdNavigation && LdNavigation.Context) {
        context.base = LdNavigation.Context.base;
    }

    export var Context = context;
}