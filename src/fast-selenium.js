import {
  set,
  lensProp,
  ifElse,
  propEq,
  and,
} from 'ramda'
import http from 'http'
import https from 'https'

const keepAliveTimeout = 30 * 1000

const generateAgent = () => new http.Agent({
  keepAlive: true,
  keepAliveMsecs: keepAliveTimeout,
})

const generateSecureAgent = () => new https.Agent({
  keepAlive: true,
  keepAliveMsecs: keepAliveTimeout,
})

const generateHttpRequest = () => http.request
const generateHttpsRequest = () => https.request
const isHttps = propEq('protocal', 'https:')
const getAgent = ifElse(
  isHttps,
  generateAgent,
  generateSecureAgent
)
const getRequest = ifElse(
  isHttps,
  generateHttpsRequest,
  generateHttpRequest
)
const hasAgentAndKeepAlive = ({ globalAgent }) => and(
  globalAgent,
  Object.prototype.hasOwnProperty.call(globalAgent, 'keepAlive')
)

if (hasAgentAndKeepAlive(http)) {
  http.globalAgent.keepAlive = true
  https.globalAgent.keepAlive = true
  http.globalAgent.keepAliveMsecs = keepAliveTimeout
  https.globalAgent.keepAliveMsecs = keepAliveTimeout
} else {
  const setAgent = (options, agent) => set(lensProp('agent'), agent, options)

  http.request = (options, callback) => {
    const agent = getAgent(options)
    const request = getRequest(options)
    const newOptions = setAgent(options, agent)
    return request(newOptions, callback)
  }
}
