const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

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
  plugins: [
    new UglifyJSPlugin(),
  ],
}
