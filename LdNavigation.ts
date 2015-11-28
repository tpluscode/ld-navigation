module LdNavigation {

    class LdContext {
        private _base;

        constructor(){
            this._base = '';
        }

        get base(): string {
            return this._base;
        }

        set base(url: string) {
            this._base = url;
        }

        clear() {
            this.base = '';
        }
    }

    var context = new LdContext();

    class LdNavigatorElement extends HTMLElement {

        get base(): string {
            return context.base;
        }
        set base(url: string){
            context.base = url;
        }

        attributeChangedCallback(attr, oldVal, newVal) {
            if(attr === 'base') {
                this.base = newVal;
            }
        }
    }

    class LdNamespaceElement extends HTMLElement {

    }

    export var Context = context;

    document.registerElement('ld-navigator', LdNavigatorElement);
    document.registerElement('ld-namespace', LdNamespaceElement);
}