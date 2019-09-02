import { expect } from '@open-wc/testing'
import { StateMapper } from '../src/StateMapper'
import { LdNavigationOptions } from '../src/lib/LdNavigationOptions'

describe('StateMapper', () => {
  describe('.resourceUrl', () => {
    it('mapped entirely from hash fragment', async () => {
      // given
      const mapper = new StateMapper(
        new LdNavigationOptions({
          clientBasePath: '',
          useHashFragment: true,
        }),
      )

      // when
      const resourceUrl = mapper.getResourceUrl('http://example.app/#/http://example.com/foo')

      // then
      expect(resourceUrl).to.equal('http://example.com/foo')
    })

    it('mapped entirely from path', async () => {
      // given
      const mapper = new StateMapper(
        new LdNavigationOptions({
          clientBasePath: '',
        }),
      )

      // when
      const resourceUrl = mapper.getResourceUrl('http://example.app/http://example.com/foo')

      // then
      expect(resourceUrl).to.equal('http://example.com/foo')
    })

    it('mapped onto base from hash part', async () => {
      // given
      const mapper = new StateMapper(
        new LdNavigationOptions({
          clientBasePath: '',
          useHashFragment: true,
          baseUrl: 'http://example.com',
        }),
      )

      // when
      const resourceUrl = mapper.getResourceUrl('http://example.app/#/foo')

      // then
      expect(resourceUrl).to.equal('http://example.com/foo')
    })

    it('mapped onto base from path', async () => {
      // given
      const mapper = new StateMapper(
        new LdNavigationOptions({
          clientBasePath: '',
          baseUrl: 'http://example.com',
        }),
      )

      // when
      const resourceUrl = mapper.getResourceUrl('http://example.app/foo')

      // then
      expect(resourceUrl).to.equal('http://example.com/foo')
    })

    it('mapped onto base from path with client base path', async () => {
      // given
      const mapper = new StateMapper(
        new LdNavigationOptions({
          clientBasePath: 'profile',
          baseUrl: 'http://example.com',
        }),
      )

      // when
      const resourceUrl = mapper.getResourceUrl('http://example.app/profile/foo')

      // then
      expect(resourceUrl).to.equal('http://example.com/foo')
    })

    it('mapped onto base from hash fragment with client base path', async () => {
      // given
      const mapper = new StateMapper(
        new LdNavigationOptions({
          clientBasePath: 'profile',
          useHashFragment: true,
          baseUrl: 'http://example.com',
        }),
      )

      // when
      const resourceUrl = mapper.getResourceUrl('http://example.app/profile#/foo')

      // then
      expect(resourceUrl).to.equal('http://example.com/foo')
    })
  })

  describe('.getStateUrl', () => {
    it('returns entire URI when without base', () => {
      // given
      const mapper = new StateMapper(new LdNavigationOptions())

      // then
      const statePath = mapper.getStateUrl('http://example.com/foo')

      // then
      expect(statePath).to.be.equal('/http://example.com/foo')
    })

    it('returns entire URI when base does not match', () => {
      // given
      const mapper = new StateMapper(
        new LdNavigationOptions({
          baseUrl: 'http://example.org',
        }),
      )

      // then
      const statePath = mapper.getStateUrl('http://example.com/foo')

      // then
      expect(statePath).to.be.equal('/http://example.com/foo')
    })

    it('strips base', () => {
      // given
      const mapper = new StateMapper(
        new LdNavigationOptions({
          baseUrl: 'http://example.com',
        }),
      )

      // then
      const statePath = mapper.getStateUrl('http://example.com/foo')

      // then
      expect(statePath).to.be.equal('/foo')
    })

    it('prepends client base', () => {
      // given
      const mapper = new StateMapper(
        new LdNavigationOptions({
          baseUrl: 'http://example.com',
          clientBasePath: 'demo',
        }),
      )

      // then
      const statePath = mapper.getStateUrl('http://example.com/foo')

      // then
      expect(statePath).to.be.equal('/demo/foo')
    })

    it('prepends client base when using hash', () => {
      // given
      const mapper = new StateMapper(
        new LdNavigationOptions({
          baseUrl: 'http://example.com',
          clientBasePath: 'demo',
          useHashFragment: true,
        }),
      )

      // then
      const statePath = mapper.getStateUrl('http://example.com/foo')

      // then
      expect(statePath).to.be.equal('/demo#/foo')
    })
  })
})
