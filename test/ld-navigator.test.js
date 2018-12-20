/* global describe, it */
/* eslint-disable no-unused-expressions */
import { expect } from '@open-wc/testing'
import '../src/ld-navigator'
import Helpers from '../NavigationHelper'
import eventToPromise from './eventToPromise'
import navigatorFixture from './ld-navigator.fixture'

describe('<ld-navigator>', () => {
  it('doesn\'t set attribute when setting base URL property', async () => {
    const ldNavigator = await navigatorFixture()

    ldNavigator.base = 'http://example.org/'

    expect(ldNavigator.getAttribute('base')).to.be.null
  })

  it('should change resource url when ld-navigation occurs', async () => {
    const ldNavigator = await navigatorFixture()
    const forChangeEvent = eventToPromise(ldNavigator, 'resource-url-changed')

    Helpers.fireNavigation(document, 'http://example.org/current/resource')
    const e = await forChangeEvent

    expect(e.detail.value).to.equal('http://example.org/current/resource')
  })

  it('should not change resource url when it is same as current', async () => {
    let handled
    const ldNavigator = await navigatorFixture()
    Helpers.fireNavigation(document, 'http://example.org/current/resource')

    ldNavigator.addEventListener('resource-url-changed', function (e) {
      handled = true
    })

    Helpers.fireNavigation(document, 'http://example.org/current/resource')

    return new Promise((resolve, reject) => {
      window.setTimeout(
        () => handled ? reject(new Error('resource-url-changed event should not have happened')) : resolve(),
        200)
    })
  })

  it('has resource URL set to relative document path', async () => {
    const ldNavigator = await navigatorFixture()

    window.history.pushState({}, '', '/test/ld-navigator-tests.html')

    expect(ldNavigator.resourceUrl).to.match(new RegExp('^/.*test/ld-navigator-tests.html'))
  })

  it('sets property when setting base attribute', async () => {
    const ldNavigator = await navigatorFixture({
      base: 'http://example.org'
    })

    expect(ldNavigator.base).to.equal('http://example.org')
  })

  it('sets property when setting client-base-path attribute', async () => {
    const ldNavigator = await navigatorFixture({
      clientBasePath: 'my/test'
    })

    expect(ldNavigator.clientBasePath).to.equal('my/test')
  })

  it('should remove trailing slash from base URL', async () => {
    const ldNavigator = await navigatorFixture({
      base: 'http://example.org/'
    })

    expect(ldNavigator.base).to.equal('http://example.org')
  })
})

describe('<ld-navigator base="http://example.com">', () => {
  it('has resource URL set to absolute document path', async () => {
    const ldNavigator = await navigatorFixture({
      base: 'http://example.com'
    })

    window.history.pushState({}, '', '/some/client/path/ld-navigator-tests.html')

    expect(ldNavigator.resourceUrl).to.equal('http://example.com/some/client/path/ld-navigator-tests.html')
  })
})

describe('<ld-navigator base="http://example.com" client-base-path="components/html5-history/test">', () => {
  it('has resource URL without base client path', async () => {
    const ldNavigator = await navigatorFixture({
      base: 'http://example.com',
      clientBasePath: 'components/html5-history/test'
    })

    window.history.pushState({}, '', '/components/html5-history/test/ld-navigator-tests.html')

    expect(ldNavigator.resourceUrl).to.equal('http://example.com/ld-navigator-tests.html')
  })
})
