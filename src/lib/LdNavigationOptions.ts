interface OptionsInit {
  baseUrl?: string
  useHashFragment?: boolean
  clientBasePath?: string
}

export class LdNavigationOptions {
  public readonly useHashFragment: boolean
  public readonly baseUrl: string
  public readonly clientBasePath?: string

  constructor({ baseUrl, useHashFragment = false, clientBasePath }: OptionsInit = {}) {
    this.useHashFragment = useHashFragment
    this.clientBasePath = clientBasePath

    if (baseUrl) {
      this.baseUrl = baseUrl.replace(new RegExp('/$'), '')
    } else {
      this.baseUrl = baseUrl || ''
    }
  }
}
