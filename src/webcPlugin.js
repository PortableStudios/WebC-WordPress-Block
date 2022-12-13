// Partially abandoned attempt at creating a plugin instead of a loader

const path = require("path");

class WebCPlugin {
	apply(compiler) {
		compiler.hooks.compilation.tap("WebCPlugin", (compilation) => {
			compilation.hooks.buildModule.tap("WebCPlugin", async (module) => {
				if (module.rawRequest !== "./save") return;

				module.useSourceMap = true;

				console.log(module);

				const { WebC } = await import("@11ty/webc");

				const page = new WebC();

				page.setBundlerMode(true);

				page.setInputPath(path.join(__dirname, "page.webc"));
				page.defineComponents([path.join(__dirname, "pds-hero.webc")]);

				const { html, css, js } = await page.compile();
			});
		});
	}
}

module.exports = WebCPlugin;
