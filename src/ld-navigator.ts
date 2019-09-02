/* eslint-disable class-methods-use-this */
import { StateMapper } from './StateMapper'
import { LdNavigationOptions } from './lib/LdNavigationOptions'

interface Handler {
  event: string
  handler: any
  capture?: boolean
}

export class LdNavigator extends HTMLElement {
  private _resourceUrl?: string
  private __reflect = false
  private __options: LdNavigationOptions = new LdNavigationOptions()
  public stateMapper: StateMapper

  constructor() {
    super()
    this.stateMapper = new StateMapper(this.__options)
  }

  connectedCallback() {
    this.__options = new LdNavigationOptions({
      baseUrl: this.getAttribute('base-url') || '',
      useHashFragment: this.hasAttribute('use-hash-fragment'),
      clientBasePath: this.getAttribute('client-base-path') || '',
    })
    this.stateMapper = new StateMapper(this.__options)

    if (this.parentNode) {
      this.parentNode.addEventListener(
        'navigator-attach',
        (e: any) => {
          e.detail.ldNavigator = this
        },
        true,
      )
    }

    document.addEventListener('ld-navigated', (e: any) => {
      if (this.__reflect) {
        if (this.__options.useHashFragment) {
          document.location.href = `/${
            this.__options.clientBasePath
          }/#${this.stateMapper.getStatePath(e.detail.resourceUrl)}`
        } else if (e.detail.resourceUrl !== window.history.state) {
          window.history.pushState(
            e.detail.resourceUrl,
            '',
            `/${this.__options.clientBasePath}${this.stateMapper.getStatePath(
              e.detail.resourceUrl,
            )}`,
          )
        }
        this.notifyResourceUrlChanged()
      } else {
        this.resourceUrl = e.detail.resourceUrl
      }
    })

    window.addEventListener('popstate', this.notifyResourceUrlChanged.bind(this))

    window.addEventListener('hashchange', this.notifyResourceUrlChanged.bind(this))

    this.notifyResourceUrlChanged()
  }

  static get observedAttributes() {
    return ['base', 'client-base-path', 'use-hash-fragment', 'reflect-to-addressbar']
  }

  attributeChangedCallback(attr: string, oldVal: string, newVal: string) {
    // eslint-disable-next-line default-case
    switch (attr) {
      case 'base-url':
        this.__options = new LdNavigationOptions({
          ...this.__options,
          baseUrl: newVal,
        })
        break
      case 'client-base-path':
        this.__options = new LdNavigationOptions({
          ...this.__options,
          clientBasePath: newVal,
        })
        break
      case 'use-hash-fragment':
        this.__options = new LdNavigationOptions({
          ...this.__options,
          useHashFragment: newVal !== null,
        })
        break
      case 'reflect-to-addressbar':
        this.__reflect = newVal !== null
        break
    }

    this.stateMapper = new StateMapper(this.__options)
  }

  set resourceUrl(value: string) {
    const prevUrl = this._resourceUrl
    this._resourceUrl = value

    if (this._resourceUrl !== prevUrl) {
      this.notifyResourceUrlChanged()
    }
  }

  get resourceUrl() {
    if (this.__reflect) {
      return this.mappedResourceUrl
    }

    return this._resourceUrl || this.mappedResourceUrl
  }

  get mappedResourceUrl() {
    return this.stateMapper.getResourceUrl(document.location.href)
  }

  private notifyResourceUrlChanged() {
    this.dispatchEvent(
      new CustomEvent('resource-url-changed', {
        detail: {
          value: this.resourceUrl,
        },
      }),
    )
  }
}

window.customElements.define('ld-navigator', LdNavigator)
