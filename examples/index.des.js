module.exports = (wd, init, next, catchError) => {
  wd.addPromiseChainMethod(
    'writeSearch',
    function elementByNameWhenReady () {
      return this
        .waitForElementByName('q', 5000)
        .sendKeys('BrowserStack')
    }
  )

  wd.addPromiseChainMethod(
    'clickSearch',
    function clickSearch () {
      return this
        .waitForElementByClassName('lsb', 5000)
        .click()
    }
  )

  const browser = init()

  browser
    .maximize()
    .writeSearch()
    .clickSearch()
    .saveScreenshot('google_search.png')
    .catch(catchError)
    .fin(() => browser.quit(next))
    .done()
}
