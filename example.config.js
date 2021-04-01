const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");

module.exports = {
	entry: path.resolve(__dirname, "./example/index.tsx"),
	mode: "development",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader"
			},
			{
				test: /\.s?css$/,
				use: [
					"style-loader",
					"css-loader",
					"sass-loader"
				]
			},
		]
	},
	resolve: {
		extensions: [ ".ts", ".tsx", ".js", ".jsx" ]
	},
	plugins: [
		new HtmlPlugin({
			template: path.resolve(__dirname, "./example/index.html"),
			title: "Example",
			base: "./"
		}),
	],
	output: {
		filename: "example.js",
		path: path.resolve(__dirname, "dist")
	},
	devServer: {
		contentBase: path.resolve(__dirname, "dist"),
		port: 9090,
		host: "0.0.0.0"
	}
};
