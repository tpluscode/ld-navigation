Navigation through `<ld-navigator>` can also be done programmatially with JavaScript:

``` javascript
import fireNavigation from 'ld-navigation/fireNavigation';

var newResourceUrl = 'http://api.example.com/next/resource';
fireNavigation(newResourceUrl);
```

This is the same function which is used by `ld-link` to trigger resource URL change.
