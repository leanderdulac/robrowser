/* eslint no-use-before-define: "warn" */
import {
  normalize,
  parse,
  sep,
  join,
} from 'path'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  rmdirSync,
  lstatSync,
  unlinkSync,
} from 'fs'
import {
  reduce,
  prop,
  pipe,
  forEach,
  ifElse,
  curry,
} from 'ramda'
import { rootPath } from 'get-root-path'

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

export default {
  parsePath,
  createFolder,
  createFolders,
  createPath,
  isDirectory,
  deleteFileOrFolder,
  deletePath,
  joinRootPath,
}
