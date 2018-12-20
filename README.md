# ld-navigation [![Build Status](https://travis-ci.org/tpluscode/ld-navigation.svg?branch=master)](https://travis-ci.org/tpluscode/ld-navigation) [![Coverage](https://img.shields.io/codecov/c/github/tpluscide/ld-navigation.png)](https://codecov.io/gh/tpluscode/ld-navigation)

A set of Web Components for data-driven Linked Data REST client in the browser.

With ld-navigation you let actual Linked Data be the router of your application.

You then simply GET and decide what to display based on the data returned.
**No more client-side routing**.

### &lt;ld-navigator&gt;
> Control current resource in relation to document path
> Maintain browser history with HTML history API
> Set up base resource URL and base client path to tweak routing

### &lt;ld-link&gt;
> Initiate transition between application states

## Demos

[Demos and sort-of documentation](http://t-code.pl/ld-navigation/demo/).

[`ld-navigation` also plays nice with location.hash history](http://t-code.pl/ld-navigation/?useHash).

## Installation

Run `yarn add ld-navigation`

In your code

```js
// main element, required
import 'ld-navigation/ld-navigator'
// optionally, to wrap links
import 'ld-navigation/ld-link'
// optionally, to initiate navigation manually
import fireNavigation from 'ld-navigation/fireNavigation'
```

**No external dependencies**

## Usage

Let's assume that:
* Your website is at `http://www.my.app/`.
* Your Linked Data API is at `http://api.my.app/`.

``` html
<!-- navigator exposes a resourceUrl property, see below -->
<ld-navigator></ld-navigator>

<!-- ld-link replaces or wraps anchor -->
<ld-link resource-url="http://api.my.app/people">get people</ld-link>
<ld-link resource-url="http://api.my.app/projects">
    <a>get projects</a>
</ld-link>

<script>
var navigator = document.querySelector('ld-navigator')
navigator.addEventListener('resource-url-changed', function(e) {
    // same url sits in e.detail.resourceUrl
    var nextUrl = navigator.resourceUrl;

    // no go ahead and $.get or window.fetch your data from nextUrl
    window.fetch(nextUrl).then(bindDataWithPage);
  });
</script>
```
With the above code, when you click the first link, the browser moves to `http://www.my.app/http://api.my.app/people` and the
`resource-url-changed` event is fired.

### Base URL

Obviously an URL like `http://www.my.app/http://api.my.app/people` is ugly (and, well, invalid). It is possible to get rid of the API domain
by adding an attribute to the `<ld-navigator>` tag:

``` html
<ld-navigator base="http://api.my.app"></ld-navigator>
```

This way the API domain is stripped out from the browser address bar and `http://www.my.app/people` remains. This is where client-side
routing becomes virtually obsolete.

### Polymer

`ld-navigation` will also play nice with [Polymer](/Polymer/polymer/) - see the [demos](#demo) above.

## Tests

Tests are written with [@open-wc/testing](http://open-wc.org).

``` bash
yarn install
yarn test:local
```
