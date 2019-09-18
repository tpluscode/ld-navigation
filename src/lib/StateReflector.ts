import { ResourceScopingElement } from './ResourceScope'

type BaseConstructor = new (...args: any[]) => HTMLElement & ResourceScopingElement

export interface StateReflector extends ResourceScopingElement {
  reflectUrlInState(url: string): void
  usesHashFragment: boolean
}

type ReturnConstructor = new (...args: any[]) => HTMLElement & StateReflector
interface HistoryAdapter {
  __history: History
}

function reflectToHash(element: ResourceScopingElement, url: string): void {
  const hash = `${element.stateMapper.getStatePath(url)}`

  if (hash !== document.location.hash) {
    document.location.hash = hash
  }
}

function reflectToHistory(
  element: ResourceScopingElement & HistoryAdapter,
  resourceUrl: string,
): void {
  if (resourceUrl !== element.__history.state) {
    const path = element.stateMapper.getStatePath(resourceUrl)
    let stateUrl

    if (element.clientBasePath) {
      stateUrl = `${document.location.origin}/${element.clientBasePath}${path}`
    } else {
      stateUrl = `${document.location.origin}${path}`
    }

    if (!element.__history.state) {
      element.__history.replaceState(resourceUrl, '', stateUrl)
    } else {
      element.__history.pushState(resourceUrl, '', stateUrl)
    }
  }
}

function createMixinFor(desiredTarget: 'hash' | 'history') {
  const actualTarget = !window.history ? 'hash' : desiredTarget

  return function ReflectedInHash<B extends BaseConstructor>(Base: B): B & ReturnConstructor {
    class Mixin extends Base implements StateReflector {
      public readonly __history: History

      constructor(...args: any[]) {
        super(args)
        this.__history = window.history
      }

      // eslint-disable-next-line class-methods-use-this
      get usesHashFragment() {
        return actualTarget === 'hash'
      }

      reflectUrlInState(url: string) {
        if (actualTarget === 'history') {
          reflectToHistory(this, url)
        } else {
          reflectToHash(this, url)
        }
      }

      onResourceUrlChanged(newUrl: string) {
        this.reflectUrlInState(newUrl)
      }
    }

    return Mixin
  }
}

export const ReflectedInHash = createMixinFor('hash')
export const ReflectedInHistory = createMixinFor('history')
