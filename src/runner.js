const async = require('async')
const browse = require('./browse')

function launchTest(opt, cb) {
  browse(opt.url, opt.desired, opt.remoteCfg, (err, browser) => {
    opt.exec(browser, (errExec) => {
      const context = {
        url: opt.url,
        browser: opt.desired,
      }

      browser.quit(() => cb(errExec, context))
    })
  })
}

module.exports = function seleniumRunner(opt, tests, testCb, endCb) {

  const queue = async.queue(launchTest, opt.concurrency)
  const launchTestsForDesiredBrowser = (desired, cb) => {
    tests.forEach((test) => {
      const task = {
        url: test.url,
        desired,
        remoteCfg: opt.remoteCfg,
        exec: test.exec,
      }
      queue.push(task, testCb)
    })
    queue.drain = cb
  }

  async.forEach(opt.browsers, launchTestsForDesiredBrowser, endCb)
}
