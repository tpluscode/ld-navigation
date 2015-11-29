# ld-navigation

A set of Web Components for data-driven Linked Data REST client in the browser.

With ld-navigation you let actual Linked Data be the router of your application. 

You then simply GET and decide what to display based on the data returned. 
**No more client-side routing**.

### &lt;ld-navigator&gt;
> Control current resource in relation to document path

### &lt;a is="ld-link"&gt;
> Initiate transition between application states

### &lt;ld-html-history&gt;
> Maintain state history with HTML history API

## Installation

Run `bower install --save tpluscode/ld-navigation`

Add `bower_components/ld-navigation/ld-navigation.html` in your HTML document

**No external dependencies**

## Usage

Your website is at `http://www.my.app/`.

Your Linked Data API is at `http://api.my.app/`.

When you HTTP GET a resource from `http://api.my.app/some/data`, the browser moves to `http://www.my.app/http://api.my.app/some/data`

``` html
<!-- navigator exposes a resourceUrl property, see below -->
<ld-navigator></ld-navigator>

<!-- just drop in html and it will maintain the history -->
<ld-html5-history></ld-html5-history>

<!-- ld-link extends anchor -->
<a is="ld-link" resource-url="http://api.my.app/people">get people</a>
<a is="ld-link" resource-url="http://api.my.app/projects">get projects</a>

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

### Base URL

Obviously an URL like `http://www.my.app/http://api.my.app/some/data` is ugly. It is possible to get rid of the API domain
by changing the `<ld-navigator>` tag to:

``` html
<ld-navigator base="http://api.my.app"></ld-navigator>
```

This way the API domain is stripped out from the browser address bar and `http://www.my.app/some/data` remains.

### Polymer

`ld-navigation` will also play nice with [Polymer](/Polymer/polymer/) - see the [demo](demo/index.html) (below).

## Demo

There is a minimalist demo. To run, clone this repository and then:

``` bash
npm install -g http-server
http-server

```

## Tests

Tests are written with [web-component-tester](/Polymer/web-component-tester) in Mocha BDD style.

``` bash
npm install
wct
```
