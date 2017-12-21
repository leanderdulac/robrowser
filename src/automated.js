/* eslint no-eval: "warn" */
/* eslint no-plusplus: "warn" */
import {
  map,
  merge,
  prop,
  pipe,
  objOf,
} from 'ramda'
import path from 'path'
import fs from 'fs'
import browserstack from 'browserstack-local'
import { rootPath } from 'get-root-path'
import ora from 'ora'
import './fast-selenium'
import runner from './runner'

const loadTests = (browser) => {
  const { test } = browser
  const testPath = path.join(rootPath, test)
  const testFunc = fs.readFileSync(testPath)

  return Object.assign(browser, { test: eval(testFunc.toString()) })
}

const prepareConfigs = configs => pipe(
  prop('browsers'),
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
  const newConfigs = prepareConfigs(configs)
  const browserstackLocal = new browserstack.Local()

  const endTest = () => {
    spinner.text = `Completed ${testFinished++} of ${testTotalCount} with concurrency ${concurrency}`
  }

  const endAllTests = () => {
    if (browserstackLocal.isRunning()) {
      browserstackLocal.stop()
    }
    spinner.stop()
  }

  if (isLocal) {
    spinner.text = 'Up Browserstack local binary'
    browserstackLocal.start({
      key: configs.remote.pwd,
    }, () => {
      endTest()
      run(
        merge(newConfigs, { isLocal }),
        endTest,
        endAllTests
      )
    })
  } else {
    endTest()

    run(
      newConfigs,
      endTest,
      endAllTests
    )
  }
}

export {
  automated,
  prepareConfigs,
}

export default automated
