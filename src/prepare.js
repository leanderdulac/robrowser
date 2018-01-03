/* eslint-disable global-require, import/no-dynamic-require */
const {
  map,
  merge,
  prop,
  pipe,
  objOf,
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

const loadTestsFiles = pipe(
  prop('browsers'),
  map(loadTest),
  objOf('browsers')
)

const prepare = (configs, run = runner) => {
  const tests = loadTestsFiles(configs)

  const configsWithLoadedTests = merge(configs, tests)
  run(configsWithLoadedTests)
}

module.exports = {
  prepare,
  loadTestsFiles,
  loadTest,
  loadFile,
  getFilePath,
}
