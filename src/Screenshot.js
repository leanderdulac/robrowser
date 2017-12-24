import { writeFile } from 'fs'
import { rootPath } from 'get-root-path'
import {
  createPath,
  deletePath,
} from './helper/Dir'

const makeScreenshotFunction = (
  {
    screenshot,
    browser,
  },
  navigator
) => (fileName) => {
  return navigator.takeScreenshot()
    .then((data) => {
      writeFile(filename, data.replace(/^data:image\/png;base64,/, ''), 'base64', function (err) {
        if (err) throw err
      })
  })
}

export default makeScreenshotFunction
