 var HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
     entry: './src/main.js',
     output: {
         path: './dist',
         filename: 'bundle.js'
     },
     plugins: [
         /**
          * Pack a dynamically created Index into output dir.
          */
         new HtmlWebpackPlugin({
             title: 'FlatReality',
             filename: 'index.html'
            })
            ],
        preLoaders: [
            {
                test: /\.js$/, 
                loader: "jshint-loader"
            }
        ]
 };
