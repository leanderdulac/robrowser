import test from 'ava'
import {
  spy,
} from 'sinon'
import {
  automated,
  specCredentials,
  prepareConfigs,
} from './../src/automated'

const user = 'Luke Skywalker'
const key = '4f0rça3st3j4c0mv0c³'
const credentials = {
  user,
  key,
}
const browserStackUserKey = 'browserstack.user'
const browserStackKeyName = 'browserstack.key'
const browsers = [
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
]

test('should replace credentials keys', (t) => {
  const config = {
    credentials,
  }

  const newCredentials = specCredentials(config)

  t.deepEqual(newCredentials[browserStackUserKey], user)
  t.deepEqual(newCredentials[browserStackKeyName], key)
})

test('should prepare config', (t) => {
  const config = {
    browsers,
  }

  const newConfig = prepareConfigs(config, credentials)

  const [firstBrowser, secondBrowser] = newConfig.browsers
  t.deepEqual(firstBrowser.user, user)
  t.deepEqual(firstBrowser.key, key)
  t.deepEqual(secondBrowser.user, user)
  t.deepEqual(secondBrowser.key, key)
})

test('should call runner with expected parameters', (t) => {
  const config = {
    remote: {
      host: 'hub.browserstack.com',
      port: 80,
    },
    credentials,
    browsers,
    concurrency: 2,
  }

  const runner = spy()

  automated(config, true, runner)

  t.is(runner.calledOnce, true)
})
