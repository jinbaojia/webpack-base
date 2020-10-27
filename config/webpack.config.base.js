const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const PreloadWebpackPlugin = require("preload-webpack-plugin");
const webpack = require("webpack");
module.exports = {
  entry: {
    main: path.resolve(__dirname, "..", "src/index.js"),
  },
  output: {
    path: path.resolve(__dirname, "..", "dist"),
    publicPath: "/", //所有生成的url链接左侧以/开头
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
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 8192, // 8kb --> 8kb以下的图片会base64处理
            // outputPath: 'images', // 决定文件本地输出路径
            // publicPath: '../build/images',  // 决定图片的url路径
            // name: '[hash:8].[ext]' // 修改文件名称 [hash:8] hash值取8位  [ext] 文件扩展名
            name: "img/[name].[hash:8].[ext]",
          },
        },
      },
      {
        test: /\.(eot|svg|woff|woff2|ttf)(\?.*)$/, // 处理字体
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,
              name: "fonts/[name].[has:8].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|acc)(\?.*)$/, // 处理字体
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,
              name: "static/media/[name].[has:8].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "webpack-demo",
      filename: "index.html",
      template: path.resolve(__dirname, "..", "public/index.html"),
      minify: {
        removeComments: true,
        removeAttributeQuotes: true,
        collapseWhitespace: true,
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "..", "public/css"),
          to: "css",
        },
      ],
    }),
    new webpack.NamedModulesPlugin(),

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
      include:['main','runtime','vendors~main'],
      as(entry) {
        if (/\.css$/.test(entry)) return 'style';
        if (/\.woff$/.test(entry)) return 'font';
        if (/\.png$/.test(entry)) return 'image';
        return 'script';
      }
    })
  ],
};
