import { litFixture } from '@open-wc/testing'
import { html } from 'lit-html'
import { ifDefined } from 'lit-html/directives/if-defined'

export default function navigatorFixture ({ base, clientBasePath, useHashFragment = false } = {}) {
  return litFixture(html`<ld-navigator base="${ifDefined(base)}"
                                       client-base-path="${ifDefined(clientBasePath)}"
                                       ?use-hash-fragment="${useHashFragment}"></ld-navigator>`)
}
