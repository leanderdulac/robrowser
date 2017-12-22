/* eslint no-eval: "warn" */
/* eslint no-plusplus: "warn" */
import {
  map,
  merge,
  prop,
  pipe,
  objOf,
  toString,
  ifElse,
  has,
  always,
} from 'ramda'
import path from 'path'
import { readFileSync } from 'fs'
import { rootPath } from 'get-root-path'
import './performance/KeepAlive'
import runner from './Runner'

const getFilePath =
  absolutePath =>
    testPath =>
      path.join(absolutePath, testPath)

const loadFile = pipe(
  prop('test'),
  getFilePath(rootPath),
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

export {
  prepare,
  isLocal,
  applyIsLocal,
  loadTestsFiles,
  loadTest,
  loadFile,
  stringToFunction,
  getFilePath,
}
