const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    demo: ['react-hot-loader/patch', path.join(__dirname, 'demo', 'demo.js')]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react'],
            plugins: [
              'transform-es2015-classes',
              'transform-object-rest-spread',
              'react-hot-loader/babel'
            ]
          }
        }
      }
    ]
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    host: process.env.IP ? process.env.IP : 'localhost',
    disableHostCheck: true,
    hot: true,
    compress: true
  }
};
