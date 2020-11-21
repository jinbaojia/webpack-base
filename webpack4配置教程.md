## webpack快速入门教程
	
### 2、开启项目
* 初始化项目：
```
  npm init
```
  * 生成package.json文件
      ```   
      {
        "name": "webpack_test",
        "version": "1.0.0"
      } 
      ```
* 安装webpack
  * npm install webpack webpack-cli -D //本地安装,作为本地依赖使用
    

### 3、使用webpack配置文件
* 目的：在项目根目录定义配置文件，通过自定义配置文件，还原以上功能
* 文件名称：webpack.config.js
* 文件内容：
    ```
    const { resolve } = require('path'); //node内置核心模块，用来设置路径。
    module.exports = {
      entry: "./src/index.js",   // 入口文件配置（简写）
	  /*完整写法：
		entry:{
        main: "./src/index.js"
    }
	  */
      output: {                     // 输出配置
        filename: './js/built.js',      // 输出文件名
        path: resolve(__dirname, 'build')   //输出文件路径配置
      },
      mode: 'development'   //开发环境(二选一)
      mode: 'production'   //生产环境(二选一)
    };
    ```
* 运行指令： webpack

### 4、自动编译打包运行
* 安装loader
	* npm install webpack-dev-server --save-dev
* 详细配置见官网：指南 -> 开发环境 -> 使用webpack-dev-server 
* 修改webpack配置对象（注意不是loader中）
    ```
   devServer: {
    open: true,
    port: 4000,
    compress: true,
    //优点：对JS，CSS资源的压缩率很高，可以极大得提高文件传输的速率，从而提升web性能
    //缺点：服务端要对文件进行压缩，而客户端要进行解压，增加了两边的负载
    hot: true,
    progress: true,
    contentBase: path.join(__dirname, "dist"),//你要提供哪里的内容给虚拟服务器用。这里最好填 绝对路径。
  },
    ```
* 在package.json中
* "start":"webpack-dev-server"



### 5、打包html文件
* 概述：html文件webpack不能解析，需要借助插件编译解析
* 添加html文件
  * src/index.html
  * 注意不要在html中引入任何css和js文件
* 安装插件Plugins
	* npm install html-webpack-plugin --save-dev 
* 在webpack.config.js中引入插件（插件都需要手动引入，而loader会自动加载）
	* const HtmlWebpackPlugin = require('html-webpack-plugin')
* 配置插件Plugins
    ```
    new HtmlWebpackPlugin({
      title: "webpack-demo",            
      filename: "index.html",
      template: path.resolve(__dirname, "public/index.html"),
      minify: {//对html进行处理
        removeComments: true,
        removeAttributeQuotes: true,
        collapseWhitespace: true,
      },
    }),
    ```
* 运行指令：webpack

### 6、清除打包文件目录
* 概述：每次打包生成了文件，都需要手动删除，引入插件帮助我们自动删除上一次的文件
* 安装插件
	* npm install clean-webpack-plugin --save-dev
* 引入插件
  * const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 注意要解构赋值！！！
* 配置插件
  * new CleanWebpackPlugin() // 自动清除output.path目录下的文件
* 运行指令：npm run build

### 7、js语法转换
* 概述：将浏览器不能识别的新语法转换成原来识别的旧语法，做浏览器兼容性处理
* 安装loader
  * npm install babel-loader @babel/core @babel/preset-env @babel/polyfill --save-dev
* 配置loader
    ```
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [],
              plugins:[]
            }
          }
        }
      ]
    }
    ```
    * 在babel.config.js中配置
    ```
    module.exports = function (api) {
    api.cache(true);//加快babel处理
  
    const presets = ["@babel/preset-env"];
    const plugins = [];
  
    return {
      presets,
      plugins
    };
  }
    ```
* 运行指令：webpack

### 8、打包less资源
* 概述：less文件webpack不能解析，需要借助loader编译解析
* 创建less文件
  * src/less/test1.less
  * src/less/test2.less
* 入口app.js文件
  * 引入less资源  
* 安装loader
  * npm install css-loader style-loader less-loader less --save-dev 
* 配置loader
    ```
	{
		test: /\.less$/, // 检查文件是否以.less结尾（检查是否是less文件）
		use: [  // 数组中loader执行是从下到上，从右到左顺序执行
		  'style-loader', // 创建style标签，添加上js中的css代码
		  'css-loader', // 将css以commonjs方式整合到js文件中
		  'less-loader'  // 将less文件解析成css文件
		]
	},
    ```

* 运行指令：webpack

### 8、js语法检查
* 概述：对js基本语法错误/隐患，进行提前检查
* 安装loader
  * npm install eslint-loader eslint --save-dev
* 备注1：在：eslint.org网站 -> userGuide -> Configuring ESLint 查看如何配置
* 备注2：在：eslint.org网站 -> userGuide -> Rules 查看所有规则
* 配置loader
    ```
    module: {
      rules: [
        {
          test: /\.js$/,  //只检测js文件
          exclude: /node_modules/,  //排除node_modules文件夹
          enforce: "pre",  //提前加载使用
          use: { //使用eslint-loader解析
            loader: "eslint-loader" 
          }
        }        
      ]
    }
    ```
* 修改package.json（需要删除注释才能生效）
    ```
	"eslintConfig": {
		"parserOptions": {
		  "ecmaVersion": 6, 		// 支持es6
		  "sourceType": "module"	// 使用es6模块化
		},
		"env": { // 设置环境
		  "browser": true,   // 支持浏览器环境： 能够使用window上的全局变量
		  "node": true       // 支持服务器环境:  能够使用node上global的全局变量
		},
		"globals": {	// 声明使用的全局变量, 这样即使没有定义也不会报错了
		  "$": "readonly"	// $ 只读变量
		},
		"rules": {  // eslint检查的规则  0 忽略 1 警告 2 错误
		  "no-console": 0, 	// 不检查console
		  "eqeqeq": 2,	// 用==而不用===就报错
		  "no-alert": 2 // 不能使用alert
		},
		"extends": "eslint:recommended" // 使用eslint推荐的默认规则 https://cn.eslint.org/docs/rules/
	},
    ```
* 运行指令：webpack



### 9、 js兼容性处理
####方法：借助按需引入core-js按需引入
* 安装包
  polyfill 
* 配置babel.config.js
	```
  const presets = [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage", 
        corejs: { version: 2 },  //corejs的版本是polyfill中corejs的版本
        targets: {
          // 指定兼容性处理哪些浏览器
          chrome: "58",
          ie: "9",
        },
      },
    ],
  ];
	```

### 10、打包样式文件中的图片资源
* 概述：图片文件webpack不能解析，需要借助loader编译解析
* 添加2张图片:
   * 小图, 小于8kb: src/images/vue.png
   * 大图, 大于8kb: src/images/react.jpg
* 在less文件中通过背景图的方式引入图片
* 安装loader
  * npm install file-loader url-loader --save-dev 
  * 补充：url-loader是对象file-loader的上层封装，使用时需配合file-loader使用。
* 配置loader
    ```
	{
		test: /\.(png|jpg|gif)$/,
		use: {
		  loader: 'url-loader',
		  options: {
		    limit: 8192, // 8kb --> 8kb以下的图片会base64处理
		    outputPath: 'images', // 决定文件本地输出路径
		    publicPath: '../build/images',  // 决定图片的url路径
		    name: '[hash:8].[ext]' // 修改文件名称 [hash:8] hash值取8位  [ext] 文件扩展名
        name:'img/[name].[ext]'
		  }
		}
	},
    ```

* 运行指令：webpack



### 11、打包html中图片资源
* 概述：html中的图片url-loader没法处理，它只能处理js中引入的图片 / 样式中图片，不能处理html中img标签，需要引入其他html-loader处理。
* 添加图片
  * 在src/index.html添加两个img标签
* 安装loader
	* npm install html-loader --save-dev 
* 配置loader
    ```
    {
      test: /\.(html)$/,
      use: {
        loader: 'html-loader'
      }
    }
    ```
* 运行指令：webpack

### 12、打包其他资源
* 概述：其他资源webpack不能解析，需要借助loader编译解析
* 音乐
    ```
   {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|acc)(\?.*)$/, // 处理字体
        use: [
          {
            loader: "url-loader",
            opations: {
              limit: 10240,
              name: "static/media/[name].[has:8].[ext]",
            },
          },
        ],
      },
    ```
* 修改html，添加字体
* 配置loader
    ```
	{
        test: /\.(eot|svg|woff|woff2?|ttf)(\?.*)$/, // 处理字体
        use: [
          {
            loader: "url-loader",
            opations: {
              limit: 10240,
              name: "fonts/[name].[has:8].[ext]",
            },
          },
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
    ```
* 运行指令：webpack




### 14、热模替换功能
* 概述：热模块替换（HMR）是webpack提供的最有用的功能之一。它允许在运行时更新所有类型的模块，而无需完全刷新（只更新变化的模块，不变的模块不更新）。
* 详细配置见官网：指南 -> 模块热替换
* 修改devServer配置
	```
    devServer: {
      contentBase: resolve(__dirname, 'build'), // 运行项目的目录
	  open: true, // 自动打开浏览器
	  compress: true, // 启动gzip压缩
	  port: 3000, // 端口号
	  hot: true // 开启热模替换功能 HMR
    }
    ```
* 以上就可以打开热莫替换，官方文档如下
    const webpack = require("webpack");
* 在plugin 中
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
* 更改js文件不会触发热莫替换
    
* 问题：html文件无法自动更新了，需要增加一个入口
	```
	  entry: ['./src/js/app.js','./src/index.html']
	```

### 15、devtool
* 概述： 一种将压缩/编译文件中的代码映射回源文件中的原始位置的技术，让我们调试代码不在困难
* 详细配置见官网：配置 -> devtool
* 介绍
	* cheap 只保留行, 编译速度快
	* eval webpack生成的代码（每个模块彼此分开，并使用模块名称进行注释）, 编译速度快
	* inline 以base64方式将source-map嵌入到代码中，缺点造成编译后代码体积很大
* 推荐使用：
	* 开发环境： cheap-module-eval-source-map
	* 生产环境： cheap-module-source-map
  *inline 将所有map文件都打包
  * eval 将有修改的map文件打包
  * cheap 生成相对小的map文件 只记录行，只影视自定义模块
  * module 映射第三方模块

> 以上就是webpack开发环境的配置，可以在内存中自动打包所有类型文件并有自动编译运行、热更新等功能。

### 16、准备生产环境
* 创建文件夹config，将webpack.config.js复制两份
  * ./config/webpack.dev.js
  * ./config/webpack.prod.js
* 修改webpack.prod.js配置，删除webpack-dev-server配置
  ```
  // / 代表根路径(等价于这个：http://localhost:5000/)，以后项目上线所有路径都以当前网址为根路径出发
  module.exports = {
    output: {
      path: resolve(__dirname, '../build'), // 文件输出目录
      filename: './js/built.js', // 文件输出名称
      publicPath: '/'  // 所有输出资源在引入时的公共路径，若loader中也指定了publicPath，会以loader的为准。
    },
	module: {
	  rules: [
		{
          test: /\.(png|jpg|gif)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 8192, 
              outputPath: 'images', 
              publicPath: '/images',  // 重写publicPath，需要在路径前面加上 /
              name: '[hash:8].[ext]' 
            }
          }
        },	
	  ]
	},
    mode: 'production',  //修改为生产环境
	devtool: 'cheap-module-source-map' // 修改为生产环境的错误提示
	// 删除devServer
  }
  ```
* 修改package.json的指令
  * "start": "webpack-dev-server --config ./config/webpack.dev.js"
  * "dev": "webpack-dev-server --config ./config/webpack.dev.js"
  * "build": "webpack --config ./config/webpack.prod.js"
* 开发环境指令
  * npm start
  * npm run dev
* 生产环境指令
  * npm run build
  * 注意: 生产环境代码需要部署到服务器上才能运行 （serve这个库能帮助我们快速搭建一个静态资源服务器）
    * npm i serve -g  
    * serve -s build -p 5000
  


### 18、提取css成单独文件
* 安装插件
	* npm install mini-css-extract-plugin --save-dev 
* 引入插件
  * const MiniCssExtractPlugin = require("mini-css-extract-plugin");	
* 配置loader
  ```
  {
    test: /\.less$/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      'less-loader',
    ]
  }
  ```
* 配置插件
  ```
  new MiniCssExtractPlugin({
    filename: "css/[name].css",
  })
  ```    
* 运行指令
  * npm run build
  * serve -s build

### 19、添加css兼容
* 安装loader
	* npm install postcss-loader postcss-flexbugs-fixes postcss-preset-env  postcss-normalize autoprefixer --save-dev 
* 配置loader
  ```
  {
    test: /\.less$/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
            require('postcss-normalize')(),
          ],
          sourceMap: true,
        },
      },
      'less-loader',
    ]
  }
* 在postcss.config.js中配置
module.exports={
    plugins:[
        require('autoprefixer')
    ]
}

  
*  添加配置文件: package.json
```
 "browserslist": [
    "defaults",
    "not ie < 8",
    "last 2 versions",
    "> 1%",
    "iOS 7",
    "last 3 iOS versions"
  ],
  ```




### 20、压缩css
* 安装插件 生产环境
	* npm install optimize-css-assets-webpack-plugin terser-webpack-plugin --save-dev 
* 引入插件
  * const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');	
  * const TerserJSPlugin = require('terser-webpack-plugin');
* 配置插件
  ```
   optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  ```
* 运行指令：
  * npm run build
  * serve -s build 
  
### 21、压缩html
* 修改插件配置
  ```
  new HtmlWebpackPlugin({
    template: './src/index.html',
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    }
  })
  ```
* 运行指令：
  * npm run build
  * serve -s dist 
    
> 以上就是webpack生产环境的配置，可以生成打包后的文件。




### 22、拷贝静态文件夹

* npm i copy-webpack-plugin --save-dev
* 配置
```
new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "public/css"),
          to: "css",
        },
      ],
    }),
```

### 23、配置合并
npm i webpack-merge

export default merge(baseConfig, config);
const {merge} = require("webpack-merge");
const baseConfig = require("./webpack.config.base");

### 24、devtool
源文件和打包文件一一映射

在调试时，可以看出报错代码的位置

inline 将所有map文件都打包
eval 将有修改的map文件打包
cheap 生成相对小的map文件 只记录行，只影视自定义模块
module 映射第三方模块


### 打包文件优化
* 兼容性
  ** 兼容低版本浏览器babel postcss
* 减小打包文件
  ** 拆分打包&压缩 单独打包第三方模块JS&压缩JS  抽取css单独打包&压缩css
* 懒加载
  ** 路由懒加载 组件懒加载 import
* Scope Hoisting(作用域提升)
* nginx开启gzip

### code split
单独打包引入时才加载，比一次加载全部，第一次节约时间

  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    //拆分打包文件
    splitChunks:{
      // chunks:'async'//默认值，只对异步加载的模块单独打包
      chunks:"all"//将node_modules 引入的模块和异步加载的模块都拆封单独打包
    },
    //将webpack的内置的模块引导代码单独打包
    runtimeChunk:{
      name:'runtime'
    }
  },

### css split
npm i -D purifycss-webpack purify-css    没使用的css样式不打包
const PurifyCSSPlugin = require('purifycss-webpack');
const glob = require('glob');
new PurifyCSSPlugin({
paths:glob.sync(path.join(__dirname,'../public/*.html'))
}),

但页面应用者么就行，多页面要用数组配置path



### 压缩图片
cnpm install image-webpack-loader --save-dev
将不被base64处理的图片进行压缩处理
{
loader: "image-webpack-loader",
options: { disable: false, }
}


  ### 预加载 
  preload 对同步模块使用
  prefetch 对异步模块使用
  preload 表示用户在当前的浏览中（往往是在当前页面），极有可以可能用到对应资源，提示浏览器要优先获取对应资源
  prefetch 表示用户在接下来的浏览中（例如在下一个页面），有可能用到对应资源，提示浏览器要在闲时获取对应资源
