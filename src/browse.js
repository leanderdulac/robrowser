const wd = require('wd')
const async = require('async')

const wait4 = ms => wait.bind(null, ms)

const wait = (ms, cb) => setTimeout(cb, ms)

module.exports = (url, desired, remoteCfg, cb) => {
  if (typeof remoteCfg === 'function') {
    cb = remoteCfg
    remoteCfg = undefined
  }
  
  const browser = wd.remote(remoteCfg)

  async.series([
    browser.init.bind(browser, desired),
    wait4(100),
    browser.get.bind(browser, url),
    wait4(1000),
  ], (err) => {
    cb(err, browser)
  })
}
