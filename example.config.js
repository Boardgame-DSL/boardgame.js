const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");

module.exports = {
	entry: path.resolve(__dirname, "./example/index.tsx"),
	mode: "development",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: "ts-loader",
						options: {
							configFile: path.resolve(__dirname, "./example.tsconfig.json"),
						},
					},
				],
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
		filename: "index.js",
		path: path.resolve(__dirname, "./dist-example/")
	},
	devServer: {
		contentBase: path.resolve(__dirname, "./dist-example/"),
		port: 9090,
		host: "0.0.0.0"
	}
};
