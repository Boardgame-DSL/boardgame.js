const path = require("path");

module.exports = {
	entry: path.resolve(__dirname, "./src/index.ts"),
	mode: "development",
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: [
					{
						loader: "ts-loader",
						options: {
							configFile: path.resolve(__dirname, "./lib.tsconfig.json"),
						},
					},
				],
			},
		]
	},
	resolve: {
		extensions: [ ".ts", ".js" ]
	},
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "dist")
	},
};
