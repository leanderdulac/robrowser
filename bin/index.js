#!/usr/bin/env node

const { join } = require('path')
const { readFileSync } = require('fs')
const { rootPath } = require('get-root-path')
const browserstack = require('browserstack-local')
const {
  length,
  inc,
  find,
  propEq,
} = require('ramda')

const meow = require('meow')
const updateNotifier = require('update-notifier')
const ora = require('ora')

const { prepare: automated } = require('./../src/index.js')

const browserstackLocal = new browserstack.Local()

const loadJSON = (filePath) => {
  const file = readFileSync(filePath)
  return JSON.parse(file)
}

let finishedTestsCount = 0

const spinner = ora('Initating tests').start()

const getStatusMessage = (finishedTests, total, finalConcurrency) =>
  `Completed ${finishedTests} of ${total} with concurrency ${finalConcurrency}`

const callStatus = (total, finalConcurrency) => {
  finishedTestsCount = inc(finishedTestsCount)
  spinner.text = getStatusMessage(finishedTestsCount, total, finalConcurrency)
}

const endAllTests = () => {
  spinner.stop()
}

const stopingBrowserstackLocal = () => {
  spinner.text = 'Stop browserstack tunnel'
  browserstackLocal.stop(endAllTests)
}

const hasLocal = find(propEq('local', true))

const startBinaryAndRun = initialStatusMessage => (config) => {
  spinner.text = 'Up Browserstack tunnel'
  browserstackLocal.start({
    key: config.remote.pwd,
  }, () => {
    spinner.text = initialStatusMessage
    automated(config)
  })
}

const getEndAllTestsCallback = isLocal => (
  isLocal ?
    stopingBrowserstackLocal :
    endAllTests
)

const cli = meow(
  `
  Usage:
    $ robrowser start           Runs Robrowser from a config file
    $ robrowser example         Runs example config file to generate default results (will create a ./screenshot folder)
  Options:
    -h, --help                  Show help options
    -v, --version               Show version
`,
  {
    alias: {
      h: 'help',
      v: 'version',
    },
  }
)

// eslint-disable-next-line
const run = () => {
  const cmd = cli.input[0]

  if (cli.flags.v) {
    return cli.showVersion()
  }

  if (!cmd) {
    return cli.showHelp()
  }

  let robrowserConfigPath = './examples/.robrowser'

  if (cmd !== 'example') {
    robrowserConfigPath = './.robrowser'
  }

  const configsPath = join(rootPath, robrowserConfigPath)
  const config = loadJSON(configsPath)

  const { concurrency = 1, browsers } = config

  const isLocal = hasLocal(browsers)
  const countTests = length(browsers)

  config.endTestCallback = callStatus.bind(null, countTests, concurrency)
  config.endAllTestsCallback = getEndAllTestsCallback(isLocal)

  const statusMessage = getStatusMessage(
    finishedTestsCount,
    countTests,
    concurrency
  )

  const init = isLocal ? startBinaryAndRun(statusMessage) : automated

  spinner.text = statusMessage
  init(config)
}

updateNotifier({ pkg: cli.pkg }).notify()
run()
