const { urlToRequest } = require("loader-utils");
const { validate } = require("schema-utils");

const schema = {
	type: "object",
	properties: {
		test: {
			type: "string",
		},
	},
};

module.exports = async function (source) {
	const options = this.getOptions();

	validate(schema, options, {
		name: "Example Loader",
		baseDataPath: "options",
	});

	console.log("PATH:", urlToRequest(this.resourcePath));

	console.log("SOURCE:", source);

	const { WebC } = await import("@11ty/webc");

	const page = new WebC();

	page.setBundlerMode(true);

	page.setContent(source);
	page.defineComponents("src/pds-*.webc");

	const compiled = await page.compile();

	const { html, css, js } = compiled;

	console.log("COMPILED:", compiled);

	return `
		module.exports = \`
			<style>
				${css}
			</style>
			${html}
		\`
	`;
};
