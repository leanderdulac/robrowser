#!/usr/bin/env node

const { join } = require('path')
const { readFileSync } = require('fs')
const { rootPath } = require('get-root-path')
const {
  length,
  inc,
} = require('ramda')
const { prepare: automated } = require('./src/index.js')

const ora = require('ora')

const loadJSON = (filePath) => {
  const file = readFileSync(filePath)
  return JSON.parse(file)
}

let finishedTestsCount = 0

const spinner = ora('Loading tests').start()
const configsPath = join(rootPath, './examples/.robrowser')
const config = loadJSON(configsPath)
const { concurrency, browsers } = config

const countTests = length(browsers)
const getEndTestMessage = finishedTests =>
  `Completed ${finishedTests} of ${countTests} with currency ${concurrency}`
spinner.text = getEndTestMessage(finishedTestsCount)

const endTest = () => {
  finishedTestsCount = inc(finishedTestsCount)
  spinner.text = getEndTestMessage(finishedTestsCount)
}

const endAllTests = () => {
  spinner.stop()
}

config.endTestCallback = endTest
config.endAllTestsCallback = endAllTests

spinner.text = getEndTestMessage(finishedTestsCount)
automated(config)
