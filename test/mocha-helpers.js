function NavigateTo(url){
    document.dispatchEvent(new CustomEvent('ld-navigated', {
        detail: {
            resourceUrl: url
        },
        bubbles: true
    }));
}
