require("toml-require").install();
const { concurrent, copy } = require("nps-utils");
const config = require("./config.toml");

const vendors = ["choo", "choo/html", "choo-log"];

const transforms = ["unflowify", "es2040"].map(t => "transform " + t);

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

const manifestArgs = Object.keys(config).map(k => `--data-${k}="${config[k]}"`);

module.exports = {
  scripts: {
    default: {
      description: "Starts the development local web server.",
      script: "budo --dir src src/app.js -- " + ["", ...transforms].join(" --")
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
      manifest: {
        description:
          "Copy manifest file template replacing config variables in config.toml",
        script:
          "variable-replacer src/manifest.json docs " + manifestArgs.join(" ")
      },
      default: {
        description: "Build all production bundles.",
        script: concurrent.nps(
          "bundle.app",
          "bundle.sw",
          "bundle.vendors",
          "bundle.manifest"
        )
      }
    },
    fmt: {
      description:
        'Format/lint a source file, usage: npm start "fmt yourfile.js"',
      script: "prettier --write"
    }
  }
};
