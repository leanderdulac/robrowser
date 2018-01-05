const test = require('ava')
const { rootPath } = require('get-root-path')
const { join } = require('path')
const {
  existsSync,
  mkdirSync,
  writeFileSync,
} = require('fs')
const {
  createFolderPathFromDesktop,
  joinPaths,
  getScreenshotFolder,
  deleteScreenshotFolder,
  createFolderPathFromMobile,
} = require('../src/screenshot')

const browser = {
  os: 'windows',
  os_version: 7,
  browserName: 'chrome',
  browser_version: 55,
  url: 'http://localhost:3000',
  test: './index.js',
}

const browserMobile = {
  browserName: 'android',
  device: 'Google Nexus 9',
  os_version: 5.1,
  url: 'http://localhost:3000',
  test: './index.js',
}

test('should create a folder path from desktop', (t) => {
  const path = createFolderPathFromDesktop(browser)

  t.is(path, 'windows/7/chrome/55')
})

test('should create a folder path from mobile', (t) => {
  const path = createFolderPathFromMobile(browserMobile)

  t.is(path, 'android/Google Nexus 9/5.1')
})

test('should join multiple paths', (t) => {
  const paths = [
    rootPath,
    'screenshots',
    'windows/7/chrome/55',
    'screenshot.png',
  ]

  const absPath = joinPaths(paths)

  t.is(absPath, `${rootPath}/screenshots/windows/7/chrome/55/screenshot.png`)
})

test('should return screenshot path without screenshot object', (t) => {
  let screenshot

  const path = getScreenshotFolder(screenshot)

  t.is(path, './screenshots')
})

test('should delete screenshot folder', (t) => {
  const path = './screenshot'
  const screenshot = {
    folder: path,
  }
  const absPath = join(rootPath, path)
  const filePath = join(absPath, 'test.txt')

  mkdirSync(absPath)
  writeFileSync(filePath, 'Hey there!')

  t.is(existsSync(absPath), true)
  t.is(existsSync(filePath), true)

  deleteScreenshotFolder(screenshot)

  t.is(existsSync(absPath), false)
})
