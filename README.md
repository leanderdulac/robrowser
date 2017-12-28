# Robrowser | [![GitHub license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/pagarme/robrowser/blob/master/LICENSE) [![Travis CI Status](https://travis-ci.org/pagarme/robrowser.svg?branch=master)](https://travis-ci.org/pagarme/robrowser)
> Automate your browser testing now! 🤖

Robrowser is a bot to help you test your project in many different browsers and operating systems.

It started as a automation for [Browser Stack](https://www.browserstack.com) and its goal is to help you validate how your project look in many different environments by taking screenshots for you.

[Saucelabs](https://saucelabs.com/) is also currently accepted and if you would like to see other cross-browser tester running open an issue or a pull-request so we can check it!

## Usage

Robrowser will look for a `.robrowser` config file in the folder you're executing it to check for your credentials (currently we just support Browser Stack).

Some `.robrowser` configuration parameters.

| Attribute | Type | Description |
| ---- | ---- | ---- |
| `remote` | *object* | Configure the connection and access credentials.
| `screenshot` | *object* | Configuration related to screenshot.
| `browsers` | *array* | List counting the tests that will be performed, let's call it browser.
| `concurrency` | *number* | Number of tests running in parallel.

the `currency` parameter is very important, the hubs have a limited number of parallel tests, if you work as a team this will help you to run your tests without problems.

A little more about the `remote` attribute.

| Attribute | Type | Description |
| ---- | ---- | ---- |
| `host` | *string* | Host dos testes, ex: `hub.browserstack.com`.
| `port` | *number* | Port you want to use for tests, defaut is 80.
| `user` | *string* | If you are using a hub, here is your user.
| `pwd` | *string* | If you are using a hub, here is your password.

A little more about the `screenshot` attribute.

| Attribute | Type | Description |
| ---- | ---- | ---- |
| `folder` | *string* | Define the directory where the screenshots will be saved. Default is `./screenshots`

A little more about the `browser`, each browser represents a test, for each test you set capabilities of respective browser you want to test.

| Attribute | Type | Description |
| ---- | ---- | ---- |
| `os` | *string* | OS you want to test.
| `os_version` | *string* | OS version you want to test.
| `browserName` | *string* | Browser you want to test.
| `browser_version` | *string* | Browser version you want to test.
| `resolution` | *string* | Set the resolution of VM before beginning of your test.
| `url` | *string* | Url of the page you want to test.
| `test` | *string* | Path of test.

How to create a test?

The test is nothing more than a function that will receive your browser, and a callback for the next test, [example test file](./index.js).

With the config file having tests to be executed, Robrowser will run them for you and create a `./screenshot` folder with the results, this way you will be able to see if your frontend projects are rendering as expected.

Check our [example config file](./.robrowser) to see other available keys.

**Disclaimer: this project isn't available on `npm` yet, check the Local usage section for now**

### Global installation

```sh
npm i -g robrowser
# or
yarn global add robrowser
```

### One-time usage with npx

If you have `npm@5.2.0` installed you can use [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) to execute commands without needing to install a global package if you don't want to.

To do so just run

```sh
npx robrowser
```

### Local usage

Clone this project

```sh
git clone git clone git@github.com:pagarme/robrowser.git
```

Go to the project where you want to run Robrowser and run the npm/yarn install commands passing the path to your local Robrowser version.

Run it
```sh
robrowser
```

## Contributing

Check our [Contributing](./.github/CONTRIBUTING.md) and [Code of conduct](./.github/CODE_OF_CONDUCT.md) files so you can join us in this awesome project!

_Spoiler alert_: We LOVE contributions, open Pull Requests and Issues and we will be eternally grateful for you!

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
