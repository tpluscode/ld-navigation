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
  stateMapper: StateMapper | Promise<StateMapper>
  clientBasePath?: string
  usesHashFragment?: boolean
  notifyResourceUrlChanged(url?: string): void
  onResourceUrlChanged(url: string): void | Promise<void>
}

type ReturnConstructor = new (...args: any[]) => HTMLElement & ResourceScopingElement

export function ResourceScope<B extends BaseConstructor>(Base: B): B & ReturnConstructor {
  abstract class Mixin extends Base implements ResourceScopingElement {
    public resourceUrl?: string
    protected _stateMapper: StateMapper | Promise<StateMapper> | null = null
    public clientBasePath?: string

    public get stateMapper() {
      if (!this._stateMapper) {
        this._stateMapper = this.createStateMapper()
      }

      return this._stateMapper
    }

    public abstract createStateMapper(): StateMapper | Promise<StateMapper>

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
      if (this.stateMapper instanceof Promise) {
        return this.stateMapper.then(sm => sm.getResourceUrl(document.location.href))
      }

      return this.stateMapper.getResourceUrl(document.location.href)
    }

    @boundMethod
    public async notifyResourceUrlChanged(value?: string) {
      const prevUrl = this.resourceUrl
      this.resourceUrl = value || (await this.mappedResourceUrl)

      if (this.resourceUrl !== prevUrl) {
        getAllImplementationsOf(this, 'onResourceUrlChanged').forEach(fn =>
          fn.call(this, this.resourceUrl),
        )
      }
    }

    public abstract onResourceUrlChanged(newValue: string): void | Promise<void>

    @boundMethod
    private __onNavigated(e: any) {
      if (e.detail && e.detail.resourceUrl) {
        this.notifyResourceUrlChanged(e.detail.resourceUrl).then(this.__notifyUrlChange)
      } else {
        this.notifyResourceUrlChanged().then(this.__notifyUrlChange)
      }
    }

    @boundMethod
    private __notifyUrlChange() {
      this.dispatchEvent(new Event('url-change-notified'))
    }
  }

  return Mixin
}
