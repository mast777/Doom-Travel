const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const config = {
    mode: "production", // "production" | "development" | "none"  // Chosen mode tells webpack to use its built-in optimizations accordingly.
    output: {
        filename: 'bundle.js',
    },
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true,
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            JQuery: 'jquery'
        })
    ]
};

module.exports = config