# Browser Stack Automated | [![GitHub license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/pagarme/browserstack-automated/blob/master/LICENSE)
> Automating the use of [Browser Stack](https://www.browserstack.com).

[Browser Stack](https://www.browserstack.com) allows you to test your project in many different browsers and OS, this project helps you validating how your project look in many different environments by taking screenshots for you.

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