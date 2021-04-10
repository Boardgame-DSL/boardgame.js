const fs = require("fs");
const path = require("path");
const glob = require("glob");

const srcFiles = [path.resolve(__dirname, "./dist/index.js"), path.resolve(__dirname, "./dist/index.d.ts")];
const componentFiles = [
	...glob.sync(path.resolve(__dirname, "./dist/components/**/*.js")),
	...glob.sync(path.resolve(__dirname, "./dist/components/**/*.d.ts"))
];

for (const from of srcFiles) {
	if (fs.existsSync(from)) {
		const to = path.resolve(__dirname, path.basename(from));
		fs.copyFileSync(from, to);
	}
}
for (const from of componentFiles) {
	if (fs.existsSync(from)) {
		const to = path.resolve(__dirname, "./components/", path.basename(from));
		fs.copyFileSync(from, to);
	}
}
