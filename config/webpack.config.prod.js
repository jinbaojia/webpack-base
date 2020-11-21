const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config.base');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const PreloadWebpackPlugin = require("preload-webpack-plugin");
const PurifyCSSPlugin = require('purifycss-webpack');
const glob = require('glob');
const path = require('path');
const config = {
    mode: "production",//tree shaking 会将未使用的代码删除

    output: {
        filename: 'js/[name].[contenthash:8].js',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ]
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "css/[name].[contenthash:8].css",
        }),
        new PurifyCSSPlugin({
            paths:glob.sync(path.join(__dirname,'../public/*.html'))
        }),
        new PreloadWebpackPlugin({
            rel: 'prefetch',
            include: 'asyncChunks',
            as(entry) {
                if (/\.css$/.test(entry)) return 'style';
                if (/\.woff$/.test(entry)) return 'font';
                if (/\.png$/.test(entry)) return 'image';
                return 'script';
            }
        }),
        new PreloadWebpackPlugin({
            rel: 'preload',
            include: ['main', 'runtime', 'vendors'],
            as(entry) {
                if (/\.css$/.test(entry)) return 'style';
                if (/\.woff$/.test(entry)) return 'font';
                if (/\.png$/.test(entry)) return 'image';
                return 'script';
            }
        })
    ],
    optimization: {
        // usedExports: true,
        splitChunks: {
            chunks: 'async',//多页面应用打包优化
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
        moduleIds: 'hashed',//vendors 中的node-modules的chunk 不会因为每次打包二改变名字
        runtimeChunk: 'single',
        minimize: true,
        minimizer: [new TerserJSPlugin(), new OptimizeCssAssetsPlugin({})],
    },
}


module.exports = merge(baseConfig, config);