export default function eventToPromise (target, event) {
  return new Promise(resolve => {
    target.addEventListener(event, resolve)
  })
}
