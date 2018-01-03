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
} = require('ramda')
const path = require('path')

require('./performance/keepAlive')

const { joinRootPath } = require('./helper/dir')
const { runner } = require('./runner')

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
  propEq('local', true),
  merge({ 'browserstack.local': true }),
  identity
)

const prepareBrowsers = pipe(
  prop('browsers'),
  map(pipe(
    loadTest,
    addLocalParam
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
}
