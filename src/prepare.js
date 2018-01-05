/* eslint-disable global-require, import/no-dynamic-require */
const {
  ifElse,
  map,
  merge,
  objOf,
  pipe,
  prop,
  propEq,
  identity,
  allPass,
} = require('ramda')
const path = require('path')
const getMyLocalIp = require('my-local-ip')
require('./performance/keepAlive')

const { joinRootPath } = require('./helper/dir')
const { runner } = require('./runner')

const isIos = propEq('browserName', 'iPhone')

const isLocal = propEq('local', true)

const getFilePath =
  absolutePath =>
    testPath =>
      path.join(absolutePath, testPath)

const loadFile = (browser) => {
  const test = joinRootPath(prop('test', browser))

  return require(test)
}

const loadTest = browser => pipe(
  loadFile,
  objOf('test'),
  merge(browser)
)(browser)

const addLocalParam = ifElse(
  isLocal,
  merge({ 'browserstack.local': true }),
  identity
)

const getPort = url => url.match(/:([0-9]+)/)[0] || ''
const getProtocol = url => url.match(/^[^:]+(?=:\/\/)/)[0] || ''

const replaceUrlFromLocalIp = (browser) => {
  const { url } = browser
  const localIp = getMyLocalIp()
  const port = getPort(url)
  const protocol = getProtocol(url)

  return merge(browser, {
    url: `${protocol}://${localIp}${port}`,
  })
}

const replaceIpFromIos = ifElse(
  allPass([
    isLocal,
    isIos,
  ]),
  replaceUrlFromLocalIp,
  identity
)

const prepareBrowsers = pipe(
  prop('browsers'),
  map(pipe(
    loadTest,
    addLocalParam,
    replaceIpFromIos
  )),
  objOf('browsers')
)

const prepare = (configs, run = runner) => {
  const tests = prepareBrowsers(configs)

  const configsWithLoadedTests = merge(configs, tests)
  run(configsWithLoadedTests)
}

module.exports = {
  prepare,
  prepareBrowsers,
  loadTest,
  loadFile,
  getFilePath,
  addLocalParam,
  isIos,
  getPort,
  replaceIpFromIos,
  replaceUrlFromLocalIp,
  getProtocol,
}
