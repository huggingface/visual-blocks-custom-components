const path = require('path');

/** @type {import('webpack').Configuration} */
module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: './src/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        port: 8080,
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    },
};
