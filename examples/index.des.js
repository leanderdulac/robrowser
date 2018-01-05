module.exports = (browser, next, catchError) => {
  browser
    .maximize()
    .waitForElementByName('q', 5000)
    .sendKeys('BrowserStack')
    .waitForElementByClassName('lsb', 5000)
    .click()
    .saveScreenshot('google_search.png')
    .catch(catchError)
    .fin(next)
    .done()
}
