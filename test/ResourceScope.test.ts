/* eslint-disable class-methods-use-this, max-classes-per-file */
import { expect, fixture, html } from '@open-wc/testing'
import sinon, { SinonSpy, SinonStub } from 'sinon'
import { customElement } from 'lit-element'
import { ResourceScope, StateMapper } from '../src'
import eventToPromise from './eventToPromise'

let onResourceUrlChangedSpy: SinonSpy

@customElement('test-element')
class TestElement extends ResourceScope(HTMLElement) {
  stubMapper = sinon.createStubInstance(StateMapper)

  createStateMapper() {
    if (this.hasAttribute('async-mapper')) {
      return Promise.resolve(this.stubMapper)
    }

    return this.stubMapper
  }

  onResourceUrlChanged(value: string) {
    onResourceUrlChangedSpy(value)
  }
}

describe('ResourceScope', () => {
  describe('.onResourceUrlChanged', () => {
    type BaseConstructor = new (...args: any[]) => TestElement
    function TestMixin<B extends BaseConstructor>(Base: B): B {
      return class Mixin extends Base {
        onResourceUrlChanged(value: string) {
          onResourceUrlChangedSpy(value)
        }
      }
    }

    @customElement('multi-mixed')
    class HeavilyMixed extends TestMixin(TestMixin(TestMixin(TestElement))) {
      onResourceUrlChanged(value: string) {
        onResourceUrlChangedSpy(value)
      }
    }

    beforeEach(() => {
      onResourceUrlChangedSpy = sinon.spy()
    })

    it('is called on every mixin and actual class when element notifies', async () => {
      // given
      const element = await fixture<HeavilyMixed>(
        html`
          <multi-mixed></multi-mixed>
        `,
      )

      // when
      element.notifyResourceUrlChanged('http://foo/bar')

      // then
      expect(onResourceUrlChangedSpy.callCount).to.equal(5)
      expect(onResourceUrlChangedSpy).to.have.calledWithExactly('http://foo/bar')
    })

    it('is called when global navigation event occurs', async () => {
      // given
      await fixture<TestElement>(
        html`
          <test-element></test-element>
        `,
      )

      // when
      document.dispatchEvent(
        new CustomEvent('ld-navigated', {
          detail: {
            resourceUrl: 'http://foo/bar',
          },
        }),
      )

      // then
      expect(onResourceUrlChangedSpy.callCount).to.equal(1)
      expect(onResourceUrlChangedSpy).to.have.calledWithExactly('http://foo/bar')
    })

    it('is called when URL changes', async () => {
      // given
      const el = await fixture<TestElement>(
        html`
          <test-element></test-element>
        `,
      )
      ;((el.stateMapper as StateMapper).getResourceUrl as SinonStub).returns('http://foo/bar.xml')
      const forEvent = eventToPromise(el, 'url-changed')

      // when
      document.location.hash = 'url-change-test'
      await forEvent

      // then
      expect(onResourceUrlChangedSpy.callCount).to.equal(1)
      expect(onResourceUrlChangedSpy).to.have.calledWithExactly('http://foo/bar.xml')
    })
  })

  describe('.connectedCallback', () => {
    class WithConnectedCallback extends HTMLElement {
      public connected = false

      connectedCallback() {
        this.connected = true
      }

      createStateMapper() {
        return sinon.createStubInstance(StateMapper)
      }
    }

    it('is called on superclass', async () => {
      // given
      customElements.define('with-callback', class extends ResourceScope(WithConnectedCallback) {})

      // when
      const el = await fixture<WithConnectedCallback>('<with-callback></with-callback>')

      // then
      expect(el.connected).to.be.true
    })
  })

  describe('.disconnectedCallback', () => {
    class WithDisconnectedCallback extends HTMLElement {
      public disconnectedCalled = false

      disconnectedCallback() {
        this.disconnectedCalled = true
      }

      createStateMapper() {
        return sinon.createStubInstance(StateMapper)
      }
    }

    it('is called on superclass', async () => {
      // given
      customElements.define(
        'with-disconnected',
        class extends ResourceScope(WithDisconnectedCallback) {},
      )
      const el = await fixture<WithDisconnectedCallback>('<with-disconnected></with-disconnected>')

      // when
      el.remove()

      // then
      expect(el.disconnectedCalled).to.be.true
    })
  })

  describe('with async state mapper', () => {
    it('successfully maps resource url', async () => {
      // given
      const scoped = await fixture<TestElement>(
        html`
          <test-element async-mapper></test-element>
        `,
      )

      // when
      // eslint-disable-next-line no-unused-vars
      await scoped.mappedResourceUrl

      // then
      expect(scoped.stubMapper.getResourceUrl.called).to.be.true
    })
  })
})
