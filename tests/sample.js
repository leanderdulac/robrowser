module.exports = (browser, next) => {
  browser.title( (err, title) => {
    console.log("Title for the page: "+title)
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
