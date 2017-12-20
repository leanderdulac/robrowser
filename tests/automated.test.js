import test from 'ava'
import {
  spy,
} from 'sinon'
import {
  specCredentials,
  addCredentialsEachBrowser,
  automated,
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
  },
  {
    os: 'windows',
    os_version: 7,
    browserName: 'firefox',
    browser_version: 38,
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

test('should add credentials each browser', (t) => {
  const config = {
    browsers,
  }

  const newConfig = addCredentialsEachBrowser(config, credentials)

  const [firstBrowser, secondBrowser] = newConfig.browsers
  t.deepEqual(firstBrowser.user, user)
  t.deepEqual(firstBrowser.key, key)
  t.deepEqual(secondBrowser.user, user)
  t.deepEqual(secondBrowser.key, key)
})

test('should call runner with expected parameters', (t) => {
  const config = {
    remoteCfg: {
      host: 'hub.browserstack.com',
      port: 80,
    },
    credentials,
    browsers,
    concurrency: 2,
  }
  const tests = [
    {
      url: 'http://www.google.com',
      exec: test,
    },
  ]

  const testCallback = spy()
  const finishTestsCallback = spy()
  const runner = spy()

  automated(tests, config, testCallback, finishTestsCallback, runner)

  t.is(runner.calledOnce, true)
})
