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
} from 'ramda'

const parsePath = pipe(
  normalize,
  parse
)

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

const createPathSync = (location) => {
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
    deleteFolder,
    unlinkSync
  )(`${folderPath}/${file}`)

const deleteFolder = (path) => {
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
  createPathSync,
  isDirectory,
  deleteFileOrFolder,
  deleteFolder,
}
