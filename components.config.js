const path = require("path");

module.exports = {
	entry: path.resolve(__dirname, "./components/index.ts"),
	mode: "development",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader"
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
		filename: "components.js",
		path: path.resolve(__dirname, "dist")
	},
};
