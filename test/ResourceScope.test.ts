/* eslint-disable class-methods-use-this, max-classes-per-file */
import { expect, fixture, html } from '@open-wc/testing'
import sinon, { SinonSpy } from 'sinon'
import { customElement } from 'lit-element'
import { ResourceScope, StateMapper } from '../src'

let onResourceUrlChangedSpy: SinonSpy

@customElement('test-element')
class TestElement extends ResourceScope(HTMLElement) {
  createStateMapper() {
    return sinon.createStubInstance(StateMapper)
  }

  onResourceUrlChanged(value: string) {
    onResourceUrlChangedSpy(value)
  }
}

describe('ResourceScope', () => {
  describe('.usesHashFragment', () => {
    it('is false by default', async () => {
      // given
      const resourceScope = await fixture<TestElement>(
        html`
          <test-element></test-element>
        `,
      )

      // then
      expect(resourceScope.usesHashFragment).to.be.false
    })
  })

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
  })
})
