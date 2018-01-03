import webpack from 'webpack'
import path from 'path'
const HtmlWebpackPlugin = require('html-webpack-plugin')

export default {
  //cache : true,
  entry : {
    app:'./src/index.js'
  },
  devtool : 'inline-source-map',
  devServer : {
    contentBase: path.join(__dirname, '/'),
    hot: true,
    publicPath:'/js/plugins/',
    //需要设置一下位置
    watchContentBase: true,
    open:true
  },
  module : {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [path.resolve(__dirname, "node_modules")]
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  },
  plugins : [
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],
  output : {
    filename: '[name].js',
    path: path.resolve(__dirname, '/js/plugins/'),
    publicPath:'/js/plugins/'
  },
  resolve : {
    extensions: ['*', '.js', '.json']
  }
}
