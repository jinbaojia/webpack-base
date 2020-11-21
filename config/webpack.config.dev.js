const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config.base');
const webpack = require('webpack');
const path = require('path');
const config = {
    mode: "development",
    devtool: 'cheap-module-source-map',
    output: {
        filename: "js/bundle.js",
        pathinfo: false//不生成路劲信息
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader","postcss-loader"],
            },
        ]
    },
    devServer: {
        open: true,
        port: 4000,
        compress: true,
        hot: true,
        progress: true,
        contentBase: path.resolve(__dirname, "../dist"),
        proxy: {
            '/api': {
                target: 'http://localhost:4000',
                // 允许跨域
                changeOrigin: false,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
}


module.exports = merge(baseConfig, config);