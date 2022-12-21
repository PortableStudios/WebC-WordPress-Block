const fs = require("node:fs");
const path = require("node:path");
const { validate } = require("schema-utils");

const schema = {
	type: "object",
	properties: {},
};

module.exports = async function (source) {
	const options = this.getOptions();

	validate(schema, options, {
		name: "WebC Loader",
		baseDataPath: "options",
	});

	const { WebC } = await import("@11ty/webc");

	const page = new WebC();

	page.setBundlerMode(true);

	page.setContent(source);
	page.defineComponents("src/pds-*.webc");

	const compiled = await page.compile();

	const { html, css, js, components } = compiled;

	// Example: `src/pds-hero.webc` becomes `pds-hero.css`
	const cssFileName = path.basename(components[0].replace("webc", "css"));

	const cssFileLocation = path.resolve("./src", cssFileName);

	// Match the component host element hashed class name
	const className = html.match(/"(.*?)"/)[1];

	const markup = html.replace(
		`class="${className}"`,
		`{ ...props } className={props.className + " ${className}"}`
	);

	// Write out CSS file
	fs.writeFile(
		cssFileLocation,
		`
/**
 * Do not edit directly
 * Generated on ${new Date().toUTCString()}
 */

${css
	.join("\n")
	.replace(
		`.${className}`,
		`:is(.${className}, .editor-styles-wrapper .${className})`
	)}
		`.trim(),
		(err) => {
			if (err) throw err;
			console.log("💾 The CSS file has been saved!");
		}
	);

	const scripts =
		js.length !== 0
			? `<script dangerouslySetInnerHTML={{__html: \`${js.join("\n")}\` />`
			: ``;

	return `
		import "${cssFileLocation}";
		export default ({ children, ...props }) => {
			return (
				<>
					${markup.trim()}
					${scripts}
				</>
			);
		};
	`.trim();
};
