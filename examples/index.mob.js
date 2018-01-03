module.exports = (browser, next) => {
  browser
    .waitForElementByName('q', 5000)
    .elementByName('q')
    .sendKeys('BrowserStack')
    .waitForElementByName('btnG', 5000)
    .elementByName('btnG')
    .click()
    .saveScreenshot('google_search.png')
    .fin(next)
    .done()
}
