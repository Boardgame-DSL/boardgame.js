const fs = require("fs");
const path = require("path");
const glob = require("glob");

const srcFiles = [path.resolve(__dirname, "./index.js"), path.resolve(__dirname, "./index.d.ts")];
const componentFiles = [
	...glob.sync(path.resolve(__dirname, "./components/**/*.js")),
	...glob.sync(path.resolve(__dirname, "./components/**/*.d.ts"))
];

for (const file of [...srcFiles, ...componentFiles]) {
	if (fs.existsSync(file)) {
		fs.unlinkSync(file);
	}
}
