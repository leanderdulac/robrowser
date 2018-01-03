module.exports = (browser, next) => {
  browser
    .maximize()
    .waitForElementByName('q', 5000)
    .elementByName('q')
    .sendKeys('BrowserStack')
    .waitForElementByClassName('lsb', 5000)
    .elementByClassName('lsb')
    .click()
    .saveScreenshot('google_search.png')
    .fin(next)
    .done()
}
