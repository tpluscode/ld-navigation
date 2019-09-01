See how the menu selection updates when you move between states? This is done using Polymer's
declarative binding syntax

``` html
<ld-navigator resource-url="{{resource-url}}"></ld-navigator>

<paper-listbox attr-for-selected="data-url" selected="[[resourceUrl]]"></paper-listbox>
```

With some code, this will of course work with any DOM library because those bindings are
just attributes and events.

[back]: javascript:history.back()
[fwd]: javascript:history.forward()