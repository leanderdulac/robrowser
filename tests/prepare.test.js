const test = require('ava')
const {
  spy,
} = require('sinon')
const getMyLocalIp = require('my-local-ip')
const {
  prepare,
  prepareBrowsers,
  loadTest,
  loadFile,
  getFilePath,
  addLocalParam,
  replaceIpFromIos,
  getPort,
  getProtocol,
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

test('should get port form url', (t) => {
  const url = 'http://localhost:3000'

  const port = getPort(url)

  t.is(typeof port, 'string')
  t.is(port, ':3000')
})

test('should get Protocol form url', (t) => {
  const urlHttp = 'http://localhost:3000'
  const urlHttps = 'https://localhost:3000'

  const protocolHttp = getProtocol(urlHttp)
  const protocolHttps = getProtocol(urlHttps)

  t.is(typeof protocolHttp, 'string')
  t.is(typeof protocolHttps, 'string')
  t.is(protocolHttp, 'http')
  t.is(protocolHttps, 'https')
})

test('should replace url to local ip', (t) => {
  const localIosBrowser = {
    browserName: 'iPhone',
    url: 'http://localhost:3000',
    local: true,
  }

  const localIp = getMyLocalIp()
  const browserReplaced = replaceIpFromIos(localIosBrowser)

  t.is(typeof browserReplaced, 'object')
  t.is(browserReplaced.url, `http://${localIp}:3000`)
})

test('should not replace url', (t) => {
  const localAndroidBrowser = {
    browserName: 'android',
    url: 'http://localhost:3000',
    local: true,
  }

  const browserReplaced = replaceIpFromIos(localAndroidBrowser)

  t.is(typeof browserReplaced, 'object')
  t.is(browserReplaced.url, 'http://localhost:3000')
})
