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

const createFolderPathFromDesktop = pipe(
  props([
    'os',
    'os_version',
    'browserName',
    'browser_version',
  ]),
  join('/')
)

const createFolderPathFromMobile = pipe(
  props([
    'browserName',
    'device',
    'os_version',
  ]),
  join('/')
)

const getPathGenerator = ifElse(
  prop('device'),
  always(createFolderPathFromMobile),
  always(createFolderPathFromDesktop)
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

const makeScreenshot = (
  {
    browser,
    screenshot,
  },
  navigator
) => (fileName) => {
  const generatorPath = getPathGenerator(browser)
  const folderPath = generatorPath(browser)
  const screenshotFolder = getScreenshotFolder(screenshot)
  const absPath = joinPaths([
    rootPath,
    screenshotFolder,
    folderPath,
    fileName,
  ])

  createPath(absPath)

  return navigator
    .takeScreenshot()
    .then((data) => {
      writeFile(
        absPath,
        data.replace(/^data:image\/png;base64,/, ''),
        'base64',
        (err) => {
          if (err) throw err
        }
      )
    })
}

module.exports = {
  makeScreenshot,
  getPathGenerator,
  createFolderPathFromDesktop,
  createFolderPathFromMobile,
  getScreenshotFolder,
  joinPaths,
  deleteScreenshotFolder,
}
