import { expect } from '@open-wc/testing'
import { StateMapper } from '../src/StateMapper'

class FakeLocation extends URL implements Location {
  // eslint-disable-next-line
  get ancestorOrigins(): DOMStringList {
    throw new Error('Not implemented')
  }

  // eslint-disable-next-line
  assign(url: string): never {
    throw new Error('Not implemented')
  }

  // eslint-disable-next-line
  reload(forcedReload?: boolean): never {
    throw new Error('Not implemented')
  }

  // eslint-disable-next-line
  replace(url: string): never {
    throw new Error('Not implemented')
  }
}

describe('StateMapper', () => {
  describe('.resourceUrl', () => {
    beforeEach(() => {
      StateMapper.clientBasePath = ''
      StateMapper.useHashFragment = false
    })

    it('mapped entirely from hash fragment', async () => {
      // given
      const location = new FakeLocation('http://example.app/#/http://example.com/foo')
      const mapper = new StateMapper(location)
      StateMapper.useHashFragment = true

      // then
      expect(mapper.resourceUrl).to.equal('http://example.com/foo')
    })

    it('mapped entirely from path', async () => {
      // given
      const location = new FakeLocation('http://example.app/http://example.com/foo')
      const mapper = new StateMapper(location)

      // then
      expect(mapper.resourceUrl).to.equal('http://example.com/foo')
    })

    it('mapped onto base from hash part', async () => {
      // given
      const location = new FakeLocation('http://example.app/#/foo')
      const mapper = new StateMapper(location)
      StateMapper.useHashFragment = true
      mapper.base = 'http://example.com'

      // then
      expect(mapper.resourceUrl).to.equal('http://example.com/foo')
    })

    it('mapped onto base from path', async () => {
      // given
      const location = new FakeLocation('http://example.app/foo')
      const mapper = new StateMapper(location)
      mapper.base = 'http://example.com'

      // then
      expect(mapper.resourceUrl).to.equal('http://example.com/foo')
    })

    it('mapped onto base from path with client base path', async () => {
      // given
      const location = new FakeLocation('http://example.app/profile/foo')
      const mapper = new StateMapper(location)
      mapper.base = 'http://example.com'
      StateMapper.clientBasePath = 'profile'

      // then
      expect(mapper.resourceUrl).to.equal('http://example.com/foo')
    })

    it('mapped onto base from hash fragment with client base path', async () => {
      // given
      const location = new FakeLocation('http://example.app/profile#/foo')
      const mapper = new StateMapper(location)
      StateMapper.useHashFragment = true
      mapper.base = 'http://example.com'
      StateMapper.clientBasePath = 'profile'

      // then
      expect(mapper.resourceUrl).to.equal('http://example.com/foo')
    })
  })

  describe('.base', () => {
    it('strips trailing slash', () => {
      // given
      const location = new FakeLocation('http://example.app/profile#/foo')
      const mapper = new StateMapper(location)

      // when
      mapper.base = 'http://example.com/app/'

      // then
      expect(mapper.base).to.equal('http://example.com/app')
    })
  })

  describe('.getStateUrl', () => {
    beforeEach(() => {
      StateMapper.clientBasePath = ''
      StateMapper.useHashFragment = false
    })

    it('returns entire URI when without base', () => {
      // given
      const location = new FakeLocation('http://example.app/')
      const mapper = new StateMapper(location)

      // then
      const statePath = mapper.getStateUrl('http://example.com/foo')

      // then
      expect(statePath).to.be.equal('http://example.app/http://example.com/foo')
    })

    it('returns entire URI when base does not match', () => {
      // given
      const location = new FakeLocation('http://example.app/')
      const mapper = new StateMapper(location)
      mapper.base = 'http://example.org'

      // then
      const statePath = mapper.getStateUrl('http://example.com/foo')

      // then
      expect(statePath).to.be.equal('http://example.app/http://example.com/foo')
    })

    it('strips base', () => {
      // given
      const location = new FakeLocation('http://example.app/')
      const mapper = new StateMapper(location)
      mapper.base = 'http://example.com'

      // then
      const statePath = mapper.getStateUrl('http://example.com/foo')

      // then
      expect(statePath).to.be.equal('http://example.app/foo')
    })

    it('prepends client base', () => {
      // given
      const location = new FakeLocation('http://example.app/')
      const mapper = new StateMapper(location)
      mapper.base = 'http://example.com'
      StateMapper.clientBasePath = 'demo'

      // then
      const statePath = mapper.getStateUrl('http://example.com/foo')

      // then
      expect(statePath).to.be.equal('http://example.app/demo/foo')
    })

    it('ignores client base when using hash', () => {
      // given
      const location = new FakeLocation('http://example.app/demo')
      const mapper = new StateMapper(location)
      mapper.base = 'http://example.com'
      StateMapper.clientBasePath = 'demo'
      StateMapper.useHashFragment = true

      // then
      const statePath = mapper.getStateUrl('http://example.com/foo')

      // then
      expect(statePath).to.be.equal('http://example.app/demo#/foo')
    })
  })
})
