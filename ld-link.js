/* global HTMLElement, MutationObserver */
import LdNavigator from './LdNavigator'
import go from './fireNavigation'

const resourceUrlAttrName = 'resource-url'

class LinkedDataLink extends HTMLElement {
  constructor () {
    super()

    if (this.hasAttribute(resourceUrlAttrName)) {
      this.resourceUrl = this.getAttribute(resourceUrlAttrName)
    }

    if (this._anchor) {
      this._anchor.addEventListener('click', navigate.bind(this))
    } else {
      this.addEventListener('click', navigate.bind(this))
    }
  }

  connectedCallback () {
    this._setLink()
    this._observer = new MutationObserver(this._setLink.bind(this))
    this._observer.observe(this, {
      attributes: false, childList: true, subtree: true
    })
  }

  disconnectedCallback () {
    this._observer.disconnect()
  }

  static get observedAttributes () {
    return [
      resourceUrlAttrName
    ]
  }

  get resourceUrl () {
    return this._resourceUrl
  }

  set resourceUrl (url) {
    this._resourceUrl = url

    this.removeAttribute('href')

    this._setLink()
  }

  get _anchor () {
    return this.querySelector('a')
  }

  attributeChangedCallback (attr, oldVal, newVal) {
    if (attr === resourceUrlAttrName) {
      this.resourceUrl = newVal
    }
  }

  _setLink () {
    if (!this._anchor) return

    if (this.resourceUrl) {
      const state = LdNavigator.getStatePath(this.resourceUrl)

      if (LdNavigator.useHashFragment) {
        this._anchor.href = '#' + state
      } else {
        this._anchor.href = state
      }
    } else {
      this._anchor.removeAttribute('href')
    }
  }
}

function navigate (e) {
  go(this, this.resourceUrl)
  e.preventDefault()
}

window.customElements.define('ld-link', LinkedDataLink)
