const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

let apiHost;
var setupConfig = () => {
  switch (process.env.NODE_ENV.trim()) {
    case 'production':
      apiHost = "'http://hertogen.synology.me:8081'";
      break;
    default:
      apiHost = "'http://localhost:3000'";
      break;
  }
};
setupConfig();
console.log(apiHost);
module.exports = {
  entry: {
    index: './src/index.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      template: './src/index.html',
    }),
    new webpack.DefinePlugin({
      __API__: apiHost
    })
  ],
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  optimization: {
    runtimeChunk: 'single',
    
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};