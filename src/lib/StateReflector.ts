import { ResourceScopingElement } from './ResourceScope'

type BaseConstructor = new (...args: any[]) => HTMLElement & ResourceScopingElement

export interface StateReflector {
  reflectUrlInState(url: string): void
  usesHashFragment: boolean
  onResourceUrlChanged(url: string): void
}

type ReturnConstructor = new (...args: any[]) => HTMLElement & StateReflector

function reflectToHash(element: ResourceScopingElement, url: string): void {
  const hash = `${element.stateMapper.getStatePath(url)}`

  if (hash !== document.location.hash) {
    document.location.href = `/${element.clientBasePath}/#${hash}`
  }
}

function reflectToHistory(element: ResourceScopingElement, url: string): void {
  if (url !== window.history.state) {
    window.history.pushState(
      url,
      '',
      `/${element.clientBasePath}${element.stateMapper.getStatePath(url)}`,
    )
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
