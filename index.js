module.exports = (browser, callback) => {
  browser
    .waitForElementById('simple', 5000)
    .click()
    .waitForElementById('pay', 5000)
    .click()
    .fin(callback)
    .done()
}
