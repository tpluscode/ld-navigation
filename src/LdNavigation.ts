export default class Helpers {
    static fireNavigation(dispatcher:EventTarget, resourceUrl:string) {
        dispatcher.dispatchEvent(new CustomEvent('ld-navigated', {
            detail: {
                resourceUrl: resourceUrl
            },
            bubbles: true
        }));
    }
}
