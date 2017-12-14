const automated = require('./src')
const test = require('./tests/sample.js')
const config = require('./config.json')

const tests = [
  {
    url: 'http://www.google.com',
    exec: test,
  },
]

const testCallback = (err, context) => {
  console.log('A test finished')
}

const endCallback = (err) => {
  console.log('All tests ended')
}

automated(tests, config, testCallback, endCallback)
