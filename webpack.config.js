const path = require('path')
const merge = require('webpack-merge')
const { createDefaultConfig } = require('@open-wc/building-webpack')
const CopyPlugin = require('copy-webpack-plugin')

// if you need to support IE11 use "modern-and-legacy-config" instead.
// const { createCompatibilityConfig } = require('@open-wc/building-webpack');
// module.exports = createCompatibilityConfig({
//   input: path.resolve(__dirname, './index.html'),
// });

module.exports = merge(
  createDefaultConfig({
    input: path.resolve(__dirname, './src/demo/index.html'),
  }),
  {
    output: {
      path: path.resolve(__dirname, './demo'),
    },
    plugins: [
      new CopyPlugin([{ from: 'src/demo/pages', to: 'pages' }, { from: 'src/*.html', to: '.' }]),
    ],
    resolve: {
      extensions: ['.ts', '.js', '.json'],
    },
    devServer: {
      publicPath: '/demo/',
      historyApiFallback: {
        rewrites: [{ from: /^\/$/, to: '/demo/index.html' }],
      },
    },
  },
)
