/* eslint no-param-reassign: "warn" */
import async from 'async'
import wd from 'wd'
import {
  deleteScreenshotFolder,
  makeScreenshot,
} from './Screenshot'

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

<<<<<<< HEAD
  // wd.webdriver.prototype.saveScreenshot = 
=======
  navigator.saveScreenshot = makeScreenshot(
    {
      browser,
      screenshot,
    },
    navigator
  )
>>>>>>> 4e479f6... screenshot: add screenshot method

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

export {
  worker,
  browsersIteratorGenerator,
}

export default runner
