const path = require('path')

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