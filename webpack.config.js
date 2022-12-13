const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require("path");
// const WebCPlugin = require("./src/webcPlugin");

module.exports = {
	...defaultConfig,
	// plugins: [...defaultConfig.plugins, new WebCPlugin()],
	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,
			{
				test: /\.webc$/,
				use: [
					{
						loader: path.resolve(__dirname, "src/webcLoader.js"),
						options: {
							/* ... */
						},
					},
				],
			},
		],
	},
};
