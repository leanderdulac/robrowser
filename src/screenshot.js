const { writeFile } = require('fs')
const path = require('path')
const { rootPath } = require('get-root-path')
const {
  always,
  defaultTo,
  ifElse,
  join,
  pipe,
  prop,
  props,
  reduce,
} = require('ramda')
const {
  createPath,
  deletePath,
  joinRootPath,
} = require('./helper/dir')

const joinPath = path.join

const createDesktopPaths = pipe(
  props([
    'os',
    'os_version',
    'browserName',
    'browser_version',
  ]),
  join('/')
)

const createMobilePaths = pipe(
  props([
    'browserName',
    'device',
    'os_version',
  ]),
  join('/')
)

const createPathsName = ifElse(
  prop('device'),
  always(createMobilePaths),
  always(createDesktopPaths)
)

const joinPaths = reduce(
  joinPath,
  ''
)

const getScreenshotFolder = pipe(
  prop('folder'),
  defaultTo('./screenshots')
)

const deleteScreenshotFolder = pipe(
  getScreenshotFolder,
  joinRootPath,
  deletePath
)

const makeScreenshot = (config, navigator, testName) => (fileName) => {
  const { browser, screenshot } = config

  const createPaths = createPathsName(browser)
  const foldersPath = createPaths(browser)
  const screenshotFolder = getScreenshotFolder(screenshot)

  const absPath = joinPaths([
    rootPath,
    screenshotFolder,
    testName,
    foldersPath,
    fileName,
  ])

  createPath(absPath)

  const createFile = data =>
    writeFile(
      absPath,
      data.replace(/^data:image\/png;base64,/, ''),
      'base64',
      (err) => {
        if (err) throw err
      }
    )

  return navigator
    .takeScreenshot()
    .then(createFile)
}

module.exports = {
  makeScreenshot,
  createPathsName,
  createDesktopPaths,
  createMobilePaths,
  getScreenshotFolder,
  joinPaths,
  deleteScreenshotFolder,
}
