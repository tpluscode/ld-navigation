export function getAllImplementationsOf(cls: object, methodName: string): Function[] {
  const fns = []

  let proto = Object.getPrototypeOf(cls)

  while (proto) {
    if (proto.prototype && Object.prototype.hasOwnProperty.call(proto.prototype, methodName)) {
      fns.push(proto.prototype[methodName])
    }
    proto = Object.getPrototypeOf(cls)
  }

  return fns
}
