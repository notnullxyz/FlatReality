 var HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
     entry: './src/main.js',
     output: {
         path: './dist',
         filename: 'bundle.js'
     },
     plugins: [
         new HtmlWebpackPlugin({
             title: 'FlatReality',
             filename: 'index.html'
            })
            ]
 };
