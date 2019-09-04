/* eslint-disable class-methods-use-this */
import { StateMapper } from './StateMapper'
import { getAllImplementationsOf } from './getImplementations'

interface CustomElementHooks {
  connectedCallback(): void
}

type BaseConstructor = new (...args: any[]) => HTMLElement & CustomElementHooks

export interface ResourceScopingElement extends CustomElementHooks {
  stateMapper: StateMapper
  clientBasePath?: string
  usesHashFragment: boolean
  notifyResourceUrlChanged(): void
  onResourceUrlChanged(url: string): void
}

type ReturnConstructor = new (...args: any[]) => HTMLElement & ResourceScopingElement

export function ResourceScope<B extends BaseConstructor>(Base: B): B & ReturnConstructor {
  abstract class Mixin extends Base implements ResourceScopingElement {
    protected _resourceUrl?: string
    protected _stateMapper: StateMapper | null = null
    public clientBasePath?: string

    get usesHashFragment() {
      return false
    }

    public get stateMapper() {
      if (!this._stateMapper) {
        this._stateMapper = this.createStateMapper()
      }

      return this._stateMapper
    }

    public createStateMapper(): StateMapper {
      throw new Error('To be implemented in mixed class')
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback()
      }

      this.addEventListener(
        'navigator-attach',
        (e: any) => {
          e.detail.resourceScope = this
        },
        true,
      )

      document.addEventListener('ld-navigated', (e: any) => {
        this.notifyResourceUrlChanged(e.detail.resourceUrl)
      })

      window.addEventListener('popstate', () => this.notifyResourceUrlChanged())
      window.addEventListener('pushstate', () => this.notifyResourceUrlChanged())
      window.addEventListener('hashchange', () => this.notifyResourceUrlChanged())

      this.notifyResourceUrlChanged()
    }

    get mappedResourceUrl() {
      return this.stateMapper.getResourceUrl(document.location.href)
    }

    public notifyResourceUrlChanged(value?: string) {
      const prevUrl = this._resourceUrl
      this._resourceUrl = value || this.stateMapper.getResourceUrl(document.location.href)

      if (this._resourceUrl !== prevUrl) {
        getAllImplementationsOf(this.constructor, 'onResourceUrlChanged').forEach(fn =>
          fn.call(this, this._resourceUrl),
        )
      }
    }

    public abstract onResourceUrlChanged(newValue: string): void
  }

  return Mixin
}
