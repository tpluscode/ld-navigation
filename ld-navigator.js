/* global HTMLElement, CustomEvent, history */
import LdNavigator from './LdNavigator'

class LdNavigatorElement extends HTMLElement {
  connectedCallback () {
    this._handlers.push({ event: 'ld-navigated', handler: this._handleNavigation.bind(this) })
    this._handlers.push({ event: 'popstate', handler: this._navigateOnPopstate.bind(this) })
    this._handlers.push({ event: 'hashchange', handler: this._notifyOnHashchange.bind(this) })

    this._handlers.forEach(h => {
      window.addEventListener(h.event, h.handler)
    })

    notifyResourceUrlChanged(this)
  }

  constructor () {
    super()
    this._handlers = []

    this.base = this.getAttribute('base')
    this.clientBasePath = this.getAttribute('client-base-path')
    LdNavigator.useHashFragment = this.getAttribute('use-hash-fragment') !== null

    if (!(window.history && window.history.pushState)) {
      this.useHashFragment = true
    }
  }

  static get observedAttributes () {
    return [
      'base',
      'client-base-path',
      'use-hash-fragment'
    ]
  }

  disconnectedCallback () {
    this._handlers.forEach(h => {
      window.removeEventListener(h.event, h.handler)
    })
  }

  attributeChangedCallback (attr, oldVal, newVal) {
    switch (attr) {
      case 'base':
        this.base = newVal
        break
      case 'client-base-path':
        this.clientBasePath = newVal
        break
      case 'use-hash-fragment':
        LdNavigator.useHashFragment = newVal !== null
        break
    }
  }

  get resourceUrl () {
    return LdNavigator.resourceUrl
  }

  get resourcePath () {
    return LdNavigator.resourcePath
  }

  get statePath () {
    return LdNavigator.statePath
  }

  get base () {
    return LdNavigator.base
  }

  set base (url) {
    LdNavigator.base = url
  }

  get clientBasePath () {
    return LdNavigator.clientBasePath
  }

  set clientBasePath (clientBasePath) {
    LdNavigator.clientBasePath = clientBasePath || ''
  }

  get useHashFragment () {
    return LdNavigator.useHashFragment
  }

  set useHashFragment (useHash) {
    if (useHash) {
      this.setAttribute('use-hash-fragment', '')
    } else {
      this.removeAttribute('use-hash-fragment')
    }
  }

  _handleNavigation (e) {
    let prevUrl = this.resourceUrl

    if (this.useHashFragment) {
      document.location.hash = LdNavigator.getStatePath(e.detail.resourceUrl)
    } else if (e.detail.resourceUrl !== history.state) {
      history.pushState(e.detail.resourceUrl, '', LdNavigator.getStatePath(e.detail.resourceUrl))
    }

    if (prevUrl !== this.resourceUrl) {
      notifyResourceUrlChanged(this)
    }
  }

  _navigateOnPopstate () {
    if (this.useHashFragment === false) {
      notifyResourceUrlChanged(this)
    }
  }

  _notifyOnHashchange () {
    if (this.useHashFragment) {
      notifyResourceUrlChanged(this)
    }
  }
}

function notifyResourceUrlChanged (elem) {
  elem.dispatchEvent(new CustomEvent('resource-url-changed', {
    detail: {
      value: elem.resourceUrl
    }
  }))
}

window.customElements.define('ld-navigator', LdNavigatorElement)
