const configureWebpack = require('./webpack.config');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  configureWebpack,
  lintOnSave: isProduction,
  filenameHashing: false,
  pages: {
    popup: {
      entry: 'src/components/popup/index.js',
      template: 'src/template.html',
      filename: 'popup.html',
      title: 'Popup',
    },
    // app: {
    //   entry: 'src/components/app/index.js',
    //   template: 'src/template.html',
    //   filename: 'index.html',
    //   title: 'Application',
    // },
  },
};
