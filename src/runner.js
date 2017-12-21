/* eslint no-param-reassign: ["error", { "props": false }] */
import async from 'async'
import connect from './connect'

const worker = (
  {
    browser,
    remote,
  },
  callback,
  openConnection = connect
) => {
  const { url, test } = browser

  openConnection(url, browser, remote, (err, navigator) => {
    test(navigator, () => {
      const context = {
        url,
        browser,
      }

      navigator.quit(() => callback(context))
    })
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
