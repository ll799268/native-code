# 性能优化篇

## 1、九大策略

1、网络层面

* 构建策略：基于构建工具(Webpack/Rollup/Parcer/Esbuild/Vite/Gulp)
  * 该策略主要围绕wbepack做相关处理，同时也是接入最普遍的性能。其他构建工具的处理也是大同小异，可能只是配置上不一致。说道webpack的性能优化，无疑是从`时间层面`和`体积层面`入手
    * 减少打包时间：缩减范围、缓存副本、定向搜索、提前构建、并行构建、可视结构
      * 缩减范围

          ```js
            // include/exclude通常在各大loader里配置，src目录通常作为源码目录
            exprot default {
              module: {
                rules: [
                  {
                    exclude: /node_modules/,
                    include: /src/,
                    test: /\.js$/,
                    use: 'bable-loader'
                  }
                ]
              }
            }
          ```

      * 缓存副本  
          配置cache缓存loader对文件的编译副本，好处是再次编译时只编译修改过的文件。

          ```js
            // 大部分loader/plugin都会提供一个可使用编译缓存的选项，通常包含catch字眼。以babel-loader和eslint-webpack-plugin为例
            import EslintPlugin from 'eslint-webpack-plugin'
            export default {
              module: {
                rules: [
                  {
                    test: /\.js$/,
                    use: [
                      {
                        loader: 'babel-loader',
                        options: { cacheDirectory: true }
                      }
                    ]
                  }
                ]
              },
              plugins: [
                new EslintPlugin({ cache: true })
              ]
            }
          ```

      * 定向搜索  
          配置resolve提高文件的搜索速度，好处是定向指定必须文件路径。若某些第三方库以常规形式引入可能报错或希望程序自动索引特定类型文件都可通过该方式解决

          ```js
            // alias映射模块路径，extensions表明文件后缀，noParse过滤无依赖文件。通常配置alias和extensions就足够
            export default {
              resolve: {
                alias: {
                  '@': AbsPath('src')
                },
                // 引入时可以省略尾缀
                extensions: ['.js', '.vue', 'jsx']
              }
            }
          ```

      * 提前构建(4+ 不推荐使用，因为其版本迭代带来的性能提升足以忽略DllPlug所带来的效益)
      * 并行构建
        * 配置Thread将Loader单线程转换为多线程，好处是释放CPU多核并发的优势。在使用webpack构建项目时会有大量文件需接续和处理，构建过程是计算密集型的操作，随着文件增多会使构建过程变得缓慢
        * 运行在node里的webpack是单线程模型，简单来说就是webpack待处理的任务需一件件处理，不能同一时刻处理多件任务
    * 减少打包体积：分割代码、摇树优化、动态垫片、按需加载、作用提升、压缩资源
      * 分割代码
          分割各个模块代码，提取相同部分代码，好处是减少重复代码的出现频率。v4使用splitChunks替代CommonsChunkPlugin实现代码分割
      * 摇树优化
        * 删除项目中未被引用的代码，好处是移除重复代码和未使用代码。摇树优化首次出现于rollup，是rollup的核心概念
        * 摇树优化只对ESM规范生效，对其他模块规范失效。摇树优化针对静态结构分析，只有import/export才能提供静态的导入/导出功能。因此在编写业务代码时必须使用ESM规范才能让摇树优化移除重复代码和未使用代码
        * 在webpack里只需要将打包环境设置成生产环境就能让摇树优化生效，同时业务代码使用ESM规范编写，使用import导入模块，使用export导出模块

          ```js
            export default {
              mode: 'production'
            }
          ```

      * 动态垫片
        * 通过垫片服务根据UA返回当前浏览器代码垫片，好处是无需将繁重的代码片打包进去。每次构建都配置@bable/preset-env和core-js根据某些需求将Polyfill打包进来，这无疑又为代码体积增加了贡献
        * @babel/preset-env提供的useBuiltIns可按需导入Polyfill
      * 按需加载
        * 将路由页面/触发性功能单独打包为一个文件，使用时才加载，好处是减轻首屏渲染的负担。因为项目功能越多其打包体积越大，导致首屏渲染速度越慢
        * 首屏渲染时只需对应js代码而无需其他js代码，所以可使用按需加载。v4提供模块按需切割加载功能，配合import()可做到首屏渲染减包的效果，从而加快首屏渲染速度。只要当触发某些功能时才会加载当前功能的js代码
        * v4提供魔术注解命名切割模块，若无注解则切割出来的模块无法分辨出属于哪个业务模块，所以一般都是一个业务模块共用一个切割模块的注解名称

          ```js
            const Login = () => import( /* webpackChunkName: 'login' */ '../../views/login')
            const home = () => import( /* webpackChunkName: 'home' */ '../../views/home')
          ```

      * 作用提升
        * 分析模块间依赖关系，把打包好的模块合并到一个函数中，好处是减少函数声明和内存花销。作用提升首次出现于rollup，是rollup的核心概念，后来在v3 里借鉴过来使用
        * 在未开启作用提升前，构建后的代码会存在大量函数闭包。由于模块依赖，通过webpack打包后转换成IIFE，大量函数闭包包裹代码会导致打包体积增大。在运行代码时创建的函数作用域变多，从而导致更大的内存开销
        * 在开启作用提升后，构建后的代码会按照引入顺序放到一个函数作用域里，通过适当重命名某些变量防止变量名冲突，从而减少函数声明和内存花销
        * 在webpack里只需将打包环境设置为生产环境就能让作用域提升生效，或显式设置concatenateModules

          ```js
            export default {
              mode: 'production'
            }
            // 显式设置
            export default {
              optimization: {
                concatenateModules: true
              }
            }
          ```

      * 压缩资源
          压缩HTML/CSS/JS代码，压缩字体/图像/音频/视频，好处是更有效减少打包体积。极致地优化代码都有可能不及优化一个资源文件的体积更有效
        * 针对HTML代码，使用html-webpack-plugin

          ```js
            import HtmlWebpackPlugin from 'html-webpack-plugin'
            export default {
              plugins: [
                new HtmlWebpackPlugin({
                  minify: {
                    collapseWhitespace: true,
                    removeComments: true
                  }
                })
              ]
            }
          ```

        * 针对css/js代码，分别使用以下插件开启压缩功能。其中OptimizeCss基于cssnano封装，Uglifyjs和Terser都是webpack官网插件，同时注意压缩js代码区分ES5和ES6
        * optimize-css-assets-webpack-plugin 压缩CSS代码
        * uglifyjs-webpack-plugin 压缩ES5 版本的JS代码
        * terser-webpack-plugin 压缩ES6 版本的JS代码

           ```js
            import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin'
            import TerserPlugin from 'terser-webpack-plugin'
            import UglifyjsPlugin from 'uglifyjs-webpack-plugin'

            const compressOpts = type => ({
              cache: true, // 缓存文件
              parallel: true, // 并行处理
              [`${type}Options`]: {
                beautify: false,
                compress: { drop_console: true }
              } // 压缩配置
            })

            const compressCss = new OptimizeCssAssetsPlugin({
              cssProcessorOptions: {
                autoprefixer: { remove: false }, // 设置autoprefixer保留过时样式
                safe: true // 避免cssnano重新计算z-index
              }
            })

            const compressJs = USE_ES6 
                ? new TerserPlugin(compressOpts('terser'))
                : new UglifyjsPlugin(compressOpts('uglify'))

            export default {
              optimization: {
                minimizer: [compressCss, compressJs] // 代码压缩
              }
            }
           ```

* 图像策略：基于图像类型(JPG/PNG/SVG/WebP/Base64)
  * 该策略主要围绕图像类型做相关处理，同时也是接入成本较低的性能优化策略。只需做到以下两点即可
    * 图像选型：了解所有图像类型的特点及其何种引用场景最合适
        图像选型一定要知道每种图像类型的体积、质量、兼容、请求、压缩、透明、场景等参数相对值，这样才能迅速做出判断在何种场景使用何种类型的图像
    * 图像压缩：在部署到生产环境前使用工具或脚本对其压缩处理
* 分发策略：基于内容分发网络(CND)
  * 该策略主要围绕内容分发做相关处理，同时也是接入成本较高的性能优化策略
  * 遵循原则：
    * 所有静态资源走CDN：开发阶段确定哪些文件属于静态资源
    * 把静态资源与主页面至于不同域名下：避免请求带上Cookie
* 缓存策略：基于浏览器缓存(强缓存/协商缓存)
  * 该策略主要围绕浏览器缓存做相关处理，同时也使接入成本最低的性能优化策略。其显著减少网络传输所带来的损耗，提升网页访问速度，是一种很值得使用的性能优化策略
  * 遵循原则：
    * 考虑拒绝一切缓存策略：Cache-Control: no-store
    * 考虑资源是否每次向服务器请求：Cache-Control: no-cache
    * 考虑资源是否呗代理服务器缓存：Cache-Control: public/private
    * 考虑资源过期时间：Expires: t/Cache-Control: max-age=t, s-maxage=t
    * 考虑协商缓存：Lase-Modified/Etag
  上述四方面都是一步接一步完成，充满整个项目流程里。构建策略和图像策略处于开发阶段。分发策略和缓存策略处于生产环境，因此在每个阶段都可以检查是否按顺序接入上述策略。通过这种方式就能最大限度增加性能优化场景

2、渲染层面

* CSS策略：基于CSS规则
  * 避免出现超过三层的嵌套规则
  * 避免为ID选择器添加多余选择器
  * 避免使用标签选择器代替类选择器
  * 避免使用通配选择器，只对目标节点声明规则
  * 避免重复匹配重复定义，关注可继承属性
* DOM策略：基于DOM操作
  * 缓存DOM计算属性
  * 避免过多DOM操作
  * 使用DOMFragment缓存批量化DOM操作
* 阻塞策略：基于脚本加载
  * 脚本与DOM/其它脚本的依赖关系很强：对`<script>`设置defer
  * 脚本与DOM/其它脚本的依赖关系不强：对`<script>`设置async
* 回流重绘策略：基于回流重绘
  * 缓存DOM计算属性
  * 使用类合并样式，避免逐条改变样式
  * 使用display控制DOM显隐，将DOM离线化
  
* 异步更新策略：基于异步更新
    在异步任务中修改DOM时把器包装成微任务

## 2、六大指标

* 加载优化：资源在加载时
  * 优化网络
    * 缓存资源
    * 避免重定向
    * 无阻塞加载
      样式在`<head>`尾部使用`<link>`加载，脚本在`<body>`尾部使用异步加载
    * 减少HTTP请求
    * 减少携带Cookie
    * 异步加载第三方资源
  * 压缩文件
    * 压缩代码
    * 压缩图像体积
    * 合并图标成精灵图
    * 使用CSS代替修饰类图像
    * 使用Base64代替小质量图像
    * 使用CDN加载静态资源且可通过参数调整
  * 首屏体验
    * 预解析
      原先解析DNS过去域名对应IP `pre-parse`
    * 预加载
      延后加载无需立即用到的资源，确保使用时已加载 `pre-load`
    * 预渲染
      延后渲染无需打开的页面，确保使用时已渲染 `pre-render`
    * 懒加载
      延后加载无需立即渲染的资源，进入区域时才加载 `lazt-load`
    * 懒执行
      延后执行无需立即处理的逻辑，等到使用时才执行 `lazy-run`
* 执行优化：资源在执行时
  * 避免重置图像尺寸
  * 避免资源标签src为空
  * 避免图像转换DataURL
* 渲染优化：资源在渲染时
  * 设置viewport
  * 减少DOM节点
  * 优化动画
    * 优先使用CSS动画
    * 合理开启GPU加速
    * 合理使用Canvas动画
    * 合理使用requestAnimationFrame代替SetTimeout
  * 优化高频事件
    * 节流Throttle 指定时间内执行的操作被连续触发只执行最先一次
    * 防抖Debounce 指定时间内执行的操作被连续触发只执行最后一次
* 样式优化：样式在编码时
  * 标准化各种浏览器前缀
  * 值为0时不添加任何单位
  * 移除CSS空规则
  * 避免CSS表达式
  * 避免HTML中出现样式
  * 避免选择器看起来像正则
  * 正确使用display
  * 不滥用float
  * 不滥用Web字体
  * 不声明过多font-size
* 脚本优化：脚本在编码时
  * 缓存数组长度
  * 缓存DOM计算属性
  * 避免过多DOM操作
  * 尽量使用ID选择器
  * 尽量使用时间代理
  * 优化Touch事件
* v8引擎优化：针对v8引起特征可做优化
  * 通过Chorme DevTools LightHouse 获取页面性能指标报告
  * 通过Chorme DevTools Performance 获取页面性能瓶颈报告
  * 通过Performance API 获取页面各个阶段精确时间
  * 压缩代码体积/减少嵌套函数减少编译时间
  * 保证函数入参类型一直让V8自动优化代码

## 3、图片预加载

* 使用异步编程方式  
  相当于一个get请求

* 使用脚本实现
  * 只需简单编辑、加载所需图片的路径与名称即可

  ```js
    const images = []
    function preload () {
      for (let i = 0; i < preload.arguments.length; i++) {
        images[i] = new Image()
        images[i].src = preload.arguments[i]
      }
    }
    preload('xx', 'xx')
  ```

* 用css和JavaScript实现预加载

```css
/* 将图片添加到可是区域外 */
#preload-01 { background: url(xx) no-repeat -9999px -9999px; }
```

```js
  // 如果JavaScript无法在用户的浏览器中正常运行，会发生什么？很简单，图片不会被预加载，当页面调用图片时，正常显示即可

  // 获取使用类选择器的元素，设置background属性，以预加载不同的图片
  function preloader () {
    if (document.getElementById) {
      docment.getElementById('preload-01').style.background = 'url(xx) no-repeat -9999px -9999px;'
    }
  }

  // 延迟preloader函数的加载时间，直到页面加载完毕
  function addLoadEvent (func) {
    const oldOnload = window.onload 
    if (typeof window.onload != 'function') {
      window.onload = func
      return
    }

    window.onload = function () {
      oldOnload && oldOnload()
      func()
    }
  }

  addLoadEvent(preloader)
```

## 4、h5秒开方案

* 常用的加速方法  
  通常的web优化方法，基本围绕在资源加载和html渲染两个方面。前者针对首屏，后者针对可交互。资源优化上，我们总的方向是围绕更小的资源包上。比如常见的：压缩、减包、拆包、动态加载包及图片优化上。html渲染上总的方向是更快的展示内容，比如通过cdn分发、dns解析、http缓存、数据项预请求、数据缓存  
* 实践方法
  * 直出 + 离线包缓存  
  为了优化首屏，大部分主流的页面会通过服务器进行渲染，吐出html文件到前端。解决转菊花图比较久的问题。不同类型的主流框架，都会有一套后台渲染方案，比如vue-server-renderer、react-dom/server等。直出省去了前端渲染以及ajax请求的时间，虽然直出能够通过各种缓存策略优化得很好，但加载html仍然需要时间  
  通过离线包技术能够更好的解决html文件本身加载需要时间的问题。离线包基本思路都是通过webview统一拦截url，将资源映射到本地离线包，更新的时候对版本资源检测，下载和维护本地缓存目录中的资源。比如腾讯的webso和Alloykit的离线包方案  
  * 客户端代理的 VasSonic
  * PWA+直出+预加载  
  这里明确两个点，第一次永远只能靠提前加载，所以上面的借助端上预加载脚本仍然生效；第二点非直出页面，每个页面需要有独一无二的标记，比如 hash。浏览器获取到数据，并且渲染好的 html，能够通过 outerHTML 方法，将 html 页面缓存到 cacheStorage 中，第二次访问优先从本地获取，同时发起 html 请求，通过对比其中唯一标识的差异，决定是否需要更新
  * NSR 渲染  
  借助浏览器启动一个JS-Runtime，提前将下载好的html模板及预取得feed流数据进行渲染，然后将html设置到内存级别的MemoryCache中，从而达到点开即看的效果
  * 客户端 PWA
  * 小程序化
* 不管哪种类型的方案，发现其总的思路和方向都是：
  * 在整个链路中减少中间环节。比如将串行改并行，包括小程序内部执行机制
  * 尽可能的预加载、预执行。比如从数据预取，到页面预取渲染等
