const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { webpack } = require('webpack');

let apiHost;
var setupConfig = () => {
  switch (process.env.NODE_ENV) {
    case 'production':
      apiHost = 'http://hertogen.synology.me:8081';
      break;
    default:
      apiHost = 'http://localhost:3000';
      break;
  }
};
setupConfig();

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
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
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};