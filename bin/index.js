#!/usr/bin/env node
/* eslint-disable */
var path = require('path');
var fs = require('fs');
var { rootPath } = require('get-root-path');
var automated = require('./../dist/index.js');
var browserstack = require('browserstack-local');
var ora = require('ora');

function loadJSON (filePath) {
  var data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

function hasLocal (args) {
  const local = args.find(function (argument) {
    return argument === '--local';
  });

  return local ? true : false;
}

var finishedTestsCount = 0
var browserstackLocal = new browserstack.Local()
var spinner = ora('Loading tests').start()
var configsPath = path.join(rootPath, './.browserstack');
var config = loadJSON(configsPath);
var args = process.argv.slice(2);
config.isLocal = hasLocal(args);
var countTests = config.browsers.length
spinner.text = getEndTestMessage(finishedTestsCount);

function getEndTestMessage(finishedTests) {
  return 'Completed '
    + finishedTests
    + ' of '
    + countTests
    + ' with concurrency '
    + config.concurrency;
}

function endTest () {
  spinner.text = getEndTestMessage(++finishedTestsCount);
}

function endAllTests () {
  if (browserstackLocal.isRunning()) {
    browserstackLocal.stop()
  }
  spinner.stop()
}

config.endTestCallback = endTest
config.endAllTestsCallback = endAllTests

if (config.isLocal) {
  spinner.text = 'Up Browserstack local binary';
  browserstackLocal.start({
    key: config.remote.pwd,
  }, function () {
    spinner.text = getEndTestMessage(finishedTestsCount);
    automated(config);
  })
} else {
  spinner.text = getEndTestMessage(finishedTestsCount);
  automated(config);
}
