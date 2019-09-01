import { expect, fixture } from '@open-wc/testing'
import { html } from 'lit-html'
import eventToPromise from './eventToPromise'
import navigate from '../src/fireNavigation'

describe('<ld-navigator>', () => {
  it('should push absolute URL state when ld-navigated event occurs', async () => {
    const elem = await fixture(
      html`
        <ld-navigator></ld-navigator>
      `,
    )
    const forChangeEvent = eventToPromise(elem, 'resource-url-changed')

    navigate('http://example.org/some/path')
    await forChangeEvent

    expect(window.location.pathname).to.equal('/http://example.org/some/path')
  })

  it('should trigger navigation on popstate event', async () => {
    const elem = await fixture(
      html`
        <ld-navigator></ld-navigator>
      `,
    )
    navigate('http://example.org/initial/path')
    navigate('http://example.org/next/path')
    const forChangeEvent = eventToPromise(elem, 'resource-url-changed')

    window.history.back()
    const e = await forChangeEvent

    expect(e.detail.value).to.equal('http://example.org/initial/path')
  })
})

describe('<ld-navigator base>', () => {
  it('should push relative URL state when ld-navigated event occurs', async () => {
    await fixture(
      html`
        <ld-navigator base="http://base2.example.org"></ld-navigator>
      `,
    )
    const forNavigation = eventToPromise(window, 'ld-navigated')

    navigate('http://base2.example.org/some/other/path')
    await forNavigation

    expect(window.location.pathname).to.equal('/some/other/path')
  })
})

describe('<ld-navigator base base-client-path="app-base">', () => {
  it('should push absolute URL state with base prepended when ld-navigated event occurs', async () => {
    await fixture(
      html`
        <ld-navigator base="http://base2.example.org" client-base-path="app-base"></ld-navigator>
      `,
    )
    const forNavigation = eventToPromise(window, 'ld-navigated')

    navigate('http://example.org/some/path')
    await forNavigation

    expect(window.location.pathname).to.equal('/app-base/http://example.org/some/path')
  })
})
