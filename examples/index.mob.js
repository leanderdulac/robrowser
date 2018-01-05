module.exports = (browser, next, catchError) => {
  browser
    .waitForElementByName('q', 5000)
    .sendKeys('BrowserStack')
    .waitForElementByName('btnG', 5000)
    .click()
    .saveScreenshot('google_search.png')
    .catch(catchError)
    .fin(next)
    .done()
}
