import { html, PolymerElement } from '@polymer/polymer'
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout'
import '@polymer/app-layout/app-drawer/app-drawer'
import '@polymer/iron-pages/iron-pages'
import '@polymer/paper-card/paper-card'
import '@polymer/paper-button/paper-button'
import '@polymer/paper-item/paper-item'
import '@polymer/paper-listbox/paper-listbox'
import '@polymer/paper-toast/paper-toast'
import '@polymer/paper-checkbox/paper-checkbox'
import './upper88-title'
import 'zero-md/src/zero-md'
import fireNavigation from '../fireNavigation'
import '../ld-link'
import '../ld-navigator'

export default class DemoApp extends PolymerElement {
  static get is () {
    return 'demo-app'
  }

  static get properties () {
    return {
      baseUrl: String,
      resourceUrl: String,
      useHashFragment: Boolean
    }
  }

  static get template () {
    return html`
    <style>
        a {
            text-decoration: none;
        }

        paper-item a {
            line-height: 40px;
            display: block;
            height: 40px;
            width: 100%;
        }

        paper-card {
            margin: 10px;
        }

        paper-toast {
            width: 100%;
        }

        paper-toast a {
            color: white;
            text-decoration: underline;
        }


    </style>

    <ld-navigator resource-url="{{resourceUrl}}"
                  on-resource-url-changed="openToast"
                  base="{{baseUrl}}/"
                  client-base-path="demo"
                  use-hash-fragment$="[[useHashFragment]]"></ld-navigator>

    <upper88-title hidden value$="[[selectedItem.heading]] - ld-navigation - web components for simple client side routing"></upper88-title>

    <paper-toast id="toast">
        You just navigated to [[resourceUrl]]. <ld-link resource-url="{{baseUrl}}/events"><a>How do I know?</a></ld-link>
    </paper-toast>

    <app-drawer-layout>
        <app-drawer slot="drawer">
            <paper-listbox attr-for-selected="data-url" selected="[[resourceUrl]]" on-iron-select="menuNavigate">

                <paper-item data-url="http://example.com/using-absolute-paths-as-state">
                    <ld-link resource-url="http://example.com/using-absolute-paths-as-state">Unmapped base URL</ld-link>
                </paper-item>

                <paper-item data-url$="{{baseUrl}}/base-path-mapping">
                    <ld-link resource-url="{{baseUrl}}/base-path-mapping">Mapped base URL</ld-link>
                </paper-item>

                <paper-item data-url$="{{baseUrl}}/bookmark-ld-link">
                    <ld-link resource-url="{{baseUrl}}/bookmark-ld-link">Bookmarkable ld-link</ld-link>
                </paper-item>

                <paper-item data-url$="{{baseUrl}}/base-state-path">
                    <ld-link resource-url="{{baseUrl}}/base-state-path">Base state path</ld-link>
                </paper-item>

                <paper-item data-url$="{{baseUrl}}/dynamic-navigation" on-tap="navigate">
                    Dynamic navigation
                </paper-item>

                <paper-item data-url$="{{baseUrl}}/events">
                    <ld-link resource-url="{{baseUrl}}/events">Navigation events</ld-link>
                </paper-item>

                <paper-item data-url$="{{baseUrl}}/polymer">
                    <ld-link resource-url="{{baseUrl}}/polymer">Works great with Polymer</ld-link>
                </paper-item>

            </paper-listbox>
            
            <paper-checkbox checked="{{useHashFragment}}" style="margin-left: 15px">Use hash fragment</paper-checkbox>
        </app-drawer>
        <div>
            <paper-card heading="Current resource URL is">
                <div class="card-content">
                    {{resourceUrl}}
                </div>
            </paper-card>

            <iron-pages id="docsPages" attr-for-selected="data-url" selected="[[resourceUrl]]" selected-item="{{selectedItem}}" fallback-selection="not-found">
                <paper-card heading="SPA routing - Linked Data-style" data-url$="{{baseUrl}}/">
                    <div class="card-content">
                        <zero-md src="pages/index.md">
                        </zero-md>
                    </div>
                </paper-card>

                <paper-card heading="location.hash history fallback" data-url$="{{baseUrl}}/use-hash">
                    <div class="card-content">
                        <zero-md src="pages/hash.md">
                        </zero-md>
                    </div>
                </paper-card>

                <paper-card heading="Absolute URL as route" data-url="http://example.com/using-absolute-paths-as-state">
                    <div class="card-content">
                        <zero-md src="pages/absolute-paths-as-state.md">
                        </zero-md>
                    </div>
                </paper-card>

                <paper-card heading="Bookmarkable ld-link" data-url$="{{baseUrl}}/bookmark-ld-link">
                    <div class="card-content">
                        <zero-md src="pages/bookmark-ld-link.md">
                        </zero-md>
                    </div>
                </paper-card>

                <paper-card heading="Relative URL as route" data-url$="{{baseUrl}}/base-path-mapping">
                    <div class="card-content">
                        <zero-md src="pages/base-path-mapping.md">
                        </zero-md>
                    </div>
                </paper-card>

                <paper-card heading="Base client path" data-url$="{{baseUrl}}/base-state-path">
                    <div class="card-content">
                        <zero-md src="pages/base-state-path.md">
                        </zero-md>
                    </div>
                </paper-card>

                <paper-card heading="Dynamic navigation" data-url$="{{baseUrl}}/dynamic-navigation">
                    <div class="card-content">
                        <zero-md src="pages/dynamic-navigation.md">
                            <div class="md-html"></div>
                    </div>
                </paper-card>

                <paper-card heading="Navigation events" data-url$="{{baseUrl}}/events">
                    <div class="card-content">
                        <zero-md src="pages/events.md">
                        </zero-md>
                    </div>
                </paper-card>

                <paper-card heading="Works great with Polymer" data-url$="{{baseUrl}}/polymer">
                    <div class="card-content">
                        <div class="card-content">
                            <zero-md src="pages/polymer.md">
                            </zero-md>
                        </div>
                    </div>
                </paper-card>

                <paper-card heading="No documentation page here" data-url="not-found">
                    <div class="card-content">
                        <zero-md src="pages/not-found.md">
                        </zero-md>
                    </div>
                </paper-card>
            </iron-pages>
        </div>
    </app-drawer-layout>`
  }

  navigate (evt) {
    fireNavigation(window, evt.target.getAttribute('data-url'))
  }

  openToast () {
    this.$.toast.open()
  }

  menuNavigate (e) {
    const link = e.target.selectedItem.querySelector('ld-link')

    if (link) {
      link.click()
    }
  }
}

window.customElements.define('demo-app', DemoApp)
