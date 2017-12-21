import test from 'ava'
import {
  spy,
} from 'sinon'
import {
  automated,
  prepareConfigs,
} from './../src/automated'

test('should prepare config', (t) => {
  const config = {
    browsers: [
      {
        os: 'windows',
        os_version: 7,
        browserName: 'chrome',
        browser_version: 55,
        url: 'http://www.google.com',
        test: './index.js',
      },
      {
        os: 'windows',
        os_version: 10,
        browserName: 'chrome',
        browser_version: 45,
        url: 'http://www.google.com',
        test: './index.js',
      },
    ],
  }

  const newConfig = prepareConfigs(config)

  const [firstBrowser, secondBrowser] = newConfig.browsers

  t.is(typeof firstBrowser.test, 'function')
  t.is(typeof secondBrowser.test, 'function')
})

test('should call runner with expected parameters', (t) => {
  const config = {
    remote: {
      host: 'hub.browserstack.com',
      port: 80,
    },
    browsers: [
      {
        os: 'windows',
        os_version: 7,
        browserName: 'chrome',
        browser_version: 55,
        url: 'http://www.google.com',
        test: './index.js',
      },
      {
        os: 'windows',
        os_version: 10,
        browserName: 'chrome',
        browser_version: 45,
        url: 'http://www.google.com',
        test: './index.js',
      },
    ],
    concurrency: 2,
  }

  const runner = spy()

  automated(config, false, runner)

  t.is(runner.calledOnce, true)
})
