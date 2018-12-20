/* global describe, location, it, history */
/* eslint-disable no-unused-expressions */
import { expect } from '@open-wc/testing'
import eventToPromise from './eventToPromise'
import navigatorFixture from './ld-navigator.fixture'
import Helpers from '../LdNavigation'

describe('<ld-navigator>', () => {
  it('should push absolute URL state when ld-navigated event occurs', async () => {
    const elem = await navigatorFixture()
    const forChangeEvent = eventToPromise(elem, 'resource-url-changed')

    Helpers.fireNavigation(document, 'http://example.org/some/path')
    await forChangeEvent

    expect(location.pathname).to.equal('/http://example.org/some/path')
  })

  it('should trigger navigation on popstate event', async () => {
    const elem = await navigatorFixture()
    const forChangeEvent = eventToPromise(elem, 'resource-url-changed')
    Helpers.fireNavigation(document, 'http://example.org/initial/path')
    Helpers.fireNavigation(document, 'http://example.org/next/path')

    history.back()
    const e = await forChangeEvent

    expect(e.detail.value).to.equal('http://example.org/initial/path')
  })
})

describe('<ld-navigator base>', () => {
  it('should push relative URL state when ld-navigated event occurs', async () => {
    await navigatorFixture({ base: 'http://base2.example.org' })
    const forNavigation = eventToPromise(window, 'ld-navigated')

    Helpers.fireNavigation(document, 'http://base2.example.org/some/other/path')
    await forNavigation

    expect(location.pathname).to.equal('/some/other/path')
  })
})

describe('<ld-navigator base base-client-path="app-base">', () => {
  it('should push absolute URL state with base prepended when ld-navigated event occurs', async () => {
    await navigatorFixture({ base: 'http://base2.example.org', clientBasePath: 'app-base' })
    const forNavigation = eventToPromise(window, 'ld-navigated')

    Helpers.fireNavigation(document, 'http://example.org/some/path')
    await forNavigation

    expect(location.pathname).to.equal('/app-base/http://example.org/some/path')
  })
})
