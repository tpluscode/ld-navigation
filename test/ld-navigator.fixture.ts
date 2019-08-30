import { litFixture } from '@open-wc/testing'
import { html } from 'lit-html'
import { ifDefined } from 'lit-html/directives/if-defined'
import { LdNavigatorElement } from '../src/ld-navigator'

interface FixtureOptions {
  base?: string
  clientBasePath?: string
  useHashFragment?: boolean
}

export default function navigatorFixture({
  base,
  clientBasePath,
  useHashFragment,
}: FixtureOptions = {}): Promise<LdNavigatorElement> {
  return litFixture(html`
    <ld-navigator
      base="${ifDefined(base)}"
      client-base-path="${ifDefined(clientBasePath)}"
      ?use-hash-fragment="${useHashFragment || false}"
    ></ld-navigator>
  `)
}
