const webpack = require('webpack'),
      path = require('path'),
      UglifyJSPlugin =  require('uglifyjs-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: './src/cors.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'cors.js',
        libraryTarget: 'umd'
    }
}