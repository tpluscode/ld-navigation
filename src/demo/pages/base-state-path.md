A Single Page Application doesn't necessarily live in the root of your web server.
Such is the case with these pages which are hosted using GitHub Pages. This is important
with HTML5 history, because `<ld-navigator>` element will by default try to
push the state by replacing the entire client path.

To retain the base path it is possible to set the `client-base-path` attribute of
`<ld-navigator>`. It's value will be prepended to the routing path. The page
you're looking at uses it as follows:

``` html
<ld-navigator client-base-path="ld-navigation"></ld-navigator>
```

This way, when changing client state, the address will show for example
`/ld-navigation/my/resource/path` instead of just `/my/resource/path`.