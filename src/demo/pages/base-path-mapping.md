The second item in the menu on the left behaves just like the first one, but the
address bar now shows only part of the `resourceUrl` property. This is because it is
possible to set a base URL for translating resource identifiers.

``` html
<ld-navigator base="{{base}}/"></ld-navigator>
```

By setting the `base` property of `<ld-navigator>` any URL relative to that base will
be used as relative in the address bare. Note though, that the `resourceUrl` property
will always give you the absolute URL.