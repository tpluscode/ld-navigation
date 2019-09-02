import { expect } from '@open-wc/testing'
import { LdNavigationOptions } from '../src/lib/LdNavigationOptions'

describe('LdNavigationOptions', () => {
  describe('.base', () => {
    it('strips trailing slash', () => {
      // given
      const options = new LdNavigationOptions({
        baseUrl: 'http://example.com/app/',
      })

      // then
      expect(options.baseUrl).to.equal('http://example.com/app')
    })
  })
})
