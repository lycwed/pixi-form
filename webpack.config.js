const path = require('path');

module.exports = {
  entry: {
    index: path.resolve(__dirname, 'src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'pixi-text-input-plus.min.js',
    libraryTarget: "umd",
  },
  optimization: {
    minimize: true,
  },
  module: {
    rules: [
      {
        test: /\\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
};
