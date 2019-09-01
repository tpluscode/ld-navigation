const path = require('path')
const merge = require('webpack-merge')
const { createCompatibilityConfig } = require('@open-wc/building-webpack')
const CopyPlugin = require('copy-webpack-plugin')

const configs = createCompatibilityConfig({
  input: path.resolve(__dirname, './src/demo/index.html'),
})

module.exports = configs.map(config =>
  merge(config, {
    output: {
      path: path.resolve(__dirname, './demo'),
    },
    plugins: [new CopyPlugin([{ from: 'src/demo/pages', to: 'pages' }])],
    resolve: {
      extensions: ['.ts', '.js', '.json'],
    },
    devServer: {
      publicPath: '/demo/',
    },
  }),
)
