interface StateMapperOptions {
  baseUrl?: string
  useHashFragment?: boolean
  clientBasePath?: string
}

export class StateMapper {
  private readonly __baseUrl: string
  private readonly __useHashFragment: boolean
  private readonly __clientBasePath: string

  constructor(options: StateMapperOptions = {}) {
    this.__baseUrl = (options.baseUrl || '').replace(new RegExp('/$'), '')
    this.__clientBasePath = options.clientBasePath || ''
    this.__useHashFragment = options.useHashFragment || false
  }

  getResourcePath(url: URL) {
    let path
    if (this.__useHashFragment) {
      path = url.hash.substr(1, url.hash.length - 1).replace(/^\//, '')
    } else {
      path = url.pathname.replace(/^\//, '')
      path += url.hash
    }

    if (this.__clientBasePath) {
      return path.replace(new RegExp(`^${this.__clientBasePath}/`), '')
    }

    return path
  }

  getResourceUrl(urlString: string) {
    const url = new URL(urlString)
    const path = this.getResourcePath(url)

    if (/^https?:\/\//.test(path)) {
      return path + url.search
    }
    return `${this.__baseUrl}/${path}${url.search}`
  }

  getStatePath(resourceUrl: string) {
    const resourcePath = resourceUrl.replace(new RegExp(`^${this.__baseUrl}`), '')

    if (resourcePath[0] !== '/') {
      return `/${resourcePath}`
    }

    return resourcePath
  }

  getStateUrl(resourceUrl: string) {
    const path = this.getStatePath(resourceUrl)

    if (this.__useHashFragment) {
      return `/${this.__clientBasePath}#${path}`
    }

    if (this.__clientBasePath) {
      return `/${this.__clientBasePath}${path}`
    }

    return `${path}`
  }
}
