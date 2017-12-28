# RoBrowser | [![GitHub license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/pagarme/robrowser/blob/master/LICENSE) [![Travis CI Status](https://travis-ci.org/pagarme/robrowser.svg?branch=master)](https://travis-ci.org/pagarme/robrowser)
> Automate your browser testing now! 🤖

RoBrowser is a bot to help you test your project in many different browsers and operating systems.

It started as a automation for [Browser Stack](https://www.browserstack.com) and its goal is to help you validate how your project look in many different environments by taking screenshots for you.

[Saucelabs](https://saucelabs.com/) is also currently accepted and if you would like to see other cross-browser tester running open an issue or a pull-request so we can check it! 

## Testing and linting

We use [ava](https://github.com/avajs/ava) to run tests under the `./tests/` folder, you can execute it with:

```sh
yarn test
# or
npm test
```

Our [lint file](.eslintrc) extends [Pagar.me's JavaScript Style Guide](https://github.com/pagarme/javascript-style-guide) and you can execute it with:

```sh
yarn lint
# or
npm run lint
```

## License

This project is licensed under [MIT License](./LICENSE)