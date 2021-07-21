const PACKAGE = require('./package.json');
const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const PATHS = {
  entry: path.join(__dirname, 'src'),
  // output: path.join(__dirname, 'dist'),
};

function editManifest(manifestString) {
  const source = JSON.parse(manifestString);
  const { name, version, description, author } = PACKAGE;

  const edited = {
    name,
    description,
    version,
    author,
    ...source,
  };
  edited.action.default_title = edited.name;

  return JSON.stringify(edited);
}

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: !isProduction ? 'source-map' : false,
  entry: {
    'sw': PATHS.entry + '/background/index.ts',
    'cnt': PATHS.entry + '/content/index.ts',
  },
  output: {
    filename: '[name].js',
  },
  plugins: [
    new CopyPlugin([
      { from: PATHS.entry + '/static', to: 'static' },
      { from: PATHS.entry + '/manifest.json', transform: editManifest },
    ]),
    new webpack.DefinePlugin({
      IS_DEV: JSON.stringify(!isProduction),
    }),
  ],
  optimization: {
    minimize: isProduction,
    sideEffects: false,
    minimizer: [
      new TerserPlugin({
        extractComments: true,
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
  devServer: {
    writeToDisk: true,
    disableHostCheck: true,
    openPage: 'popup.html',
    // open: true, // Uncomment for direct debugging of the popup page
  },
};