const path = require('path');
const webpack = require('webpack');

// const prodPlugins = require('./webpack.prod-plugins');

module.exports = {
    target: 'web',
    entry: {
        vendor: ['react', 'react-dom', 'react-helmet', 'react-redux', 'react-router-dom', 'redux', 'raynor']
    },
    output: {
        path: path.resolve(__dirname, 'out', 'client'),
        publicPath: '/real/client',
        filename: '[name].bundle.js',
        library: '[name]_lib'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.resolve(__dirname, 'out', 'client', '[name]-manifest.json'),
            name: '[name]_lib'
        })
    ].concat(process.env.ENV !== 'LOCAL' ? [] /* TODO: fix this prodPlugins.prodPlugins */ : [])
};
