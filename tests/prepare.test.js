const test = require('ava')
const {
  spy,
} = require('sinon')
const {
  prepare,
  prepareBrowsers,
  loadTest,
  loadFile,
  getFilePath,
  addLocalParam,
} = require('./../src/prepare.js')

const browser = {
  test: './tests/function.js',
}

const browserLocal = {
  test: './tests/function.js',
  local: true,
}

const browsers = [
  browser,
  browser,
]

const config = {
  isLocal: true,
  browsers,
}

test('should return path', (t) => {
  const path = getFilePath('test1/')('./test2')

  t.is(path, 'test1/test2')
})

test('should load a file', (t) => {
  const stringFile = loadFile(browser)

  t.is(typeof stringFile, 'function')
})

test('should convert test path in function', (t) => {
  const browserWithTest = loadTest(browser)

  t.is(typeof browserWithTest.test, 'function')
  t.is(browserWithTest.test(), 1)
})

test('should add local param', (t) => {
  const newBrowser = addLocalParam(browserLocal)

  t.is(typeof newBrowser, 'object')
  t.is(newBrowser['browserstack.local'], true)
})

test('should not add local param', (t) => {
  const newBrowser = addLocalParam(browser)

  t.is(typeof newBrowser, 'object')
  t.is(newBrowser['browserstack.local'], undefined)
})

test('should convert all tests path in function', (t) => {
  const browsersWithTests = prepareBrowsers({ browsers })
  const [test1, test2] = browsersWithTests.browsers

  t.is(typeof test1.test, 'function')
  t.is(test1.test(), 1)
  t.is(typeof test2.test, 'function')
  t.is(test2.test(), 1)
})

test('should prepare configs', (t) => {
  const runner = spy()
  prepare(config, runner)
  const runnerParams = runner.getCall(0).args[0]

  t.is(typeof runnerParams, 'object')
  t.is(runnerParams.browsers.length, 2)
  t.is(runnerParams.isLocal, true)
})
