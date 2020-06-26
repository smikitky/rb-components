const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    demo: ['react-hot-loader/patch', path.join(__dirname, 'demo', 'demo.js')]
  },
  module: {
    rules: [
      {
        test: /\.(js|tsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-typescript'],
            plugins: ['react-hot-loader/babel']
          }
        }
      }
    ]
  },
  resolve: { extensions: ['.ts', '.tsx', '.js', '.json'] },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devtool: 'inline-source-map',
  devServer: {
    host: process.env.IP || 'localhost',
    disableHostCheck: true,
    hot: true,
    compress: true
  }
};
