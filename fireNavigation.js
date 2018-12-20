/* global CustomEvent */
export default function (dispatcher, resourceUrl) {
  let eventSource = dispatcher
  if (!resourceUrl) {
    resourceUrl = dispatcher
    eventSource = document
  }

  eventSource.dispatchEvent(new CustomEvent('ld-navigated', {
    detail: {
      resourceUrl: resourceUrl
    },
    bubbles: true,
    composed: true
  }))
}
