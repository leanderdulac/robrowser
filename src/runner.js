/* eslint no-param-reassign: "warn" */
const async = require('async')
const wd = require('wd')
const {
  deleteScreenshotFolder,
  makeScreenshot,
} = require('./screenshot')

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

  test(promise, () => {
    navigator.quit(callback)
  })
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
    concurrency,
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
