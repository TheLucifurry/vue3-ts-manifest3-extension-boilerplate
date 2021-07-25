const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge').merge;
const decomment = require('decomment');
const fs = require('fs');

exports.merge = merge;

exports.checkProductionMode = function () {
  return /--mode production/.test(process.argv.join(' '));
}

exports.deleteDirectory = function ({ enabled, distPath }) {
  if (!enabled) return;
  fs.rmdirSync(distPath, { recursive: true });
}

exports.configurePages = function ({ pages, srcPath }) {
  const result = {
    entries: {},
    plugins: [],
  };
  Object.entries(pages)
    .forEach(([name, { title, entry, filename, template }]) => {
      result.entries[name] = entry;
      result.plugins.push(new HtmlWebpackPlugin({
        title,
        inject: false,
        filename: filename || `${name}.html`,
        template: template || srcPath + '/template.html',
        $headContent: `
          <link rel="stylesheet" href="${name}.css">`,
        $bodyContent: `
          <script src="vendors.js"></script>
          <script src="${name}.js"></script>`,
      }))
    })
  return result;
}

exports.editManifest = function ({ packageConfig }) {
  return function (manifestBuffer) {
    const decomented = decomment(manifestBuffer.toString());
    const source = JSON.parse(decomented);
    const { name, version, description, author } = packageConfig;

    const edited = {
      name,
      description,
      version,
      author,
      ...source,
    };
    if (edited.action) {
      Object.assign(edited.action, {
        default_title: edited.name,
        default_icon: edited.icon,
      })
    }

    return JSON.stringify(edited);
  }
}