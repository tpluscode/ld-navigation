I see that you decided to try the hash fragment history. This is configured by setting an
attribute of the `<ld-navigator>` element.

``` html
<ld-navigator use-hash-fragment></ld-navigator>
```

Note that it is also set automatically if the browser doesn't support
[HTML5 history API](https://developer.mozilla.org/en/docs/Web/API/History)