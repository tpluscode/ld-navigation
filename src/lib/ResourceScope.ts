/* eslint-disable class-methods-use-this */
import { boundMethod } from 'autobind-decorator'
import { StateMapper } from './StateMapper'
import { getAllImplementationsOf } from './getImplementations'

interface CustomElementHooks {
  connectedCallback?(): void
  disconnectedCallback?(): void
}

type BaseConstructor = new (...args: any[]) => HTMLElement & CustomElementHooks

export interface ResourceScopingElement extends CustomElementHooks {
  stateMapper: StateMapper
  clientBasePath?: string
  usesHashFragment?: boolean
  notifyResourceUrlChanged(url?: string): void
  onResourceUrlChanged(url: string): void
}

type ReturnConstructor = new (...args: any[]) => HTMLElement & ResourceScopingElement

export function ResourceScope<B extends BaseConstructor>(Base: B): B & ReturnConstructor {
  abstract class Mixin extends Base implements ResourceScopingElement {
    public resourceUrl?: string
    protected _stateMapper: StateMapper | null = null
    public clientBasePath?: string

    public get stateMapper() {
      if (!this._stateMapper) {
        this._stateMapper = this.createStateMapper()
      }

      return this._stateMapper
    }

    public abstract createStateMapper(): StateMapper

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

      document.addEventListener('ld-navigated', this.__onNavigated)
      window.addEventListener('popstate', this.__onNavigated)
      window.addEventListener('pushstate', this.__onNavigated)
      window.addEventListener('hashchange', this.__onNavigated)

      this.notifyResourceUrlChanged()
    }

    disconnectedCallback() {
      document.removeEventListener('ld-navigated', this.__onNavigated)
      window.removeEventListener('popstate', this.__onNavigated)
      window.removeEventListener('pushstate', this.__onNavigated)
      window.removeEventListener('hashchange', this.__onNavigated)

      if (super.disconnectedCallback) {
        super.disconnectedCallback()
      }
    }

    get mappedResourceUrl() {
      return this.stateMapper.getResourceUrl(document.location.href)
    }

    @boundMethod
    public notifyResourceUrlChanged(value?: string) {
      const prevUrl = this.resourceUrl
      this.resourceUrl = value || this.stateMapper.getResourceUrl(document.location.href)

      if (this.resourceUrl !== prevUrl) {
        getAllImplementationsOf(this, 'onResourceUrlChanged').forEach(fn =>
          fn.call(this, this.resourceUrl),
        )
      }
    }

    public abstract onResourceUrlChanged(newValue: string): void

    @boundMethod
    private __onNavigated(e: any) {
      if (e.detail && e.detail.resourceUrl) {
        this.notifyResourceUrlChanged(e.detail.resourceUrl)
      } else {
        this.notifyResourceUrlChanged()
      }
    }
  }

  return Mixin
}
