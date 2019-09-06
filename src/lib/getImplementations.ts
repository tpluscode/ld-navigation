export function getAllImplementationsOf(cls: any, methodName: string): Function[] {
  const fns = methodName in cls ? [cls[methodName]] : []

  let proto = Object.getPrototypeOf(cls.constructor)

  while (proto) {
    if (proto.prototype && Object.prototype.hasOwnProperty.call(proto.prototype, methodName)) {
      fns.push(proto.prototype[methodName])
    }
    proto = Object.getPrototypeOf(proto)
  }

  return fns
}
