const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge').merge;
const decomment = require('decomment');
const fs = require('fs');

exports.merge = merge;

exports.checkProductionMode = () => {
  return /--mode[= ]production/.test(process.argv.join(' '));
}

exports.deleteDirectory = ({ enabled, distPath }) => {
  if (!enabled) return;
  fs.rmdirSync(distPath, { recursive: true });
}

exports.configurePages = ({ pages, srcPath }) => {
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
          <link rel="stylesheet" href="css/${name}.css">`,
        $bodyContent: `
          <script src="js/vendors.js"></script>
          <script src="js/${name}.js"></script>`,
      }))
    })
  return result;
}

exports.editManifest = ({ packageConfig }) => {
  return (manifestBuffer) => {
    const decomented = decomment(manifestBuffer.toString());
    const source = JSON.parse(decomented);
    const { name, description, version, author } = packageConfig;

    const edited = {
      // name, description, // Uncomment, if you want to sync this field with package.json
      version,
      author,
      ...source,
    };
    if (edited.action) {
      Object.assign(edited.action, {
        default_title: edited.name,
        default_icons: edited.icons,
      })
    }

    return JSON.stringify(edited);
  }
}

exports.minifyJSONFile = () => (buffer) => {
  return JSON.stringify(JSON.parse(buffer.toString()));
}