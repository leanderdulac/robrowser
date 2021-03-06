module.exports = {
  remote: {
    host: 'hub.browserstack.com',
    port: 80,
    user: 'YOUR_USERNAME_HERE',
    pwd: 'YOUR_ACCESS_KEY_HERE',
  },
  screenshot: {
    folder: './screenshots',
  },
  browsers: [
    {
      os: 'windows',
      os_version: '7',
      browserName: 'chrome',
      browser_version: '55',
      resolution: '1920x1080',
      url: 'http://google.com',
      test: './examples/index.des.js',
    },
    {
      browserName: 'android',
      device: 'Google Nexus 9',
      realMobile: true,
      os_version: '5.1',
      deviceOrientation: 'portrait',
      url: 'http://google.com',
      test: './examples/index.mob.js',
    },
  ],
  concurrency: 2,
}
