class Upper88Title extends window.HTMLElement {
  connectedCallback () {
    render(this)
  }

  attributeChangedCallback () {
    render(this)
  }

  static get observedAttributes () {
    return ['value']
  }
}

// Registers custom element
window.customElements.define('upper88-title', Upper88Title)

function render (element) {
  if (element.hasAttribute('value')) {
    var value = element.getAttribute('value')
    element.innerHTML = value
  }
  document.title = element.innerText || element.textContent
}
