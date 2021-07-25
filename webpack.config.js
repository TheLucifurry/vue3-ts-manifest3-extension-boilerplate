const PACKAGE = require('./package.json');
const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { deleteDirectory, configurePages, checkProductionMode, merge, editManifest, minifyJSONFile } = require('./webpack.utils');


// Settings
const IS_PROD = checkProductionMode();

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


deleteDirectory({ enabled: IS_PROD, distPath: PATHS.DIST });

const pagesConfigs = configurePages({ pages: PAGES, srcPath: PATHS.SRC });

const configBase = {
  mode: IS_PROD ? 'production' : 'development',
  devtool: IS_PROD ? false : 'source-map',
  watch: !IS_PROD,
  output: {
    path: PATHS.DIST,
    filename: 'js/[name].js',
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
    ...pagesConfigs.entries,
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
        use: 'babel-loader',
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
        loader: 'file-loader',
        options: {
          name: 'assets/[contenthash].[ext]',
        },
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new CopyPlugin({
      patterns: [
        { from: PATHS.SRC + '/static', to: 'static', noErrorOnMissing: true },
        { from: PATHS.SRC + '/_locales', to: '_locales', noErrorOnMissing: true, transform: minifyJSONFile() },
        { from: PATHS.SRC + '/manifest.jsonc', to: 'manifest.json', transform: editManifest({ packageConfig: PACKAGE }) },
      ]
    }),
    !IS_PROD ? () => { } : new ImageMinimizerPlugin({ // See: https://www.npmjs.com/package/image-minimizer-webpack-plugin
      minimizerOptions: {
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 5 }],
          ['svgo', { plugins: [{ removeViewBox: false }] }],
        ],
      },
    }),
    ...pagesConfigs.plugins,
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
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
        use: 'ts-loader',
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: PATHS.SRC + '/background/sw-loader.js', to: 'sw-loader.js' },
      ],
    }),
  ],
};

module.exports = [
  merge(configBase, configMain),
  merge(configBase, configServiceWorker),
];
