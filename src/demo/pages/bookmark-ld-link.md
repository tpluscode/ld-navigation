The `<ld-link>` element can be used alone, and as such will not act as an ordinary link.
It is however possible to add a child `<a>` to it and that link tag will have the `href`
property set to a correct *client URL* according to the `<ld-navigator>` setup.

For example markup like

``` html
<ld-navigator base-url="http://example.com/base"
              client-base-path="my-app"></ld-navigator>

<ld-link resource-url="http://example.com/base/bookmarkable/resource">
    <a>The client link</a>
</ld-link>
```

Will set the link's href so that it can be happily bookmarked in the browser:

``` html
<a href="/my-app/bookmarkable/resource">The client link</a>
```
