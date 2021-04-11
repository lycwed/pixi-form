const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const webpackConfig = require('./webpack.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  ...webpackConfig,
  mode: "development",
  devtool: 'inline-source-map',
  entry: {
    index: path.resolve(__dirname, 'src/index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'www'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Text Input Plus Demo',
      template: path.resolve(__dirname, 'demo/index.html'),
      filename: path.resolve(__dirname, 'www/index.html'),
      base: '/',
      chunks: ["index"],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'demo/assets/'),
          to: path.resolve(__dirname, 'www/assets/'),
        },
      ],
    })
  ],
  devServer: {
    index: 'index.html',
    contentBase: path.resolve(__dirname, 'www'),
    open: true,
    compress: true,
    port: 8500,
    host: 'localhost',
    // hot: true,
    // https: true,
  }
};