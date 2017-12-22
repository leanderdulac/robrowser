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
  {
    remote,
    isLocal,
    endTestCallback,
  },
  queue
) => (browser) => {
  const task = {
    browser,
    remote,
    isLocal,
  }
  queue.push(task, endTestCallback)
}

const runner = (config) => {
  const {
    browsers,
    concurrency,
    endAllTestsCallback,
  } = config
  const queue = async.queue(worker, concurrency)
  queue.drain = endAllTestsCallback
  const iterator = browsersIteratorGenerator(
    config,
    queue
  )

  async.forEach(browsers, iterator)
}

export {
  worker,
  browsersIteratorGenerator,
}

export default runner
