import {
  map,
  merge,
  prop,
  pipe,
  applySpec,
  objOf,
  path,
  defaultTo,
} from 'ramda'
import './fast-selenium'
import runner from './runner'

const specCredentials = applySpec({
  'browserstack.user': path(['credentials', 'user']),
  'browserstack.key': path(['credentials', 'key']),
})

const addCredentialsEachBrowser = (config, credentials) => pipe(
  prop('browsers'),
  map(merge(credentials)),
  objOf('browsers'),
  merge(config)
)(config)

const endCall = () => {
  console.log('All tests ended')
}

const testCall = () => {
  console.log('A test finished')
}

const defaultEndCall = defaultTo(endCall)

const defaultTestCall = defaultTo(testCall)

const automated = (tests, config, testCallback, endCallback, run = runner) => {
  const credentials = specCredentials(config)
  const configWithCredentials = addCredentialsEachBrowser(config, credentials)
  run(
    configWithCredentials,
    tests,
    defaultTestCall(testCall),
    defaultEndCall(endCallback)
  )
}

export {
  automated,
  addCredentialsEachBrowser,
  specCredentials,
}

export default automated
