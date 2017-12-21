module.exports = (browser, callback) => {
  browser
    .waitForElementByName('q', 5000)
    .sendKeys('BrowserStack')
    .waitForElementByClassName('lsb', 5000)
    .click()
    .fin(callback)
    .done()
}
