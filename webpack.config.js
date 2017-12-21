const path = require('path')

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: './index.js',
  devtool: 'source-map',
  target: 'node',
  output: {
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
    filename: 'index.js',
    sourceMapFilename: 'index.js.map',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  externals: {
    async: 'async',
    ramda: 'ramda',
    wd: 'wd',
    'get-root-path': 'get-root-path',
    ora: 'ora',
    'browserstack-local': 'browserstack-local',
  },
}
