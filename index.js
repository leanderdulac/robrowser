#!/usr/bin/env node

const { join } = require('path')
const { readFileSync } = require('fs')
const { rootPath } = require('get-root-path')
const {
  length,
  inc,
} = require('ramda')

const meow = require('meow')
const updateNotifier = require('update-notifier')

const { prepare: automated } = require('./src/index.js')

const ora = require('ora')

const loadJSON = (filePath) => {
  const file = readFileSync(filePath)
  return JSON.parse(file)
}

let finishedTestsCount = 0

const spinner = ora('Initating tests\n').start()

const getEndTestMessage = (finishedTests, total, finalConcurrency) =>
  `Completed ${finishedTests} of ${total} with concurrency ${finalConcurrency}`

const endTest = (total, finalConcurrency) => {
  finishedTestsCount = inc(finishedTestsCount)
  spinner.text = getEndTestMessage(finishedTestsCount, total, finalConcurrency)
}

const endAllTests = () => {
  spinner.stop()
}

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
  const countTests = length(browsers)

  config.endTestCallback = endTest.bind(null, countTests, concurrency)
  config.endAllTestsCallback = endAllTests

  spinner.text = getEndTestMessage(finishedTestsCount, countTests, concurrency)
  automated(config)
}

updateNotifier({ pkg: cli.pkg }).notify()
run()
