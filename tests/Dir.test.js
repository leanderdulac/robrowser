import test from 'ava'
import { rootPath } from 'get-root-path'
import {
  existsSync,
  mkdirSync,
  writeFileSync,
} from 'fs'
import {
  parsePath,
  createFolder,
  createFolders,
  createPath,
  deletePath,
} from './../src/helper/Dir'

const folderPath = './tests/testfolder'
const absFolderPath = `${rootPath}/tests/testfolder`
const folders = [
  './tests',
  './testfolder',
]

test.afterEach(() => {
  if (existsSync(absFolderPath)) {
    deletePath(absFolderPath)
  }
})

test('should parse path', (t) => {
  const { root, base } = parsePath('./test/')

  t.is(root, '')
  t.is(base, 'test')
})

test('should create folder', (t) => {
  const pathOfNewFolder = createFolder(rootPath, folderPath)

  t.is(existsSync(absFolderPath), true)
  t.is(pathOfNewFolder, absFolderPath)
})

test('should create add folder', (t) => {
  const createAll = createFolders(rootPath)
  const pathOfNewFolder = createAll(folders)

  t.is(pathOfNewFolder, absFolderPath)
})

test('should create subfolder', (t) => {
  createPath(`${absFolderPath}/test.png`)

  t.is(existsSync(absFolderPath), true)
})

test('should remove folder with subfolder and files', (t) => {
  mkdirSync(absFolderPath)
  mkdirSync(`${absFolderPath}/testSubFolder`)
  writeFileSync(`${absFolderPath}/testSubFolder/test.txt`, 'Hey there!')

  deletePath(`${absFolderPath}`)

  t.is(existsSync(absFolderPath), false)
})
