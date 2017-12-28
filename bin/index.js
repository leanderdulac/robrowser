#!/usr/bin/env node

const { join } = require('path')
const { readFileSync } = require('fs')
const { rootPath } = require('get-root-path')
const {
  isEmpty,
  length,
  add,
} = require('ramda')
const automated = require('./../src/index.js')
const browserstack = require('browserstack-local')
const ora = require('ora')

const loadJSON = (filePath) => {
  const file = readFileSync(filePath)
  return JSON.parse(file)
}

const hasLocal = (args) => {
  const local = args.find(argument => (argument === '--local'))

  return isEmpty(local)
}

const plus1 = add(1)

let finishedTestsCount = 0
const browserstackLocal = new browserstack.Local()
const spinner = ora('Loading tests').start()
const configsPath = join(rootPath, './.browserstack')
const config = loadJSON(configsPath)
const { concurrency, browsers } = config
const args = process.argv.slice(2)
config.isLocal = hasLocal(args)
const countTests = length(browsers)
const getEndTestMessage = finishedTests =>
  `Completed ${finishedTests} of ${countTests} with currency ${concurrency}`
spinner.text = getEndTestMessage(finishedTestsCount)

const endTest = () => {
  finishedTestsCount = plus1(finishedTestsCount)
  spinner.text = getEndTestMessage(finishedTestsCount)
}

const endAllTests = () => {
  if (browserstackLocal.isRunning()) {
    spinner.text = 'Stop browserstack local binary'
    browserstackLocal.stop(() => {
      spinner.stop()
    })
  } else {
    spinner.stop()
  }
}

config.endTestCallback = endTest
config.endAllTestsCallback = endAllTests

if (config.isLocal) {
  spinner.text = 'Up Browserstack local binary'
  browserstackLocal.start({
    key: config.remote.pwd,
  }, () => {
    spinner.text = getEndTestMessage(finishedTestsCount)
    automated(config)
  })
} else {
  spinner.text = getEndTestMessage(finishedTestsCount)
  automated(config)
}
