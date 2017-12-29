const test = require('ava')
const { rootPath } = require('get-root-path')
const { join } = require('path')
const {
  existsSync,
  mkdirSync,
  writeFileSync,
} = require('fs')
const {
  createFolderPath,
  joinPaths,
  getScreenshotFolder,
  deleteScreenshotFolder,
} = require('../src/screenshot')

const browser = {
  os: 'windows',
  os_version: 7,
  browserName: 'chrome',
  browser_version: 55,
  url: 'http://localhost:3000',
  test: './index.js',
}

test('should create a folder path', (t) => {
  const path = createFolderPath(browser)

  t.is(path, 'windows/7/chrome/55')
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
