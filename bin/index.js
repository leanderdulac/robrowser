#!/usr/bin/env node
/* eslint-disable */
var path = require('path');
var fs = require('fs');
var { rootPath } = require('get-root-path');
var automated = require('./../dist/index.js');

function loadJSON (filePath) {
  var data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

function hasLocal (args) {
  const local = args.find(function (argument) {
    return argument === '--local';
  })

  return local ? true : false
}

var configsPath = path.join(rootPath, './.browserstack');
var config = loadJSON(configsPath);
var args = process.argv.slice(2);
var isLocal = hasLocal(args);

automated(
  config,
  isLocal,
)
