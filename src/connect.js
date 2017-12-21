const wd = require('wd')
const async = require('async')

const wait = (ms, cb) => setTimeout(cb, ms)
const wait4 = ms => wait.bind(null, ms)
const isFunction = config => (typeof config === 'function')

module.exports = (url, desired, remoteConfig, cb) => {
  let config
  let callback

  if (isFunction(remoteConfig)) {
    callback = remoteConfig
    config = undefined
  } else {
    config = remoteConfig
    callback = cb
  }

  const browser = wd.remote(config)

  async.series([
    browser.init.bind(browser, desired),
    wait4(100),
    browser.get.bind(browser, url),
    wait4(1000),
  ], (err) => {
    callback(err, browser)
  })
}
