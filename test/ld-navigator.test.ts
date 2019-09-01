import { expect, fixture } from '@open-wc/testing'
import '../src/ld-navigator.ts'
import { html } from 'lit-html'
import navigate from '../src/fireNavigation'
import eventToPromise from './eventToPromise'
import { LdNavigator } from '../src/ld-navigator'
import { StateMapper } from '../src/StateMapper'

describe('<ld-navigator>', () => {
  it("doesn't set attribute when setting base URL property", async () => {
    const ldNavigator = await fixture<LdNavigator>(
      html`
        <ld-navigator></ld-navigator>
      `,
    )

    ldNavigator.base = 'http://example.org/'

    expect(ldNavigator.getAttribute('base')).to.be.null
  })

  it('should change resource url when ld-navigation occurs', async () => {
    const ldNavigator = await fixture<LdNavigator>(
      html`
        <ld-navigator></ld-navigator>
      `,
    )
    const forChangeEvent = eventToPromise(ldNavigator, 'resource-url-changed')

    navigate('http://example.org/current/resource')
    const e = await forChangeEvent

    expect(e.detail.value).to.equal('http://example.org/current/resource')
  })

  it('should not change resource url when it is same as current', async () => {
    let handled: boolean
    const ldNavigator = await fixture<LdNavigator>(
      html`
        <ld-navigator></ld-navigator>
      `,
    )
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
    const ldNavigator = await fixture<LdNavigator>(
      html`
        <ld-navigator></ld-navigator>
      `,
    )

    window.history.pushState({}, '', '/test/ld-navigator-tests.html')

    expect(ldNavigator.resourceUrl).to.match(new RegExp('^/.*test/ld-navigator-tests.html'))
  })

  it('sets property when setting base attribute', async () => {
    const ldNavigator = await fixture<LdNavigator>(
      html`
        <ld-navigator base="http://example.org/"></ld-navigator>
      `,
    )

    expect(ldNavigator.base).to.equal('http://example.org')
  })

  it('sets property when setting client-base-path attribute', async () => {
    await fixture<LdNavigator>(
      html`
        <ld-navigator client-base-path="my/test"></ld-navigator>
      `,
    )

    expect(StateMapper.clientBasePath).to.equal('my/test')
  })

  it('should remove trailing slash from base URL', async () => {
    const ldNavigator = await fixture<LdNavigator>(
      html`
        <ld-navigator base="http://example.org/"></ld-navigator>
      `,
    )

    expect(ldNavigator.base).to.equal('http://example.org')
  })

  it('should preserve resource id hash part in location', async () => {
    const elem = await fixture<LdNavigator>(
      html`
        <ld-navigator></ld-navigator>
      `,
    )
    const forChangeEvent = eventToPromise(elem, 'resource-url-changed')

    navigate('http://example.org/some/path#id')
    await forChangeEvent

    expect(window.location.href).to.match(/http:\/\/example.org\/some\/path#id$/)
    expect(elem.resourceUrl).to.equal('http://example.org/some/path#id')
  })
})

describe('<ld-navigator use-hash-fragment>', () => {
  it('should preserve resource id hash part in location', async () => {
    const elem = await fixture<LdNavigator>(
      html`
        <ld-navigator use-hash-fragment></ld-navigator>
      `,
    )
    const forChangeEvent = eventToPromise(elem, 'resource-url-changed')

    navigate('http://example.org/some/path#id')
    await forChangeEvent

    expect(window.location.hash).to.equal('#/http://example.org/some/path#id')
    expect(elem.resourceUrl).to.equal('http://example.org/some/path#id')
  })
})

describe('<ld-navigator base="http://example.com">', () => {
  it('has resource URL set to absolute document path', async () => {
    const ldNavigator = await fixture<LdNavigator>(
      html`
        <ld-navigator base="http://example.com"></ld-navigator>
      `,
    )

    window.history.pushState({}, '', '/some/client/path/ld-navigator-tests.html')

    expect(ldNavigator.resourceUrl).to.equal(
      'http://example.com/some/client/path/ld-navigator-tests.html',
    )
  })
})

describe('<ld-navigator base="http://example.com" client-base-path="components/html5-history/test">', () => {
  it('has resource URL without base client path', async () => {
    const ldNavigator = await fixture<LdNavigator>(
      html`
        <ld-navigator
          base="http://example.com"
          client-base-path="components/html5-history/test"
        ></ld-navigator>
      `,
    )

    window.history.pushState({}, '', '/components/html5-history/test/ld-navigator-tests.html')

    expect(ldNavigator.resourceUrl).to.equal('http://example.com/ld-navigator-tests.html')
  })
})