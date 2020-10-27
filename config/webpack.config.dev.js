const {merge} = require("webpack-merge");
const baseConfig = require("./webpack.config.base");
const path = require("path");

const config = {
  mode: "development",
  // devtool:"cheap-module-source-map",
  devServer: {
    open: true,
    port: 4000,
    compress: true,
    hot: true,
    progress: true,
    contentBase: path.resolve(__dirname, "..", "dist"), //你要提供哪里的内容给虚拟服务器用。这里最好填 绝对路径。
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
  output: {
    filename: "js/bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader" , "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
      },
    ],
  },
};

module.exports =  merge(baseConfig, config);
