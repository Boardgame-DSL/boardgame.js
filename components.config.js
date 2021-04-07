const path = require("path");

module.exports = {
	entry: path.resolve(__dirname, "./components/index.ts"),
	mode: "development",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: "ts-loader",
						options: {
							configFile: path.resolve(__dirname, "./components.tsconfig.json"),
						},
					},
				],
			},
		]
	},
	resolve: {
		extensions: [ ".ts", ".tsx", ".js", ".jsx" ]
	},
	externals: {
		"react": "react",
		"react-dom": "react-dom",
	},
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "./dist/components/")
	},
};
