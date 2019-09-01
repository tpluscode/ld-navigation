import EventEmitter from 'little-emitter'

export class StateMapper extends EventEmitter {
  private _base = ''
  private _reflect = false
  public static clientBasePath = ''
  private static __useHashFragment = false
  private __location: Location

  constructor(location: Location = document.location) {
    super()
    this.__location = location

    document.addEventListener('ld-navigated', (e: any) => {
      if (this.reflect) {
        if (StateMapper.useHashFragment) {
          document.location.href = `/${StateMapper.clientBasePath}/#${this.getStatePath(
            e.detail.resourceUrl,
          )}`
        } else if (e.detail.resourceUrl !== window.history.state) {
          window.history.pushState(
            e.detail.resourceUrl,
            '',
            `/${StateMapper.clientBasePath}${this.getStatePath(e.detail.resourceUrl)}`,
          )
        }
      }

      this.emit('state-change', e.detail.resourceUrl)
    })

    window.addEventListener('popstate', (e: any) => {
      this.emit('state-change', this.resourceUrl)
    })

    window.addEventListener('hashchange', (e: any) => {
      this.emit('state-change', this.resourceUrl)
    })
  }

  static get useHashFragment() {
    if (!(window.history && window.history.pushState)) {
      return true
    }

    return StateMapper.__useHashFragment
  }

  static set useHashFragment(value) {
    StateMapper.__useHashFragment = value
  }

  get base() {
    return this._base
  }

  set base(url) {
    if (url) {
      this._base = url.replace(new RegExp('/$'), '')
    } else {
      this._base = url || ''
    }
  }

  get reflect() {
    return this._reflect
  }

  set reflect(reflect) {
    this._reflect = true
  }

  get resourcePath() {
    let path
    if (StateMapper.useHashFragment) {
      path = this.__location.hash.substr(1, this.__location.hash.length - 1).replace(/^\//, '')
    } else {
      path = this.__location.pathname.replace(/^\//, '')
      path += this.__location.hash
    }

    if (StateMapper.clientBasePath) {
      return path.replace(new RegExp(`^${StateMapper.clientBasePath}/`), '')
    }

    return path
  }

  get resourceUrl() {
    const path = this.resourcePath

    if (/^https?:\/\//.test(path)) {
      return path + this.__location.search
    }
    return `${this.base}/${path}${this.__location.search}`
  }

  getStatePath(resourceUrl: string) {
    const resourcePath = resourceUrl.replace(new RegExp(`^${this.base}`), '')

    if (resourcePath[0] !== '/') {
      return `/${resourcePath}`
    }

    return resourcePath
  }

  getStateUrl(resourceUrl: string) {
    const path = this.getStatePath(resourceUrl)

    if (StateMapper.useHashFragment) {
      return `${this.__location.origin}/${StateMapper.clientBasePath}#${path}`
    }

    if (StateMapper.clientBasePath) {
      return `${this.__location.origin}/${StateMapper.clientBasePath}${path}`
    }

    return `${this.__location.origin}${path}`
  }
}
