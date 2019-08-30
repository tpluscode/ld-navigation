import { expect } from '@open-wc/testing'
import '../ld-navigator.ts'
import navigate from '../fireNavigation'
import eventToPromise from './eventToPromise'
import navigatorFixture from './ld-navigator.fixture'

describe('<ld-navigator>', () => {
  it("doesn't set attribute when setting base URL property", async () => {
    const ldNavigator = await navigatorFixture()

    ldNavigator.base = 'http://example.org/'

    expect(ldNavigator.getAttribute('base')).to.be.null
  })

  it('should change resource url when ld-navigation occurs', async () => {
    const ldNavigator = await navigatorFixture()
    const forChangeEvent = eventToPromise(ldNavigator, 'resource-url-changed')

    navigate('http://example.org/current/resource')
    const e = await forChangeEvent

    expect(e.detail.value).to.equal('http://example.org/current/resource')
  })

  it('should not change resource url when it is same as current', async () => {
    let handled: boolean
    const ldNavigator = await navigatorFixture()
    navigate('http://example.org/current/resource')

    ldNavigator.addEventListener('resource-url-changed', () => {
      handled = true
    })

    navigate('http://example.org/current/resource')

    return new Promise((resolve, reject) => {
      window.setTimeout(
        () =>
          handled
            ? reject(new Error('resource-url-changed event should not have happened'))
            : resolve(),
        200,
      )
    })
  })

  it('has resource URL set to relative document path', async () => {
    const ldNavigator = await navigatorFixture()

    window.history.pushState({}, '', '/test/ld-navigator-tests.html')

    expect(ldNavigator.resourceUrl).to.match(new RegExp('^/.*test/ld-navigator-tests.html'))
  })

  it('sets property when setting base attribute', async () => {
    const ldNavigator = await navigatorFixture({
      base: 'http://example.org',
    })

    expect(ldNavigator.base).to.equal('http://example.org')
  })

  it('sets property when setting client-base-path attribute', async () => {
    const ldNavigator = await navigatorFixture({
      clientBasePath: 'my/test',
    })

    expect(ldNavigator.clientBasePath).to.equal('my/test')
  })

  it('should remove trailing slash from base URL', async () => {
    const ldNavigator = await navigatorFixture({
      base: 'http://example.org/',
    })

    expect(ldNavigator.base).to.equal('http://example.org')
  })

  it('should preserve resource id hash part in location', async () => {
    const elem = await navigatorFixture()
    const forChangeEvent = eventToPromise(elem, 'resource-url-changed')

    navigate('http://example.org/some/path#id')
    await forChangeEvent

    expect(window.location.href).to.match(/http:\/\/example.org\/some\/path#id$/)
    expect(elem.resourceUrl).to.equal('http://example.org/some/path#id')
  })
})

describe('<ld-navigator use-hash-fragment>', () => {
  it('should preserve resource id hash part in location', async () => {
    const elem = await navigatorFixture({ useHashFragment: true })
    const forChangeEvent = eventToPromise(elem, 'resource-url-changed')

    navigate('http://example.org/some/path#id')
    await forChangeEvent

    expect(window.location.hash).to.equal('#/http://example.org/some/path#id')
    expect(elem.resourceUrl).to.equal('http://example.org/some/path#id')
  })
})

describe('<ld-navigator base="http://example.com">', () => {
  it('has resource URL set to absolute document path', async () => {
    const ldNavigator = await navigatorFixture({
      base: 'http://example.com',
    })

    window.history.pushState({}, '', '/some/client/path/ld-navigator-tests.html')

    expect(ldNavigator.resourceUrl).to.equal(
      'http://example.com/some/client/path/ld-navigator-tests.html',
    )
  })
})

describe('<ld-navigator base="http://example.com" client-base-path="components/html5-history/test">', () => {
  it('has resource URL without base client path', async () => {
    const ldNavigator = await navigatorFixture({
      base: 'http://example.com',
      clientBasePath: 'components/html5-history/test',
    })

    window.history.pushState({}, '', '/components/html5-history/test/ld-navigator-tests.html')

    expect(ldNavigator.resourceUrl).to.equal('http://example.com/ld-navigator-tests.html')
  })
})
