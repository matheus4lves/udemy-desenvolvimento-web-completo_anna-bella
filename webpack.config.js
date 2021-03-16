const webpack = require('webpack');
const path = require('path');
const postcssPlugins = [
    require('postcss-import'),
    require('postcss-mixins'),
    require('postcss-nested'),
    require('postcss-simple-vars'),
    require('autoprefixer')
];

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
        before: function(app, server) {
            server._watch('./app/**/*.html')
        },
        index: 'index.html',
        hot: true,
        host: '0.0.0.0',
        port: 9001,
        useLocalIp: true,
        open: {
            app: ['/opt/firefox-84.0b4/firefox/firefox', '--private-window'],
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
                use: ['style-loader', 'css-loader?url=false', {loader: 'postcss-loader', options: {postcssOptions: { plugins: postcssPlugins}}}],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin({}),
    ],

    mode: 'development',
};