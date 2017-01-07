Navigation through `<ld-navigator>` can also be done programmatially with JavaScript.

To do that, use the `LdNavigation.Helpers.fireNavigation` function:

``` javascript
var newResourceUrl = 'http://api.example.com/next/resource';
LdNavigation.Helpers.fireNavigation(target, newResourceUrl);
```

This is the same function which is used by `ld-link` to trigger resource URL change.