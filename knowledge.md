## js相关
### 1、typeof
`typeof`返回一个字符串，表示该操作值得数据类型。可能返回的类型字符串有：`string`、`bollean`、`number`、`bigint`、`symbol`、`undefined`、`function`、`object`

### 2、BigInt
`BigInt` 是一种内置对象，他提供了一种方法来表示大于`2n*53-1`的整数
* BigInt 能使用运算符+、*、-、**和%
* 除`>>>`(无符号右移)之外的位操作也可以支持。因为BigInt是有符号的
* BigInt 不支持单目运算符，会报类型错误
* 不能对BigInt使用Math对象中的方法
* BigInt 不能与 Number数字进行混合运算，否则，将抛出TypeError
* 在将BigInt转换为Bollean时，它的行为类似于Number数字
* BigInt变量在转换为Number变量时可能会丢失精度
* typeof操作时返回BigInt
* 使用 Object、String等内置对象转换时，类似于Number数字
* BigInt使用/除操作时，带小数的运算会被取整
* Number 和 BigInt 可以进行比较，非严格相等
* JSON.stringify处理BigInt会引发类型错误

### 3、处理对象的实用函数
* 使用`Object.freeze/Object.isFrozen`来冻结和检测对象的应用程序
* `Object.keys/Object.vaules/Object.entries`在新数组中提取对象的所有属性
* `Object.create/Object.getPrototypeOf` 可以创建一个继承自现有原型的对象，然后使用另一个实用程序函数来检查给定对象的原型
* 使用`Object.entries`和`Object.fromEntries`将对象转换为`[key, value]`对数组
* `Object.assign`帮助我们克隆对象或将多个对象的属性复制到一个新对象中
* `Object.defineProperty`修改现有属性或定义新属性，它主要用于更改属性描述符

## 性能优化
### 1、图片预加载
+ 使用异步编程方式  
  相当于一个get请求
+ 使用脚本实现
  - 只需简单编辑、加载所需图片的路径与名称即可
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
+ 用css和JavaScript实现预加载 
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

### 2、h5秒开方案
* 常用的加速方法  
  通常的web优化方法，基本围绕在资源加载和html渲染两个方面。前者针对首屏，后者针对可交互。资源优化上，我们总的方向是围绕更小的资源包上。比如常见的：压缩、减包、拆包、动态加载包及图片优化上。html渲染上总的方向是更快的展示内容，比如通过cdn分发、dns解析、http缓存、数据项预请求、数据缓存  
* 实践方法 
  + 直出 + 离线包缓存  
  为了优化首屏，大部分主流的页面会通过服务器进行渲染，吐出html文件到前端。解决转菊花图比较久的问题。不同类型的主流框架，都会有一套后台渲染方案，比如vue-server-renderer、react-dom/server等。直出省去了前端渲染以及ajax请求的时间，虽然直出能够通过各种缓存策略优化得很好，但加载html仍然需要时间  
  通过离线包技术能够更好的解决html文件本身加载需要时间的问题。离线包基本思路都是通过webview统一拦截url，将资源映射到本地离线包，更新的时候对版本资源检测，下载和维护本地缓存目录中的资源。比如腾讯的webso和Alloykit的离线包方案  
  + 客户端代理的 VasSonic
  + PWA+直出+预加载  
  这里明确两个点，第一次永远只能靠提前加载，所以上面的借助端上预加载脚本仍然生效；第二点非直出页面，每个页面需要有独一无二的标记，比如 hash。浏览器获取到数据，并且渲染好的 html，能够通过 outerHTML 方法，将 html 页面缓存到 cacheStorage 中，第二次访问优先从本地获取，同时发起 html 请求，通过对比其中唯一标识的差异，决定是否需要更新
  + NSR 渲染  
  借助浏览器启动一个JS-Runtime，提前将下载好的html模板及预取得feed流数据进行渲染，然后将html设置到内存级别的MemoryCache中，从而达到点开即看的效果
  + 客户端 PWA
  + 小程序化
* 不管哪种类型的方案，发现其总的思路和方向都是：
  + 在整个链路中减少中间环节。比如将串行改并行，包括小程序内部执行机制
  + 尽可能的预加载、预执行。比如从数据预取，到页面预取渲染等