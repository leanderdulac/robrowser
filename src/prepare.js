/* eslint no-eval: "warn" */
/* eslint no-plusplus: "warn" */
const {
  map,
  merge,
  prop,
  pipe,
  objOf,
  toString,
  ifElse,
  has,
  always,
} = require('ramda')
const path = require('path')
const { readFileSync } = require('fs')
const { joinRootPath } = require('./helper/dir')
require('./performance/keepAlive')
const { runner } = require('./runner')

const getFilePath =
  absolutePath =>
    testPath =>
      path.join(absolutePath, testPath)

const loadFile = pipe(
  prop('test'),
  joinRootPath,
  readFileSync,
  toString
)

const stringToFunction = string => eval(string)

const loadTest = browser => pipe(
  loadFile,
  stringToFunction,
  objOf('test'),
  merge(browser)
)(browser)

const loadTestsFiles = pipe(
  prop('browsers'),
  map(loadTest),
  objOf('browsers')
)

const applyIsLocal = pipe(
  prop('browsers'),
  map(merge({
    'browserstack.local': true,
  })),
  objOf('browsers')
)

const isLocal = ifElse(
  has('isLocal'),
  always(pipe(
    loadTestsFiles,
    applyIsLocal
  )),
  always(loadTestsFiles)
)

const prepare = (configs, run = runner) => {
  const prepareTests = isLocal(configs)
  const tests = prepareTests(configs)
  const configsWithLoadedTests = merge(configs, tests)
  run(configsWithLoadedTests)
}

module.exports = {
  prepare,
  isLocal,
  applyIsLocal,
  loadTestsFiles,
  loadTest,
  loadFile,
  stringToFunction,
  getFilePath,
}
