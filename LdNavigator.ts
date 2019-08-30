class LdNavigator {
  private _base = ''
  public clientBasePath = ''
  public useHashFragment = false

  get base() {
    return this._base
  }

  set base(url) {
    let base = url

    if (url && url.replace) {
      base = url.replace(new RegExp('/$'), '')
    }

    this._base = base || ''
  }

  get resourcePath() {
    let path
    if (this.useHashFragment) {
      path = document.location.hash.substr(1, document.location.hash.length - 1).replace(/^\//, '')
    } else {
      path = document.location.pathname.replace(/^\//, '')
      path += document.location.hash
    }

    if (this.clientBasePath) {
      return path.replace(new RegExp(`^${this.clientBasePath}/`), '')
    }

    return path
  }

  get statePath() {
    return this.resourcePath
  }

  get resourceUrl() {
    const path = this.resourcePath

    if (/^https?:\/\//.test(path)) {
      return path + document.location.search
    }
    return `${this.base}/${path}${document.location.search}`
  }

  getStatePath(absoluteUrl: string) {
    let resourcePath = absoluteUrl.replace(new RegExp(`^${this.base}`), '')

    if (resourcePath[0] !== '/') {
      resourcePath = `/${resourcePath}`
    }

    if (this.clientBasePath && this.useHashFragment === false) {
      return `/${this.clientBasePath}${resourcePath}`
    }

    return resourcePath
  }

  _resourceUrlMatchesBase(absoluteUrl: string) {
    return !!this.base && !!absoluteUrl.match(`^${this.base}`)
  }
}

export default new LdNavigator()
