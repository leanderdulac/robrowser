/* eslint no-use-before-define: "warn" */
const {
  normalize,
  parse,
  sep,
  join,
} = require('path')
const {
  existsSync,
  mkdirSync,
  readdirSync,
  rmdirSync,
  lstatSync,
  unlinkSync,
} = require('fs')
const {
  reduce,
  prop,
  pipe,
  forEach,
  ifElse,
  curry,
} = require('ramda')
const { rootPath } = require('get-root-path')

const parsePath = pipe(
  normalize,
  parse
)

const joinRootPath = curry((path, dir) => join(path, dir))(rootPath)

const createFolder = (absPath, folder) => {
  const newPath = join(absPath, folder)

  if (!existsSync(newPath)) {
    mkdirSync(newPath)
  }

  return newPath
}

const createFolders = absPath =>
  reduce(
    createFolder,
    absPath
  )

const createPath = (location) => {
  const parsedPath = parsePath(location)
  const absPath = prop('root', parsedPath)
  const folders = parsedPath.dir.split(sep)
  const createAll = createFolders(absPath)
  createAll(folders)
}

const isDirectory = curPath => lstatSync(curPath).isDirectory()

const deleteFileOrFolder = folderPath => file =>
  ifElse(
    isDirectory,
    deletePath,
    unlinkSync
  )(`${folderPath}/${file}`)

const deletePath = (path) => {
  if (existsSync(path)) {
    const files = readdirSync(path)
    const deleteAll = deleteFileOrFolder(path)

    forEach(deleteAll, files)
    rmdirSync(path)
  }
}

module.exports = {
  parsePath,
  createFolder,
  createFolders,
  createPath,
  isDirectory,
  deleteFileOrFolder,
  deletePath,
  joinRootPath,
}
