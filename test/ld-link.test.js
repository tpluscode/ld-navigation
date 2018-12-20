/* global describe, beforeEach, it */
/* eslint-disable no-unused-expressions */
import { litFixture as fixture, expect } from '@open-wc/testing'
import { html } from 'lit-html'
import { ifDefined } from 'lit-html/directives/if-defined'
import '../src/ld-navigator'
import '../src/ld-link'
import eventToPromise from './eventToPromise'

async function ldLinkFixture ({ base, useHashFragment, resourceUrl, clientBasePath } = {}, inner = '') {
  const addNavigator = base || useHashFragment || clientBasePath
  const navigator = html`<ld-navigator base="${ifDefined(base)}"
                                       ?use-hash-fragment="${useHashFragment}"
                                       client-base-path="${ifDefined(clientBasePath)}"></ld-navigator>`

  const element = await fixture(html`
    <div>
      ${!addNavigator ? '' : navigator}
      <ld-link resource-url="${resourceUrl}">
        ${inner}
      </ld-link>
    </div>`)

  return element.querySelector('ld-link')
}

describe('<ld-link>', () => {
  let ldLink

  beforeEach(async () => {
    ldLink = await ldLinkFixture()
  })

  it('renders no link', () => {
    expect(ldLink.querySelector('a')).to.be.null
  })

  describe('when set with null resource-url', () => {
    beforeEach(() => {
      ldLink.resourceUrl = null
    })

    it('does not set self href', () => {
      expect(ldLink.getAttribute('href')).to.be.null
    })
  })
})

describe('<ld-link><a/></ld-link>', () => {
  let ldLink

  beforeEach(async () => {
    ldLink = await ldLinkFixture({ }, html`<a></a>`)
  })

  describe('when set with null resource-url', () => {
    beforeEach(() => {
      ldLink.resourceUrl = null
    })

    it('does not set link', () => {
      expect(ldLink.querySelector('a').getAttribute('href')).to.be.null
    })

    it('does not set href to self', () => {
      expect(ldLink.getAttribute('href')).to.be.null
    })
  })
})

describe('<ld-link resource-url="http://example.com/some/path"><a/></ld-link>', () => {
  it('removes hrefs when resource-url is unset', async () => {
    const ldLink = await ldLinkFixture({
      resourceUrl: 'http://example.com/some/path',
      base: ''
    }, html`<a>The link</a>`)

    ldLink.resourceUrl = null

    expect(ldLink.getAttribute('href')).to.be.null
    expect(ldLink.querySelector('a').getAttribute('href')).to.be.null
  })

  describe('without base', () => {
    let ldLink

    beforeEach(async () => {
      ldLink = await ldLinkFixture({
        resourceUrl: 'http://example.com/some/path',
        base: ''
      }, html`<a>The link</a>`)
    })

    it('sets absolute href link', function () {
      expect(ldLink.querySelector('a').getAttribute('href')).to.equal('/http://example.com/some/path')
    })

    it('when anchor clicked, triggers navigation', async () => {
      const forNavigationEvent = eventToPromise(window, 'ld-navigated')

      ldLink.querySelector('a').click()
      const e = await forNavigationEvent

      expect(e.detail.resourceUrl).to.equal(ldLink.resourceUrl)
    })
  })

  describe('with base', () => {
    it('sets relative href link', async () => {
      const ldLink = await ldLinkFixture({
        resourceUrl: 'http://example.com/some/path',
        base: 'http://example.com'
      }, html`<a>The link</a>`)

      expect(ldLink.querySelector('a').getAttribute('href')).to.equal('/some/path')
    })
  })

  describe('with base and client-base-path', () => {
    it('sets relative href link with client base prepended', async () => {
      const ldLink = await ldLinkFixture({
        resourceUrl: 'http://example.com/some/path',
        base: 'http://example.com',
        clientBasePath: 'some/base'
      }, html`<a>The link</a>`)

      expect(ldLink.querySelector('a').getAttribute('href')).to.equal('/some/base/some/path')
    })
  })

  describe('without base, using hash fragment', () => {
    it('sets absolute href link', async () => {
      const ldLink = await ldLinkFixture({
        base: '',
        useHashFragment: true,
        resourceUrl: 'http://example.com/some/path'
      }, html`<a>The link</a>`)

      expect(ldLink.querySelector('a').getAttribute('href')).to.equal('#/http://example.com/some/path')
    })
  })

  describe('with base, using hash fragment', () => {
    it('sets relative href link', async () => {
      const ldLink = await ldLinkFixture({
        resourceUrl: 'http://example.com/some/path',
        base: 'http://example.com',
        useHashFragment: true
      }, html`<a>The link</a>`)

      expect(ldLink.querySelector('a').getAttribute('href')).to.equal('#/some/path')
    })
  })

  describe('with base and client-base-path, using hash fragment', () => {
    it('sets relative href link', async () => {
      const ldLink = await ldLinkFixture({
        resourceUrl: 'http://example.com/some/path',
        base: 'http://example.com',
        clientBasePath: 'some/base',
        useHashFragment: true
      }, html`<a>The link</a>`)

      expect(ldLink.querySelector('a').getAttribute('href')).to.equal('#/some/path')
    })
  })
})

describe('<ld-link resource-url="http://example.com/some/path"> text </ld-link>', () => {
  let ldLink

  beforeEach(async () => {
    ldLink = await ldLinkFixture({
      resourceUrl: 'http://example.com/some/path'
    }, 'Simple text link')
  })

  it('should not render anchor', function () {
    expect(ldLink.querySelector('a')).to.be.null
  })

  it('when clicked, triggers navigation', async () => {
    const forNavigationEvent = eventToPromise(window, 'ld-navigated')

    ldLink.click()
    const e = await forNavigationEvent

    expect(e.detail.resourceUrl).to.equal(ldLink.resourceUrl)
  })
})

describe('<ld-link resource-url="http://example.com/some/path"> other element </ld-link>', () => {
  it('should not render anchor', async () => {
    const ldLink = await ldLinkFixture({
      resourceUrl: 'http://example.com/some/path'
    }, html`<paper-icon-button></paper-icon-button>`)

    expect(ldLink.querySelector('a')).to.be.null
  })
})

