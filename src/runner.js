/* eslint no-param-reassign: "warn" */
import async from 'async'
import wd from 'wd'

const worker = (
  {
    browser,
    remote,
  },
  callback
) => {
  const { url, test } = browser

  const navigator = wd.remote(remote, 'promiseChain')
  const promise = navigator.init(browser)
    .setAsyncScriptTimeout(30000)
    .get(url)

  test(promise, () => {
    navigator.quit(callback)
  })
}

const browsersIteratorGenerator = (
  { remote },
  queue,
  testCallback
) => (browser) => {
  const task = {
    browser,
    remote,
  }
  queue.push(task, testCallback)
}

const runner = (
  config,
  testCallback,
  endCallback,
  launchTest = worker,
  browsersIterator = browsersIteratorGenerator
) => {
  const { browsers, concurrency } = config
  const queue = async.queue(launchTest, concurrency)
  queue.drain = endCallback
  const iterator = browsersIterator(
    config,
    queue,
    testCallback
  )

  async.forEach(browsers, iterator)
}

export {
  worker,
  browsersIteratorGenerator,
}

export default runner
