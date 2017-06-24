const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: {
		demo: [
			'react-hot-loader/patch',
			path.join(__dirname, 'demo', 'demo.js')
		]
	},
	output: {
		path: path.join(__dirname, 'build'),
		filename: '[name].js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
	devServer: {
		host: process.env.IP ? process.env.IP : 'localhost',
		disableHostCheck: true,
		hot: true,
		compress: true
	}
};
