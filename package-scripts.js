require("toml-require").install();
const config = require("./config.toml");
const { concurrent, copy } = require("nps-utils");

const vendors = ["choo", "choo/html", "choo-log"];

const transforms = ["unflowify", "tomlify", "es2040"].map(
    t => "transform " + t
);

const appArgs = [
    "entry src/app.js",
    "outfile docs/app.js",
    "no-bundle-external",
    ...transforms
];

const swArgs = [
    "entry src/sw.js",
    "outfile docs/sw.js",
    "no-bundle-external",
    ...transforms
];

const manifestArgs = Object.keys(config.app).map(k => `--data-${k}="${config.app[k]}"`);

module.exports = {
    scripts: {
        default: {
            description: "Starts the development local web server.",
            script:
                "budo --dir src --dir assets --force-default-index src/app.js -- " +
                ["", ...transforms].join(" --")
        },
        generate: {
            keys: {
                description: "Generate VAPID keys keypair and write it to the config file",
                script: "web-push generate-vapid-keys"
            }
        },
        bundle: {
            app: {
                description:
                    "Build the application bundle without the external libraries (app.js)",
                script: "browserify " + ["", ...appArgs].join(" --")
            },
            sw: {
                description: "Build the service workers file (sw.js)",
                script: "browserify " + ["", ...swArgs].join(" --")
            },
            vendors: {
                description:
                    "Build the bundle with 3rd party dependencies (vendors.js).",
                script:
                    "browserify " +
                    ["", ...vendors].join(" -r ") +
                    " --outfile docs/vendors.js"
            },
            html: {
                description:
                    "Copy HTML index file template replacing config variables in config.toml",
                script:
                    "variable-replacer index.html docs " +
                    manifestArgs.join(" ")
            },
            manifest: {
                description:
                    "Copy manifest file template replacing config variables in config.toml",
                script:
                    "variable-replacer src/manifest.json docs " +
                    manifestArgs.join(" ")
            },
            assets: {
                description: "Copy application icons",
                script: copy(
                    "--no-overwrite --parents --cwd assets **/*.{png,opus} ../docs"
                )
            },
            default: {
                description: "Build all production bundles.",
                script: concurrent.nps(
                    "bundle.app",
                    "bundle.sw",
                    "bundle.vendors",
                    "bundle.html",
                    "bundle.manifest",
                    "bundle.assets"
                )
            }
        },
        fmt: {
            description:
                'Format/lint a source file, usage: npm start "fmt yourfile.js"',
            script: "prettier --write --tab-width 4"
        }
    }
};
