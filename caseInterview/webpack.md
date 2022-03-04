## webpack篇

### 1、loader 和 plugins 区别
它们是两个完全不同的东西。loader负责处理源文件，如CSS、jsx文件，一次处理一个文件。而 plugins 并不直接操作单个文件，它直接对整个构建过程起作用。
  * loader 文件、编译转换工具，将模块原内容按照需求转换成新内容
  * plugins webpack的监听器，接受webpack下发的消息通知下发

### 2、图片处理常见的加载器有几种
* file-loader，默认情况下会根据图片生成对应的MD5散列的文件格式。
* url-loader，它类似于file-loader，但是url-loader可以根据自身文件的大小，来决定是否把转化为base64格式的DataUrl单独作为文件，也可以自定义对应的散列文件名。
* image-webpack-loader，提供压缩图片的功能。

### 3、webpack 核心概念
* entry(入口)：构建项目的起点，默认根目录为 ./src
* output(出口)：告诉 webpack 在哪里输出它打包好的代码以及如何命名，默认目录为 ./dist
* modules(模块)：在 webpack 中一切皆为模块，一个文件皆为一个模块。webpack 会从配置的 entry 开始递归找出所有依赖的模块
* chunk(代码块)：一个 chunk 由多个模块组合而成，用于代码合并和切割
* loader(模块转换器)：用于把模块原内容按照需求转换为新内容
* plugin(扩展插件)：在 webpack 构建流程中的特定时机广播出对应事件，插件可以监听这些事件的发生，在特定的时机做对应的事情

### 4、webpack 基本功能
* 代码转换：Typescript 编译成 JavaScript，SASS 转换为 CSS 等等
* 文件优化：压缩 JavaScript、CSS、html 代码，压缩合并图片
* 代码分割：提取多页面的公共代码、提取首屏不需要执行部分的代码让其异步加载
* 模块合并：在采用模块化的项目有很多模块和文件，需要构建功能把模块分类合并成一个文件
* 自动刷新：监听本地源代码的变化，自动构建，刷新浏览器
* 代码校验：在代码提交到仓库前需要检测代码是否规范，以及单元测试是否通过
* 自动发布：更新完代码后，自动构建出线上发布代码并传输给发布系统

### 5、webpack 层面代码优化
* webpack 对图片进行压缩
* 减少 ES6 转为 ES5 的冗余代码
* 提取公共代码
* 模板预编译
* 提取组件的CSS
* 优化 sourceMap
* 构建结果输出分析

### 6、提高 webpack 的构建速度
* 优化 loader 配置
  在使用loader时，可以通过配置 include、exclude、test属性来匹配文件，接触include、exclude规定哪些匹配应用loader
* 优化 resolve.modules
  当安装的第三方模块都放在项目根目录下的 ./node_modules 目录下，所以可以指明存在第三方模块的绝对路径，以减少查询
* 优化 resolve.alias
  通过配置 alias 减少查找过程
* 使用 cache-loader
  在一些性能开销大的 loader 之前添加 cache-loader，以将结果缓存在磁盘里，显著提升二次构建速度
  保存和读取这些缓存文件会有一定时间开销，所以请支队性能开销较大的loader使用
* terser 启动多线程
  使用多进程并行运行来提高构建速度


### 7、webpack proxy
解决跨域的原理：(服务器之前请求数据不会出现跨域行为，跨域行为是浏览器的安全策略限制)
  当本地发送请求的时候，代理服务器响应该请求，并将请求转发到目标服务器
  目标服务器响应数据后再讲数据返回给代理服务器，最终再由代理服务器将数据响应给本地

### 8、热更新
* 刷新分为两种：
  + 一种是页面刷新，不保留页面状态，就是简单粗暴，直接window.location.reload()
  + 另一种是基于WDS(Webpack-dev-server)的模块热替换，只需要局部刷新页面上发生变化的模块，同时可以保留当前的页面状态，如果复选框的选中状态、输入框的输入等
* 原理  
  + webpack-dev-server启动本地服务  
    - 我们根据webpack-dev-server的package.json中的bin命令，可以找到命令的入口文件bin/webpack-dev-server.js  
      + 启动webpack，生成compiler实例。compiler上有很多方法，比如可以启动webpack所有编译工作，一级监听本地文件的变化
      + 使用express框架启动本地server，让浏览器可以请求本地的静态资源
      + 本地server启动之后，再去启动websocket。通过websocket，可以建立本地服务和浏览器的双向通信。这样就可以实现当本地文件发生变化，立马告知浏览器可以热更新代码了
  + 修改webpack.config.js的entry配置  
    - 启动本地服务前，调用了updateCompiler(this.compiler)方法。这个方法中有两段关键性代码。一个是获取websocket客户端代码路径，另一个是根据配置获取webpack热更新代码路径
  + 监听weboack编译结束  
    - 修改好入口配置后，又调用了setupHooks方法。这个方法是用来注册监听事件的，监听每次webpack编译完成
    - 当监听到一次webpack编译结束，就会调用_sendStats方法通过websocket给浏览器发送通知，ok和hash事件，这样浏览器就可以拿到最新的hash值，做检查更新逻辑  
  + webpack监听文件变化  
    - 每次修改代码，就会触发编译。说明我们还需要监听本地的代码变化，主要同过setupDevMiddleware方法实现的、执行了webpack-dev-middleware库
      + 调用了compiler.watch方法。首先对本地文件进行编译打包，也就是webpack的一系列编译流程
      + 其次编译结束后，开启对本地文件的监听，当文件发生变化，重新编译，编译完成后继续监听
      + 执行setFs方法，这个方法的主要目的就是将编译后的文件打包到内存。这就是为什么开发过程中，dist目录没有打包后的代码，因为都在内存中。原因就在于访问内存中的代码比访问文件系统中的文件更快，而且也减少了代码写入文件的开销，这一切都归功于memory-fs
  + 浏览器接收到热更新的通知
    - 我们已经监听到文件的变化了，当文件发生变化时，就会触发重新编译。同时还监听了每次编译结束的事情。当监听到一次webpack编译结束，_sendStats方法就通过websoket给浏览器发送通知，检查下是否需要热更新。
  + HotModuleReplacementPlugin
  + module.hot.check开始热更新
    - 利用上一次保存的hash值，调用hotDownloadManifest发送xxx/hash.hot-update.json的ajax请求
    - 请求结果获取热更新模块，以及下次热更新的Hash标识，并进入热更新准备阶段
    - 调用hotDownloadUpdateChunk发送xxx/hash.hot-update.js请求，通过JSONP方式
      + hotAddUpdateChunk方法会把更新的模块moreModules赋值给全局变量hotUpdate
      + hotUpdateDownloaded方法会调用hotApply进行代码的替换
  + hotApply热更新的模块替换
    - 删除过期的模块，就是需要替换的模块。通过hotUpdate可以找到旧模块
    - 将新的模块添加到modules中
    - 通过__webpack_require__执行相关模块的代码

### 9、插件总结归类
* 功能类
  + html-webpack-plugin 自动生成html
    ```js
      new HtmlWebpackPlugin({
        filename: 'index.html', // 生成文件名
        template: path.join(process.cwd(), './index.html') // 模板文件
      })
    ```
  + copy-webpack-plugin 拷贝资源文件
    ```js
    new CopyWebpackPlugin([
      {
        from: path.join(process.cwd(), './vendor/'),
        to: path.join(process.cwd(), './dist/')
      }
    ])
    ```
  + webpack-mainfest-plugin && assets-webpack-plugin 两个插件效果一致，只是资源单的数据结构不一致而已
    ```js
      module.exports = {
        plugins: [
          new ManifestPlugin()
        ]
      }
      module.exports = {
        plugins: [
          new AssetsPlugin()
        ]
      }
    ```
  + clean-webpack-plugin 在编译之前清理指定目录指定内容
    ```js
      const pathsToClean = ['dist', 'build']
      const cleanOptions = {
        exclude: ['shared.js'] // 跳过文件
      }
      module.exports = {
        plugins: [
          new CleanWebpackPlugin(pathsToClean, cleanOptions)
        ]
      }
    ```
  + compression-webpack-plugin 提供带 Content-Encoding 编码的压缩版的资源
    ```js
      module.exports = {
        plugins: [
          new CompressionPlugin()
        ]
      }
    ```
  + progress-bar-webpack-plugin 编译进度条插件
    ```js
      module.exports = {
        plugins: [
          new ProgressBarPlugin()
        ]
      }
    ```

* 代码相关类
  + webpack.ProvidePlugin 自动加载模块，如$出现，就会自动加载模块；$默认为'jquery'的exports
    ```js
      new webpack.ProvidePlugin({
        $: 'jquery'
      })
    ```
  + webpack.DefinePlugin 定义全局变量
    ```js
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
      })
    ```
  + mini-css-extract-plugin && extract-text-webpack-plugin
  提取css，对比  
    - mini-css-extract-plugin 为 webpack4 及以上提供的plugin，支持css chunk
    - extract-text-webpack-plugin 只能在webpack3及一下的版本使用，不支持css chunk
    ```js
      // 基本用法 mini-css-extract-plugin webpack4及以上
      const MiniCssExtractPlugin = require('mini-css-extract-plugin')
      module.exports = {
        module: {
          rules: [
            {
              test: /\.css$/,
              use: [
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    publicPath: '/' // chunk publicPath
                  }
                },
                'css-loader'
              ]
            }
          ]
        },
        plugins: [
          new MiniCssExtractPlugin({
            filename: '[name].css', // 主文件名
            chunkFilename: '[id].css' // chunk文件名
          })
        ]
      }
      
      // 基本用法 extract-text-webpack-plugin webpack3及以下
      const ExtractTextPlugin = require('extract-text-webpack-plugin')
      module.exports = {
        module: {
          rules: [
            {
              text: /\.css$/,
              use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader'
              })
            }
          ]
        },
        plugin: [
          new ExtractTextPlugin('style.css')
        ]
      }
    ```

* 编译优化结果类
  + webpack.IgnorePlugin 忽略regExp匹配的模块
    ```js
      new webpack.IgnorePlugin(/^\.\/locale/, /moment$/)
    ```
  + uglifyjs-webpack-plugin 代码丑化，用于js压缩
    ```js
      module.exports = {
        optimization: {
          minimizer: [
            new UglifyJsPlugin({
              cache: true, // 开启缓存
              parallel: true, // 开启多线程编译
              sourceMap: true, // 是否sourceMap
              uglifyOptions: {  // 丑化参数
                comments: false,
                warnings: false,
                compress: {
                  unused: true,
                  dead_code: true,
                  collapse_vars: true,
                  reduce_vars: true
                },
                output: {
                  comments: false
                }
              }
            })
          ]
        }
      }
    ```
  + optimize-css-assets-webpack-plugin css压缩，主要使用 cssnano 压缩器
    ```js
      module.exports = {
        optimization: {
          minimizer: [new OptimizeCssAssetsPlugin({
            cssProcessor: require('cssnano'),   // css 压缩优化器
            cssProcessorOptions: { discardComments: { removeAll: true } } // 去除所有注释
          })]
        }
      }
    ```
  + webpack-md5-hash 使你的chunk根据内容生成md5，用这个md5取代 webpack chunkhash。
    ```js
      const WebpackMd5Hash = require('webpack-md5-hash')
      module.exports = {
        output: {
          chunkFilename: "[chunkhash].[id].chunk.js"
        },
        plugins: [
          new WebpackMd5Hash()
        ]
      }
    ```
  + SplitChunksPlugin  
    CommonChunkPlugin 的后世，用于chunk切割。  
    webpack 把 chunk 分为两种类型，一种是初始加载initial chunk，另外一种是异步加载 async chunk，如果不配置SplitChunksPlugin，webpack会在production的模式下自动开启，默认情况下，webpack会将 node_modules 下的所有模块定义为异步加载模块，并分析你的 entry、动态加载（import()、require.ensure）模块，找出这些模块之间共用的node_modules下的模块，并将这些模块提取到单独的chunk中，在需要的时候异步加载到页面当中，其中默认配置如下：  
    ```js
      module.exports = {
        optimization: {
          splitChunks: {
            chunks: 'async', // 异步加载chunk
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~', // 文件名中chunk分隔符
            name: true,
            cacheGroups: {
              vendors: {
                test: /[\\/]node_modules[\\/]/,  // 
                priority: -10
              },
              default: {
                minChunks: 2,  // 最小的共享chunk数
                priority: -20,
                reuseExistingChunk: true
              }
            }
          }
        }
      }
    ```
  
* 编译优化类
  + DllPlugin && DllReferencePlugin && autodll-webpack-plugin
    DllPlugin将模块预先编译，DllReferencePlugin将预先编译好的模块关联到当前编译中，当webpack解析到这些模块时，会直接使用预先编译好的模块
    autodll-webpack-plugin相当于DllPlugin和DllReferencePlugin的简化版，其实本质也是使用DllPlugin和DllReferencePlugin，它会在第一次编译的时候将配置好的需要预先编译的模块编译在缓存中，第二次编译的时候，解析到这些模块就直接缓存，而不是去编译这些模块
    ```js
      // dllPlugin 基本用法
      module.exports = {
        entry: {
          vendor: ['react', 'react-dom']  // 我们需要事先编译的模块，用entry表示
        },
        output: {
          filename: '[name].js',
          library: '[name]_library',
          path: './vendor/'
        },
        plugins: [
          new webpack.DllPlugin({  // 使用dllPlugin
            path: path.join(output.path, `${output.filename}.json`),
            name: output.library // 全局变量名， 也就是 window 下 的 [output.library]
          })
        ]
      }

      // DllReferencePlugin 基本用法
      module.exports = {
        plugins: [
          new webpack.DllReferencePlugin({
            manifest: require(path.resolve(process.cwd(), 'vendor', 'vendor.js.json')), // 引进dllPlugin编译的json文件
            name: 'vendor_library' // 全局变量名，与dllPlugin声明的一致
          }
        ]
      }

      // autodll-webpack-plugin 基本用法
      module.exports = {
        plugins: [
          new AutoDllPlugin({
            inject: true, // 与 html-webpack-plugin 结合使用，注入html中
            filename: '[name].js',
            entry: {
              vendor: [
                'react',
                'react-dom'
              ]
            }
          })
        ]
      }
    ```
  + happypack && thread-loader 
    多线程编译，加快编译速度，thread-loader不可以和mini-css-extract-plugin 结合使用
    ```js
      // happypack 基本用法
      const HappyPack = require('happypack')
      const os = require('os')
      module.exports = {
        module: {
          rules: [{
            test: /\.jsx?$/,
            loader: 'happypack/loader',
            query: {
              id: happyLoaderId
            },
            include: [path.resolve(process.cwd(), 'src')]
          }]
        },
        plugins: [new HappyPack({
          id: 'happypack-for-react-babel-loader',
          threadPool: HappyPack.ThreadPool({ size: os.cpus().length }),
          loaders: ['babel-loader']
        })]
      }

      // thread-loader 基本用法
      module.exports = {
        module: {
          rules: [
            {
              test: /\.js$/,
              include: path.resolve("src"),
              use: [
                "thread-loader",
                // your expensive loader (e.g babel-loader)
                "babel-loader"
              ]
            }
          ]
        }
      }
    ```
  + hard-source-webpack-plugin && cache-loader 使用模块编译缓存，加快编译速度
    ```js
      // hard-source-webpack-plugin 基本用法
      module.exports = {
        plugins: [
          new HardSourceWebpackPlugin()
        ]
      }

      // cache-loader 基本用法
      module.exports = {
        module: {
          rules: [
            {
              test: /\.ext$/,
              use: [
                'cache-loader'
              ],
              include: path.resolve('src')
            }
          ]
        }
      }
    ```

* 编译分析类
  + webpack-bundle-analyzer 编译
    ```js
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 8889,
        reportFilename: 'report.html',
        defaultSizes: 'parsed',
        generateStatsFile: false,
        statsFilename: 'stats.json',
        statsOptions: null,
        logLevel: 'info'
      })
    ```
  + speed-measure-webpack-plugin 统计编译过程中，各loader和plugin使用的时间
    ```js
      const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
      const smp = new SpeedMeasurePlugin()
      
      const webpackConfig = {
        plugins: [
          new MyPlugin(),
          new MyOtherPlugin()
        ]
      }
      module.exports = smp.wrap(webpackConfig)
    ```