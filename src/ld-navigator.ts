/* eslint-disable class-methods-use-this */
import { StateMapper } from './StateMapper'

interface Handler {
  event: string
  handler: any
  capture?: boolean
}

export class LdNavigator extends HTMLElement {
  private _resourceUrl?: string
  public stateMapper = new StateMapper(document.location)

  connectedCallback() {
    this.stateMapper.on('state-change', (url: string) => {
      this.resourceUrl = url
    })

    if (this.parentNode) {
      this.parentNode.addEventListener(
        'state-mapper-attach',
        (e: any) => {
          e.detail.stateMapper = this.stateMapper
        },
        true,
      )
    }

    this.notifyResourceUrlChanged()
  }

  static get observedAttributes() {
    return ['base', 'client-base-path', 'use-hash-fragment', 'reflect-to-addressbar']
  }

  attributeChangedCallback(attr: string, oldVal: string, newVal: string) {
    // eslint-disable-next-line default-case
    switch (attr) {
      case 'base':
        this.base = newVal
        break
      case 'client-base-path':
        StateMapper.clientBasePath = newVal
        break
      case 'use-hash-fragment':
        StateMapper.useHashFragment = newVal !== null
        break
      case 'reflect-to-addressbar':
        this.stateMapper.reflect = true
        break
    }
  }

  set resourceUrl(value: string) {
    const prevUrl = this._resourceUrl
    this._resourceUrl = value

    if (this._resourceUrl !== prevUrl) {
      this.notifyResourceUrlChanged()
    }
  }

  get resourceUrl() {
    return this._resourceUrl || this.stateMapper.resourceUrl
  }

  get mappedResourceUrl() {
    return this.stateMapper.resourceUrl
  }

  get base() {
    return this.stateMapper.base
  }

  set base(url) {
    this.stateMapper.base = url
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
