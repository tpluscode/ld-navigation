import { expect } from '@open-wc/testing'
import eventToPromise from './eventToPromise'
import navigatorFixture from './ld-navigator.fixture'
import navigate from '../fireNavigation'

describe('<ld-navigator use-hash-fragment>', () => {
  it('should set URL hash when ld-navigated event occurs', async () => {
    await navigatorFixture({ useHashFragment: true })
    const forNavigation = eventToPromise(window, 'ld-navigated')

    navigate('http://example.org/hash/path')
    await forNavigation

    expect(window.location.hash).to.equal('#/http://example.org/hash/path')
  })

  it('should change resourceUrl on hashchange event', async () => {
    const elem = await navigatorFixture({ useHashFragment: true })
    const forChangeEvent = eventToPromise(elem, 'resource-url-changed')

    document.location.hash = '/http://example.org/explicit/path'
    const e = await forChangeEvent

    expect(e.detail.value).to.equal('http://example.org/explicit/path')
    expect(elem.resourceUrl).to.equal('http://example.org/explicit/path')
  })
})

describe('<ld-navigator use-hash-fragment base="">', () => {
  it('should push relative URL state when ld-navigated event occurs', async () => {
    await navigatorFixture({ useHashFragment: true, base: 'http://base.example.org' })
    const forHashChange = eventToPromise(window, 'hashchange')

    navigate('http://base.example.org/some/other/path')
    await forHashChange

    expect(window.location.hash).to.equal('#/some/other/path')
  })
})
