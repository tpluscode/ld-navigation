/* global CustomEvent */
export default class Helpers {
  static fireNavigation (dispatcher, resourceUrl) {
    dispatcher.dispatchEvent(new CustomEvent('ld-navigated', {
      detail: {
        resourceUrl: resourceUrl
      },
      bubbles: true,
      composed: true
    }))
  }
}
