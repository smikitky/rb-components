const path = require('path');

module.exports = {
	entry: {
		bundle: path.join(__dirname, 'lib', 'index.js'),
		demo: path.join(__dirname, 'demo', 'demo.js')
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
};
