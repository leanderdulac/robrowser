/* eslint-disable */

import { writeFile } from 'fs'
import { join as joinPath } from 'path'
import { rootPath } from 'get-root-path'
import {
  pipe,
  prop,
  props,
  join,
  reduce,
  defaultTo,
} from 'ramda'
import {
  createPath,
  deletePath,
  joinRootPath,
} from './helper/Dir'

const createFolderPath = pipe(
  props([
    'os',
    'os_version',
    'browserName',
    'browser_version',
  ]),
  join('/')
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
  const folderPath = createFolderPath(browser)
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

export {
  makeScreenshot,
  createFolderPath,
  getScreenshotFolder,
  joinPaths,
  deleteScreenshotFolder,
}
