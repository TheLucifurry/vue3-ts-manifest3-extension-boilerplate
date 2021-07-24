const PACKAGE = require('./package.json');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const merge = require('webpack-merge').merge;
const decomment = require('decomment');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


// Settings
const IS_PROD = /--mode production/.test(process.argv.join(' '));

const PATHS = {
  SRC: path.join(__dirname, 'src'),
  DIST: path.join(__dirname, 'dist'),
};

const PAGES = { // Same as: https://cli.vuejs.org/config/#pages
  popup: {
    title: 'Popup',
    entry: PATHS.SRC + '/components/popup/index.js',
  },
  options: {
    title: 'Options',
    entry: PATHS.SRC + '/components/options/index.js',
  },
};



const pagesEntry = {};
const pagesPlugins = [];
Object.entries(PAGES).forEach(([name, { title, entry, filename, template }]) => {
  pagesEntry[name] = entry;
  pagesPlugins.push(new HtmlWebpackPlugin({
    title,
    inject: false,
    filename: filename || `${name}.html`,
    template: template || PATHS.SRC + '/template.html',
    $headContent: `
      <link rel="stylesheet" href="${name}.css">`,
    $bodyContent: `
      <script src="vendors.js"></script>
      <script src="${name}.js"></script>`,
  }))
})

function editManifest(manifestBuffer, manifestString) {
  const decomented = decomment(manifestBuffer.toString());
  const source = JSON.parse(decomented);
  const { name, version, description, author } = PACKAGE;

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

if (IS_PROD) {
  fs.rmdirSync(PATHS.DIST, { recursive: true });
}

const configBase = {
  mode: IS_PROD ? 'production' : 'development',
  devtool: IS_PROD ? false : 'source-map',
  watch: !IS_PROD,
  output: {
    path: PATHS.DIST,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: { '@': PATHS.SRC },
  },
  optimization: {
    minimize: IS_PROD,
    minimizer: [
      new TerserPlugin({
        extractComments: true,
        parallel: true,
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({
      IS_DEV: !IS_PROD,
      __VUE_OPTIONS_API__: !IS_PROD,
      __VUE_PROD_DEVTOOLS__: !IS_PROD,
    }),
  ],
};


const configMain = {
  entry: {
    'cnt': PATHS.SRC + '/content/index.ts',
    ...pagesEntry,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: { appendTsSuffixTo: [/\.vue$/] },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: file => (/node_modules/.test(file) && !/\.vue\.js/.test(file)),
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        // * For less support:
        // test: /\.less$/,
        // use: ['vue-style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
      {
        test: /\.(png|jpg|gif|eot|svg|otf|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: { limit: 500000 },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new VueLoaderPlugin(),
    new CopyPlugin({
      patterns: [
        { from: PATHS.SRC + '/static', to: 'static', noErrorOnMissing: true },
        { from: PATHS.SRC + '/manifest.jsonc', to: 'manifest.json', transform: editManifest },
      ]
    }),
    ...pagesPlugins,
  ],
  optimization: {
    splitChunks: {
      name: false,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};


const configServiceWorker = {
  entry: {
    'sw': PATHS.SRC + '/background/index.ts',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: PATHS.SRC + '/background/sw-loader.js', to: 'sw-loader.js' },
      ]
    }),
  ],
};



module.exports = [
  merge(configBase, configMain),
  merge(configBase, configServiceWorker),
];
