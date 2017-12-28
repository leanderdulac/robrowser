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
        use: [
          {
            options: {
              eslintPath: require.resolve('eslint'),
            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: /src/,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: /src/,
        options: {
          cacheDirectory: true,
        },
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
