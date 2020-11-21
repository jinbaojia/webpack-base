const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
    entry: {
        main: path.resolve(__dirname, '../src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: "/",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: {
                            compilerOptions: {
                                preserveWhitespace: false
                            },
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192, // 8kb --> 8kb以下的图片会base64处理
                            outputPath: 'images', // 决定文件本地输出路径
                            publicPath: '../images',  // 决定图片的url路径
                            name: "[name].[hash:8].[ext]",
                        },
                    },
                    {
                        loader: "image-webpack-loader",
                        options: { disable: false, }
                    }
                ],
            },
            {
                test: /\.(eot|woff2?|woff|ttf|svg)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            name: "[name].[hash:8].[ext]",
                            limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
                            publicPath: "fonts/",
                            outputPath: "fonts/"
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.resolve(__dirname, "../public/index.html"),
            minify: {//对html进行处理
                removeComments: true,
                removeAttributeQuotes: true,
                collapseWhitespace: true,
            },
        }),
        new VueLoaderPlugin()
    ],
}