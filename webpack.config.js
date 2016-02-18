var autoprefixer = require('autoprefixer');
var HandlebarsPlugin = require("handlebars-webpack-plugin");
var path = require("path");

module.exports = {
    entry: "./src/main.js",
    output: {
        path: 'dist',
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
    },

    plugins: [
        new HandlebarsPlugin({
            entry: path.join(process.cwd(), "src", "index.hbs"),
            output: path.join(process.cwd(), "dist", "index.html"),
            data: {},
            partials: [
                path.join(process.cwd(), "src", "components", "**", "*.hbs")
            ],
        })
    ]
};