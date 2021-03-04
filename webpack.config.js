const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        index: './app/assets/scripts/index.js',
        biografia: './app/assets/scripts/biografia.js',
        campanhasPublicitarias: './app/assets/scripts/campanhasPublicitarias.js',
        contato: './app/assets/scripts/contato.js',
    },

    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'app'),
    },

    devtool: 'inline-source-map',

    devServer: {
        contentBase: path.join(__dirname, 'app'),
        watchContentBase: true,
        index: 'index.html',
        hot: true,
        host: '0.0.0.0',
        port: 9001,
        useLocalIp: true,
        open: {
            app: ['brave-browser', '--incognito'],
        },
    },

    module: {
        rules: [
            {
                test: /\.html$/i,
                type: 'asset/source',
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin({}),
    ],

    mode: 'development',
};