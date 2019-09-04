import { ResourceScopingElement } from './ResourceScope'

type BaseConstructor = new (...args: any[]) => HTMLElement & ResourceScopingElement

export interface StateReflector extends ResourceScopingElement {
  reflectUrlInState(url: string): void
  usesHashFragment: boolean
}

type ReturnConstructor = new (...args: any[]) => HTMLElement & StateReflector

function reflectToHash(element: ResourceScopingElement, url: string): void {
  const hash = `${element.stateMapper.getStatePath(url)}`

  if (hash !== document.location.hash) {
    document.location.hash = hash
  }
}

function reflectToHistory(element: ResourceScopingElement, url: string): void {
  if (url !== window.history.state) {
    const path = element.stateMapper.getStatePath(url)

    if (element.clientBasePath) {
      window.history.pushState(
        url,
        '',
        `${document.location.origin}/${element.clientBasePath}${path}`,
      )
    } else {
      window.history.pushState(url, '', `${document.location.origin}${path}`)
    }
  }
}

function createMixinFor(desiredTarget: 'hash' | 'history') {
  const actualTarget = !window.history ? 'hash' : desiredTarget

  return function ReflectedInHash<B extends BaseConstructor>(Base: B): B & ReturnConstructor {
    class Mixin extends Base implements StateReflector {
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
