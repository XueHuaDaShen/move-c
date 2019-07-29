const path = require('path');
const webpack = require('webpack');
const APP_PATH = path.join(__dirname, '/app');
const BUILD_PATH = path.join(__dirname, '/product');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        app: [path.join(APP_PATH, '/app.js')],
        vendor: ['react', 'react-dom', 'react-router', 'react-router-dom', 'history', 'redux', 'react-redux', 'moment']
    },

    output: {
        path: BUILD_PATH,
        filename: '[name].js'
        // publicPath: ''  // 生产环境下 如果 css 等通过 cdn 引用图片等静态资源，url 自动替换
    },


    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'less-loader']
                })
            },
            {
                test: /\.js$/,
                include: APP_PATH,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    // 'eslint-loader'
                ]
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192&name=images/[name].[ext]'
            }
        ]
    },

    // sourcemap
    devtool: 'source-map',

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js'
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            output: {
                comments: false,  // remove all comments
            },
            compress: {
                warnings: false
            }
        }),
        // new webpack.LoaderOptionsPlugin({
        //     minimize: true
        // })
        new ExtractTextPlugin('style.css')
    ]
};