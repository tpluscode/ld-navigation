import { fixture, expect } from '@open-wc/testing'
import { html } from 'lit-html'
import '../src/ld-link.ts'
import eventToPromise from './eventToPromise'
import { LinkedDataLink } from '../src/ld-link'

interface FixtureOptions {
  resourceUrl?: string
}

describe('<ld-link>', () => {
  it('renders no link', async () => {
    // given
    const ldLink = await fixture(
      html`
        <ld-link></ld-link>
      `,
    )

    // then
    expect(ldLink.querySelector('a')).to.be.null
  })

  it('when set with null resource-url does not set self href', async () => {
    // given
    const ldLink = await fixture<LinkedDataLink>(
      html`
        <ld-link></ld-link>
      `,
    )

    // when
    ldLink.resourceUrl = null

    // then
    expect(ldLink.getAttribute('href')).to.be.null
  })

  describe('with inner <A>', () => {
    describe('when set with null resource-url', () => {
      it('does not set link', async () => {
        // given
        const ldLink = await fixture<LinkedDataLink>(
          html`
            <ld-link><a></a></ld-link>
          `,
        )

        // when
        ldLink.resourceUrl = null

        // then
        expect(ldLink.querySelector('a')!.getAttribute('href')).to.be.null
      })

      it('does not set href to self', async () => {
        // given
        const ldLink = await fixture(
          html`
            <ld-link><a></a></ld-link>
          `,
        )

        // then
        expect(ldLink.getAttribute('href')).to.be.null
      })
    })
  })

  it('removes hrefs when resource-url is unset', async () => {
    // given
    const ldLink = await fixture<LinkedDataLink>(
      html`
        <ld-link resource-url="http://example.com/some/path"><a>The link</a></ld-link>
      `,
    )

    // when
    ldLink.resourceUrl = null

    // then
    expect(ldLink.getAttribute('href')).to.be.null
    expect(ldLink.querySelector('a')!.getAttribute('href')).to.be.null
  })

  describe('without base', () => {
    it('when anchor clicked, triggers navigation', async () => {
      // given
      const ldLink = await fixture<LinkedDataLink>(
        html`
          <ld-link resource-url="http://example.com"><a>The link</a></ld-link>
        `,
      )
      const forNavigationEvent = eventToPromise(window, 'ld-navigated')

      // when
      ldLink.querySelector('a')!.click()
      const e = await forNavigationEvent

      // then
      expect(e.detail.resourceUrl).to.equal(ldLink.resourceUrl)
    })

    it('sets current state url as href', async () => {
      // given
      document.addEventListener(
        'navigator-attach',
        function listener(e: any) {
          e.detail.ldNavigator = {
            stateMapper: {
              getStateUrl: () => '/some/path',
            },
          }
          document.removeEventListener('navigator-attach', listener)
        } as (e: Event) => void,
        true,
      )
      const ldLink = await fixture(
        html`
          <ld-link resource-url="http://example.com/some/path"><a>The link</a></ld-link>
        `,
      )

      // then
      expect(ldLink.querySelector('a')!.getAttribute('href')).to.equal('/some/path')
    })
  })

  it('when clicked, triggers navigation', async () => {
    // given
    const ldLink = await fixture<LinkedDataLink>(
      html`
        <ld-link resource-url="http://example.com/some/path">Simple text link</ld-link>
      `,
    )
    const forNavigationEvent = eventToPromise(window, 'ld-navigated')

    // when
    ldLink.click()
    const e = await forNavigationEvent

    // then
    expect(e.detail.resourceUrl).to.equal(ldLink.resourceUrl)
  })
})

describe('<ld-link resource-url="http://example.com/some/path"> text </ld-link>', () => {
  it('should not render anchor', async () => {
    // given
    const ldLink = await fixture(
      html`
        <ld-link resource-url="http://example.com/some/path">Simple text link</ld-link>
      `,
    )

    // then
    expect(ldLink.querySelector('a')).to.be.null
  })
})

describe('<ld-link resource-url="http://example.com/some/path"> other element </ld-link>', () => {
  it('should not render anchor', async () => {
    const ldLink = await fixture(
      html`
        <ld-link resource-url="http://example.com/some/path"
          ><paper-icon-button></paper-icon-button
        ></ld-link>
      `,
    )

    expect(ldLink.querySelector('a')).to.be.null
  })
})
