By selecting the first element from the menu you triggered route change by firing the `ld-link`
element. It is declared as an extension of anchor:

``` html
<ld-link resource-url="http://example.com/using-absolute-paths-as-state">Unmapped base URL</ld-link>
```

Clicking it updates the `resourceUrl` property of `<ld-navigator>` and updates the page
address.

By default, the `<ld-navigator>` has no understanding of the structure of the addresses,
hence you can see the entire resource URL in the address bar.