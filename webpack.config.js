var autoprefixer = require('autoprefixer');

module.exports = {
    entry: "./src/main.js",
    output: {
        path: 'assets',
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: "style!css!postcss!sass"
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.hbs/,
                loader: "handlebars-loader"
            }
        ]
    },
    postcss: function () {
        return [autoprefixer({ browsers:  ['last 2 versions'] })];
    }
};