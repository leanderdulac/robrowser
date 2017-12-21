/* eslint no-eval: "warn" */
/* eslint no-plusplus: "warn" */
import {
  map,
  merge,
  prop,
  pipe,
  applySpec,
  objOf,
  path,
} from 'ramda'
import nodePath from 'path'
import fs from 'fs'
import { rootPath } from 'get-root-path'
import ora from 'ora'
import './fast-selenium'
import runner from './runner'

const specCredentials = applySpec({
  'browserstack.user': path(['credentials', 'user']),
  'browserstack.key': path(['credentials', 'key']),
})

const loadTests = (browser) => {
  const { test } = browser
  const testPath = nodePath.join(rootPath, test)
  const testFunc = fs.readFileSync(testPath)

  return Object.assign(browser, { test: eval(testFunc.toString()) })
}

const prepareConfigs = (
  configs,
  credentials
) => pipe(
  prop('browsers'),
  map(merge(credentials)),
  map(loadTests),
  objOf('browsers'),
  merge(configs)
)(configs)

const automated = (configs, isLocal, run = runner) => {
  const { browsers, concurrency } = configs
  let testFinished = 0
  const spinner = ora('Loading tests').start()
  spinner.color = 'green'
  const testTotalCount = browsers.length
  const credentials = specCredentials(configs)
  const newConfigs = prepareConfigs(configs, credentials)

  const endTest = () => {
    spinner.text = `Completed ${testFinished++} of ${testTotalCount} with concurrency ${concurrency}`
  }

  const endAllTests = () => { spinner.stop() }

  endTest()

  run(
    newConfigs,
    endTest,
    endAllTests
  )
}

export {
  automated,
  prepareConfigs,
  specCredentials,
}

export default automated
