var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    main: './template/assets/src/js/main.js'
  },
  output: {
    path: './template/assets/build/',
    filename: '[name].js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      'window.jQuery': 'jquery',
      '_': 'lodash'
    }),
    new ExtractTextPlugin("main.css")
  ],
  module: {
    loaders: [
      {
        test: /\.css/,
        loader: ExtractTextPlugin.extract( { fallback: "style-loader", use: "css-loader" } )
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract( { fallback: "style-loader", use: "css-loader!sass-loader" } )
      },
      {
        test: /\.(woff2?|ttf|eot|svg)$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /[\/\\]node_modules[\/\\]some-module[\/\\]index\.js$/,
        loader: "imports-loader?this=>window"
      }
    ]
  }
};
