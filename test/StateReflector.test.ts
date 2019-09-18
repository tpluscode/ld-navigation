/* eslint-disable max-classes-per-file,class-methods-use-this,@typescript-eslint/no-empty-function */
import sinon, { SinonSpy } from 'sinon'
import { expect, fixture } from '@open-wc/testing'
import { customElement } from 'lit-element'
import { ReflectedInHash, ReflectedInHistory, StateMapper } from '../src'
import { ResourceScopingElement } from '../src/lib/ResourceScope'

class TestScopedElement extends HTMLElement implements ResourceScopingElement {
  public testMapper: sinon.SinonStubbedInstance<StateMapper> | null = null

  public createStateMapper(): StateMapper {
    return this.testMapper as any
  }

  public clientBasePath = ''
  public get stateMapper(): StateMapper {
    return this.testMapper as any
  }

  notifyResourceUrlChanged(url?: string): void {}

  onResourceUrlChanged(url: string): void {}
}

describe('StateReflector', () => {
  describe('reflecting to history API', () => {
    let history: {
      state: unknown
      pushState: SinonSpy
      replaceState: SinonSpy
    }

    @customElement('t-history')
    class TestHistoryReflected extends ReflectedInHistory(TestScopedElement) {
      constructor() {
        super()
        ;(this as any).__history = history
      }
    }

    beforeEach(() => {
      history = {
        pushState: sinon.spy(),
        replaceState: sinon.spy(),
        state: null,
      }
    })

    it('does not use hash fragment', async () => {
      // given
      const testElement = await fixture<TestHistoryReflected>('<t-history></t-history>')

      // then
      expect(testElement.usesHashFragment).to.be.false
    })

    it('pushes history state', async () => {
      // given
      const testElement = await fixture<TestHistoryReflected>('<t-history></t-history>')
      testElement.testMapper = sinon.createStubInstance(StateMapper)
      testElement.testMapper.getStatePath.returns('/hello')
      history.state = 'some state'

      // when
      testElement.reflectUrlInState('http://hello/world')

      // then
      expect(history.pushState).to.have.calledWith(
        'http://hello/world',
        '',
        `${document.location.origin}/hello`,
      )
    })

    it('includes client path in pushed history state', async () => {
      // given
      const testElement = await fixture<TestHistoryReflected>('<t-history></t-history>')
      testElement.testMapper = sinon.createStubInstance(StateMapper)
      testElement.testMapper.getStatePath.returns('/hello')
      testElement.clientBasePath = 'some/long/path'
      history.state = 'some state'

      // when
      testElement.reflectUrlInState('http://hello/world')

      // then
      expect(history.pushState).to.have.calledWith(
        'http://hello/world',
        '',
        `${document.location.origin}/some/long/path/hello`,
      )
    })

    it('does not push state fo initial matching resourceUrl', async () => {
      // given
      const testElement = await fixture<TestHistoryReflected>('<t-history></t-history>')
      testElement.testMapper = sinon.createStubInstance(StateMapper)
      testElement.testMapper.getStatePath.returns('/hello')
      testElement.clientBasePath = 'some/long/path'

      // when
      testElement.reflectUrlInState('http://hello/world')

      // then
      expect(history.pushState).to.not.have.called
      expect(history.replaceState).to.have.called
    })
  })

  describe('reflecting to hash', () => {
    @customElement('t-hash')
    class TestHashReflected extends ReflectedInHash(TestScopedElement) {}

    it('uses hash fragment', async () => {
      // given
      const testElement = await fixture<TestHashReflected>('<t-hash></t-hash>')

      // then
      expect(testElement.usesHashFragment).to.be.true
    })

    it('sets hash fragment', async () => {
      // given
      const testElement = await fixture<TestHashReflected>('<t-hash></t-hash>')
      testElement.testMapper = sinon.createStubInstance(StateMapper)
      testElement.testMapper.getStatePath.returns('hello')

      // when
      testElement.reflectUrlInState('http://hello/world')

      // then
      expect(document.location.hash).to.be.equal('#hello')
    })

    it('does reflecting when url has changed', async () => {
      // given
      const testElement = await fixture<TestHashReflected>('<t-hash></t-hash>')
      testElement.testMapper = sinon.createStubInstance(StateMapper)
      testElement.testMapper.getStatePath.returns(document.location.hash)

      // when
      testElement.onResourceUrlChanged('http://notified/url')

      // then
      expect(testElement.testMapper.getStatePath).to.be.calledOnceWith('http://notified/url')
    })
  })
})
