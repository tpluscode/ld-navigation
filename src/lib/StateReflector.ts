import { ResourceScopingElement } from './ResourceScope'

type BaseConstructor = new (...args: any[]) => HTMLElement & ResourceScopingElement

export interface StateReflector extends ResourceScopingElement {
  reflectUrlInState(url: string): Promise<void>
  usesHashFragment: boolean
}

type ReturnConstructor = new (...args: any[]) => HTMLElement & StateReflector
interface HistoryAdapter {
  __history: History
}

async function reflectToHash(element: ResourceScopingElement, url: string) {
  const stateMapper = await element.stateMapper
  const hash = `${stateMapper.getStatePath(url)}`

  if (hash !== document.location.hash) {
    document.location.hash = hash
  }
}

async function reflectToHistory(
  element: ResourceScopingElement & HistoryAdapter,
  resourceUrl: string,
) {
  if (resourceUrl !== element.__history.state) {
    const stateMapper = await element.stateMapper
    const path = stateMapper.getStatePath(resourceUrl)
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

      reflectUrlInState(url: string): Promise<void> {
        if (actualTarget === 'history') {
          return reflectToHistory(this, url)
        }

        return reflectToHash(this, url)
      }

      onResourceUrlChanged(newUrl: string) {
        return this.reflectUrlInState(newUrl)
      }
    }

    return Mixin
  }
}

export const ReflectedInHash = createMixinFor('hash')
export const ReflectedInHistory = createMixinFor('history')
