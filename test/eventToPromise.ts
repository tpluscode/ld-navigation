export default function eventToPromise(target: EventTarget, event: string): Promise<CustomEvent> {
  return new Promise(resolve => {
    target.addEventListener(event, (e: any) => resolve(e))
  })
}
