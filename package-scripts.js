const { concurrent } = require("nps-utils");

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

module.exports = {
  scripts: {
    default: "budo --dir src src/app.js -- " + ["", ...transforms].join(" --"),
    bundle: {
      app: "browserify " + ["", ...appArgs].join(" --"),
      sw: "browserify " + ["", ...swArgs].join(" --"),
      vendors:
        "browserify " +
        ["", ...vendors].join(" -r ") +
        " --outfile docs/vendors.js",
      default: concurrent.nps("bundle.app", "bundle.sw", "bundle.vendors")
    },
    fmt: "prettier --write"
  }
};
