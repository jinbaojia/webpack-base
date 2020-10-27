const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
module.exports = {
  mode: "development",
  devServer: {
    open: true,
    port: 4000,
    compress: true,
    hot: true,
    progress: true,
    contentBase: path.join(__dirname, "dist"), //你要提供哪里的内容给虚拟服务器用。这里最好填 绝对路径。
  },
  entry: {
    main: path.resolve(__dirname, "src/index.js"),
  },
  output: {
    filename: "./js/bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          // options: {
          //   presets: ["@babel/preset-env"],
          //   plugins:[]
          // }
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
            name: "img/[name].[ext]",
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
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "webpack-demo",
      filename: "index.html",
      template: path.resolve(__dirname, "public/index.html"),
      minify: {
        removeComments: true,
        removeAttributeQuotes: true,
        collapseWhitespace: true,
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "public/css"),
          to: "css",
        },
      ],
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
};
