export default function go(dispatcher: EventTarget | string, url?: string): void {
  let eventSource: EventTarget
  let resourceUrl = url
  if (typeof dispatcher === 'string') {
    resourceUrl = dispatcher
    eventSource = document
  } else {
    eventSource = dispatcher
  }

  eventSource.dispatchEvent(
    new CustomEvent('ld-navigated', {
      detail: {
        resourceUrl,
      },
      bubbles: true,
      composed: true,
    }),
  )
}
