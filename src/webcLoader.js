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

	const { WebC } = await import("@11ty/webc");

	const page = new WebC();

	page.setBundlerMode(true);

	page.setContent(source);
	page.defineComponents("src/pds-*.webc");

	const compiled = await page.compile();

	const { html, css, js } = compiled;

	const scripts =
		js.length !== 0
			? `<script dangerouslySetInnerHTML={{__html: \`${js.join("\n")}\` />`
			: ``;

	const styles =
		css.length !== 0
			? `<style dangerouslySetInnerHTML={{__html: \`${css.join("\n")}\` }} />`
			: ``;

	return `
		export default () => (
			<>
				${styles}
				${html.trim()}
				${scripts}
			</>
		)
	`.trim();
};
