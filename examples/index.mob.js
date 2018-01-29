module.exports = (wd, init, next, catchError) => {
  const browser = init('mobile-test')

  browser
    .waitForElementByName('q', 5000)
    .sendKeys('BrowserStack')
    .waitForElementByName('btnG', 5000)
    .click()
    .saveScreenshot('google_search.png')
    .catch(catchError)
    .fin(() => browser.quit(next))
    .done()
}
