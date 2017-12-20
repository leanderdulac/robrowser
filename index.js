const automated = require('./dist')
const config = require('./config.json')

const test = module.exports = (browser, next) => {
  browser.title((err, title) => {
    console.log(`Title for the page: ${title}`)
    browser.elementByName('q', (err, el) => {
      el.sendKeys('BrowserStack', () => {
        browser.elementByName('btnG', (err, el) => {
          el.click(() => {
            next(null)
          })
        })
      })
    })
  })
}

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
