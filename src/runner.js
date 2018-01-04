/* eslint no-param-reassign: "warn" */
const async = require('async')
const wd = require('wd')
const {
  ifElse,
  props,
  prop,
  always,
  join,
  pipe,
} = require('ramda')
const {
  deleteScreenshotFolder,
  makeScreenshot,
} = require('./screenshot')

const generateFromDesktop = pipe(
  props([
    'os',
    'os_version',
    'browserName',
    'browser_version',
  ]),
  join(' ')
)

const generateFromMobile = pipe(
  props([
    'browserName',
    'device',
    'os_version',
  ]),
  join(' ')
)

const getGeneratorConfig = ifElse(
  prop('device'),
  always(generateFromMobile),
  always(generateFromDesktop)
)

const errorMessage = '\nAn error occurred in the test'

const worker = (
  {
    browser,
    remote,
    screenshot,
  },
  callback
) => {
  const { url, test } = browser

  const navigator = wd.remote(remote, 'promiseChain')

  navigator.saveScreenshot = makeScreenshot(
    {
      browser,
      screenshot,
    },
    navigator
  )

  const promise = navigator.init(browser)
    .setAsyncScriptTimeout(30000)
    .get(url)

  const finish = () => navigator.quit(callback)
  const catchError = (err) => {
    const generateConfig = getGeneratorConfig(browser)
    const testConfigs = generateConfig(browser)

    console.log(`${errorMessage}: [${testConfigs}]: ${err}`)
  }

  test(promise, finish, catchError)
}

const browsersIteratorGenerator = (
  {
    endTestCallback,
    isLocal,
    remote,
    screenshot,
  },
  queue
) => (browser) => {
  const task = {
    browser,
    screenshot,
    remote,
    isLocal,
  }
  queue.push(task, endTestCallback)
}

const runner = (config) => {
  const {
    browsers,
    concurrency = 1,
    screenshot,
    endAllTestsCallback,
  } = config
  const queue = async.queue(worker, concurrency)
  queue.drain = endAllTestsCallback
  const iterator = browsersIteratorGenerator(
    config,
    queue
  )

  deleteScreenshotFolder(screenshot)

  async.forEach(browsers, iterator)
}

module.exports = {
  worker,
  browsersIteratorGenerator,
  runner,
}
