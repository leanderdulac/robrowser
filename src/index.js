require('./fast-selenium.js')
const runner = require('./runner.js')
const {
  map,
  merge,
  prop,
  pipe,
  applySpec,
  objOf,
  path,
  defaultTo,
} = require('ramda')

const specCredentials = applySpec({
  'browserstack.user': path(['credentials','user']),
  'browserstack.key': path(['credentials', 'key']),
})

const addCredentialsEachBrowser = (config, credentials) => pipe(
  prop('browsers'),
  map(merge(credentials)),
  objOf('browsers'),
  merge(config),
)(config)

const defaultEndCall = defaultTo(
  (err, context) => {
    console.log('All tests ended')
  }
)

const defaultTestCall = defaultTo(
  (err) => {
    console.log('A test finished')
  }
)

const automated = (tests, config, testCallback, endCallback) => {
  const credentials = specCredentials(config)
  const configWithCredentials = addCredentialsEachBrowser(config, credentials)
  runner(
    configWithCredentials,
    tests,
    defaultTestCall(testCallback),
    defaultEndCall(endCallback)
  )
}

module.exports = automated
