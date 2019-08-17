const path = require('path');
const webpack = require("webpack");
require("fs")


const config = {
  target: 'electron-renderer',
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: path.resolve(__dirname, 'node_modules'),
      loader: 'babel-loader',
      query:{
          presets: ['es2015', 'react',],
      },
    },],
  },
  entry: {
    "main/index": "./src/main/app.js",
    "renderer/app": "./src/renderer/root.jsx"
  },
  // externals: {
  //   nedb: 'commonjs nedb',
  // },
  output: {
    filename: "[name].js"
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    extensions: [
    '.jsx', '.js'
    ]
  },
};
module.exports = config;
