const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.config.base");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");

const config = {
  mode: "production",
  devtool: "eval-cheap-module-source-map",
  // devtool:"none",
  output: {
    filename: "js/[name].[contenthash:8].js",
  },
  module: {
    rules: [
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
      filename: "css/[name].[contenthash:8].css",
    }),
    new CleanWebpackPlugin(),
  ],
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    //拆分打包文件
    splitChunks: {
      // chunks:'async'//默认值，只对异步加载的模块单独打包
      chunks: "all", //将node_modules 引入的模块和异步加载的模块都拆封单独打包
    },
    //将webpack的模块引导代码单独打包
    runtimeChunk: {
      name: "runtime",
    },
  },
};

module.exports = merge(baseConfig, config);
