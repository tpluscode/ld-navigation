function render(element: Upper88Title): void {
  const value = element.getAttribute('value')

  if (value) {
    // eslint-disable-next-line no-param-reassign
    element.innerHTML = value
  }
  document.title = element.innerText || element.textContent || ''
}

class Upper88Title extends HTMLElement {
  connectedCallback() {
    render(this)
  }

  attributeChangedCallback() {
    render(this)
  }

  static get observedAttributes() {
    return ['value']
  }
}

// Registers custom element
window.customElements.define('upper88-title', Upper88Title)
