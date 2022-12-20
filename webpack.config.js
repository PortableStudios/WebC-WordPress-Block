const path = require("path");
const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const { hasArgInCLI } = require("@wordpress/scripts/utils");

const isProduction = process.env.NODE_ENV === "production";
const hasReactFastRefresh = hasArgInCLI("--hot") && !isProduction;

module.exports = {
	...defaultConfig,
	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,
			{
				test: /\.webc$/,
				use: [
					{
						loader: require.resolve("babel-loader"),
						options: {
							// Babel uses a directory within local node_modules
							// by default. Use the environment variable option
							// to enable more persistent caching.
							cacheDirectory: process.env.BABEL_CACHE_DIRECTORY || true,
							babelrc: false,
							configFile: false,
							presets: [require.resolve("@wordpress/babel-preset-default")],
							plugins: [
								hasReactFastRefresh && require.resolve("react-refresh/babel"),
							].filter(Boolean),
						},
					},
					{
						loader: path.resolve(__dirname, "webcLoader.js"),
						options: {
							/* ... */
						},
					},
				],
			},
		],
	},
};
