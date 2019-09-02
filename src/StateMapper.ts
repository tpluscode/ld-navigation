import { LdNavigationOptions } from './lib/LdNavigationOptions'

export class StateMapper {
  private readonly __options: LdNavigationOptions

  constructor(options: LdNavigationOptions) {
    this.__options = options
  }

  getResourcePath(url: URL) {
    let path
    if (this.__options.useHashFragment) {
      path = url.hash.substr(1, url.hash.length - 1).replace(/^\//, '')
    } else {
      path = url.pathname.replace(/^\//, '')
      path += url.hash
    }

    if (this.__options.clientBasePath) {
      return path.replace(new RegExp(`^${this.__options.clientBasePath}/`), '')
    }

    return path
  }

  getResourceUrl(urlString: string) {
    const url = new URL(urlString)
    const path = this.getResourcePath(url)

    if (/^https?:\/\//.test(path)) {
      return path + url.search
    }
    return `${this.__options.baseUrl}/${path}${url.search}`
  }

  getStatePath(resourceUrl: string) {
    const resourcePath = resourceUrl.replace(new RegExp(`^${this.__options.baseUrl}`), '')

    if (resourcePath[0] !== '/') {
      return `/${resourcePath}`
    }

    return resourcePath
  }

  getStateUrl(resourceUrl: string) {
    const path = this.getStatePath(resourceUrl)

    if (this.__options.useHashFragment) {
      return `/${this.__options.clientBasePath}#${path}`
    }

    if (this.__options.clientBasePath) {
      return `/${this.__options.clientBasePath}${path}`
    }

    return `${path}`
  }
}
