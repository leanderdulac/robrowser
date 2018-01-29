/* eslint-disable no-console */
/* eslint-disable camelcase */

const async = require('async')
const wd = require('wd')
const chalk = require('chalk')
const { deleteScreenshotFolder, makeScreenshot } = require('./screenshot')

function worker (config, callback) {
  const { browser, remote, screenshot } = config

  const {
    device,
    os,
    browserName,
    browser_version,
    url,
    test,
  } = browser

  const init = () => {
    const navigator = wd.remote(remote, 'promiseChain')

    navigator.saveScreenshot = makeScreenshot(
      { browser, screenshot },
      navigator
    )

    return navigator.init(browser)
      .setAsyncScriptTimeout(30000)
      .get(url)
  }

  const catchError = (err) => {
    const error = chalk.bold.red
    const warn = chalk.bold.yellow

    const errorOn = warn(`
      ${device || os} - ${browserName} - ${browser_version}
    `)

    console.log('\n\n')
    console.log(error('Error:'), errorOn)
    console.log(error('Stack:'), err)
    console.log('\n\n')
  }

  test(wd, init, callback, catchError)
}

function browserIterator (config, queue) {
  const {
    isLocal,
    remote,
    screenshot,
    endTestCallback,
  } = config

  return (browser) => {
    const task = {
      browser,
      screenshot,
      remote,
      isLocal,
    }

    queue.push(task, endTestCallback)
  }
}

function runner (config) {
  const {
    browsers,
    concurrency = 1,
    screenshot,
    endAllTestsCallback,
  } = config

  const queue = async.queue(worker, concurrency)
  queue.drain = endAllTestsCallback

  const iterator = browserIterator(
    config,
    queue
  )

  deleteScreenshotFolder(screenshot)

  async.forEach(browsers, iterator)
}

module.exports = {
  runner,
  worker,
  browserIterator,
}
