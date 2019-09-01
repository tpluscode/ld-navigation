The `<ld-navigator>` element publishes a `resource-url-changed` event whenever the
URL changes after navigation or browser history change. It can be used for Polymer
databinding or with ordinary JS code.

``` html
<ld-navigator on-resource-url-changed="handleChange"></ld-navigator>
```

``` javascript
document.querySelector('ld-navigator').addEventHandler('resource-url-changed', handleChange);
```

There is also a bubbling event, which triggers the navigation. `<ld-navigator>`
listens to in on [window level](https://github.com/tpluscode/ld-navigation/blob/master/src/ld-navigator.ts#L9).

``` javascript
window.addEventListener('ld-navigated', (e:CustomEvent) => this.resourceUrl = e.detail.resourceUrl);
```