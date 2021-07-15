# 知识点整理

## native js

### 1、判断引用数据类型方法（内置API、对象的toString方法、原型）
``` js
  * xx instanceof Type
  * Object.prototype.toString.call(xx) === '[object Type]'
  * xx.__proto__ === Type.prototype
  * xx.constructor === Type
```

### 2、闭包
```
  概念：
    函数在执行的时候会放到一个执行栈上执行，当函数执行完毕之后会在执行栈上移除
    但是由于堆上的成员因为被外部引用不能释放
    因此内部函数依然可以访问外部函数的成员
  缺点：内存消耗很大，容易导致内存泄漏
```

### 3、http 状态码
```
  * 100 Continue表示继续，一般在发送post请求时，已发送了 HTTP header之后，服务器端将返回此信息，表示确认，之后发送具体参数信息。
  * 200 OK表示正常返回信息。
  * 201 Created表示请求成功并且服务器创建了新的资源。
  * 202 Accepted表示服务器已接受请求，但尚未处理。
  * 301 Moved Permanently表示请求的网页已永久移动到新位置。
  * 302 Found表示临时性重定向。
  * 303 See Other表示临时性重定向，且总是使用GET请求新的URI。
  * 304 Not Modified表示自从上次请求后，请求的网页未修改过。
  * 400 Bad Request表示服务器无法理解请求的格式，客户端不应当尝试再次使用相同的内容发起请求。
  * 401 Unauthorized表示请求未授权。
  * 403 Forbidden表示禁止访问。
  * 404 Not Found表示找不到如何与URI相匹配的资源。
  * 500 Internal Server error表示最常见的服务器端错误。
  * 503 Service Unavailable表示服务器端暂时无法处理请求（可能是过载或维护）。
```

### 4、设计模式
```
  创建型模式(5)，工厂方法模式、抽象工厂模式、单例模式、建造者模式、原型模式
  结构型模式(7)，适配器模式、装饰器模式、代理模式、外观模式桥接模式、组合模式、享元模式
  行为型模式(11)，策略模式、模板方法模式、观察者模式、选代子模式、責任链模式、命令模式、备忘录模式、状态模式、访问者模式、中介者模式、解释器模式

  * 单例模式 （singleton 挂在window执行, 用来减少重复创建对象）
  * 工厂模式（factory 用来解耦）
  * 观察者模式 （observer 用来收发消息）
  * 策略模式（strategy 用来定义算法）

  * 发布者订阅模式（vue）
  * 装饰器模式（骨架 -> 装修）
  * 建造者模式（建造者模式主要用于“分步骤构建一个复杂的对象”，在这其中“分步骤”是一个稳定的算法，而复杂对象的各个部分则经常变化，其优点是：建造者模式的“加工工艺”是暴露的，这样使得建造者模式更加灵活，并且建造者模式解耦了组装过程和创建具体部件，使得我们不用去关心每个部件是如何组装的。）
```

### 5、栈和堆的区别
```
  * 栈（stack）区由编译器自动分配和释放，存放函数的参数值、局部变量的值等。
  堆（heap）区一般由程序员分配和释放，若程序员不释放，程序结束时可能由OS回收。

  * 堆（数据结构）可以被看成一棵树，如堆排序。
  栈（数据结构）是一种先进后出的数据结构。

```

### 6、输入 url 发生了什么
```
  1、DNS域名解析
    客户端收到你输入的域名地址后，它首先去找本地的hosts文件，检查在该文件中是否有相应的域名、IP对应关系，如果有，则向其IP地址发送请求
    如果没有，再去找DNS服务器。
  2、建立TCP连接（三次握手）
    TCP提供了一种可靠、面向连接、字节流、传输层的服务。对于客户端与服务器的TCP链接，必然要说的就是『三次握手』。“3次握手”的作用就是双方都能明确自己和对方的收、发能力是正常的。
    客户端发送一个带有SYN标志的数据包给服务端，服务端收到后，回传一个带有SYN/ACK标志的数据包以示传达确认信息，最后客户端再回传一个带ACK标志的数据包，代表握手结束，连接成功。
    SYN —— 用于初如化一个连接的序列号。
    ACK —— 确认，使得确认号有效。
    RST —— 重置连接。
    FIN —— 该报文段的发送方已经结束向对方发送数据。
  3、发送HTTP请求
  4、服务器处理请求
  5、返回响应结果
  6、关闭TCP连接（四次挥手）
  7、浏览器解析HTML
    浏览器通过解析HTML，生成DOM树，解析CSS，生成CSSOM树，然后通过DOM树和CSSPOM树生成渲染树。渲染树与DOM树不同，渲染树中并没有head、display为none等不必显示的节点。
  8、浏览器布局渲染
    根据渲染树布局，计算CSS样式，即每个节点在页面中的大小和位置等几何信息。HTML默认是流式布局的，CSS和js会打破这种布局，改变DOM的外观样式以及大小和位置。最后浏览器绘制各个节点，将页面展示给用户。
    
    replaint：屏幕的一部分重画，不影响整体布局，比如某个CSS的背景色变了，但元素的几何尺寸和位置不变。
    reflow：意味着元素的几何尺寸变了，需要重新计算渲染树。
```

### 7、宏任务、微任务
```
  1、宏任务：宏任务可以被理解为每次"执行栈"中所执行的代码，而浏览器会在每次宏任务执行结束后，在下一个宏任务执行开始前，对页面进行渲染，而宏任务包括：
    script(整体代码)
    setTimeout
    setInterval
    I/O
    UI交互事件
    postMessage
    MessageChannel
    setImmediate
    UI rendering
  2、微任务,可以理解是在当前"执行栈"中的任务执行结束后立即执行的任务。而且早于页面渲染和取任务队列中的任务。微任务包括：
    Promise.then
    Object.observe
    MutaionObserver
    process.nextTick

  执行机制：
    执行一个宏任务（栈中没有就从事件队列中获取）
    执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
    宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
    当前宏任务执行完毕，开始检查渲染，然后GUI线程接管渲染
    渲染完毕后，js线程继续接管，开始下一个宏任务（从事件队列中获取）
```

### 8、web 基础技术的优化
```
  * 开启 gzip 压缩
  * 浏览器缓存
  * CND 使用
  * 使用 Chorme Performance 查找性能瓶颈
```
## vue

### 1、双向绑定的实现原理
```
  Observer(观察者)对初始数据通过Object.defineProperty添加setter、getter，
  当取数据（即调用get）的时候添加订阅对象（wachter）到数组里，
  当给数据赋值（即调用set）的时候就能知道数据的变化，
  此时调用发布订阅中心，从而遍历当前数据的订阅数组，执行里面所有的watcher，通知变化
```

### 2、vue2中defineProperty 和 vue3中proxy区别
```
  defineProperty 
  缺点： 1、无法监听数组的变化
        2、修改属性值的时候需要遍历对象再修改
  proxy
  优点： 1、可以直接监听数组的变化
        2、返回的是一个新对象，可以操作新的对象达到目的
  缺点：兼容性问题 
```

### 3、vue中的directive
```
  生命周期：
  bind函数：只调用一次，指令第一次绑定在元素上调用，即初始化调用一次，
  inserted函数：并绑定元素插入父级元素（即new vue中el绑定的元素）时调用（此时父级元素不一定转化为了dom）
  update函数：在元素发生更新时就会调用，可以通过比较新旧的值来进行逻辑处理
  componentUpdated函数：元素更新完成后触发一次
  unbind函数：在元素所在的模板删除的时候就触发一次

  钩子函数对应的参数el, binding, vnode, oldnode, 具体参数讲解如下：
  a、el指令所绑定的元素 可以直接操组dom元素
  b、binding一个对象，具体包括以下属性：
    1）name：定义的指令名称 不包括v-
    2）value：指令的绑定值，如果绑定的是一个计算式，value为对应计算结果
    3）oldvalue：指令绑定元素的前一个值，只对update和componentUpdated钩子函数有值
    4）expression：指令绑定的原始值 不对值进行任何加工
    5）arg：传递给指令的参数
    6）modifiers：指令修饰符，如：v-focus.show.async 则接收的modifiers为｛ show：true，async：true ｝
  c、vnode：vue编译生成的虚拟dom
  d、oldVnode：上一个vnode，只在update和componentUpdated钩子函数中有效
```

### 4、keep-alive
``` 
  第一次进入，钩子的触发顺序: created-> mounted-> activated
  当再次进入（前进或者后退）时，只触发activated事件挂载的方法等
  只执行一次的放在 mounted 中；组件每次进去执行的方法放在 activated 中
    1）include - 字符串或正则表达式，只有名称匹配的组件会被缓存
    2）exclude - 字符串或正则表达式，任何名称匹配的组件都不会被缓存
    3）include 和 exclude 的属性允许组件有条件地缓存。二者都可以用“，”分隔字符串、正则表达式、数组。当使用正则或者是数组时，要记得使用v-bind
```

### 5、vue-router
```
  1、路由守卫钩子
    全局守卫
      * beforeEach(to, from, next)
      * afterEach(to, from, next)
    局部守卫
      * beforeRouteEnter(to, from, next)
      * beforeRouteUpdate(to, from, next)
      * beforeRouteLeave(to, from, next)
  2、路由原理
    hash模式（hashchange）
      url 改变的时候 会触发 hashchange 事件
    history模式（popstate）
      通过浏览器前进后退改变 URL 时会触发 popstate 事件
      通过pushState、replaceState、<a>标签改变 URL 不会触发 popstate 事件。
      好在我们可以拦截 pushState、replaceState的调用和<a>标签的点击事件来检测 URL 变化
      通过js 调用history的back，go，forward方法课触发该事件

```

### 6、vuex
```
  1、概念
    vuex 是一个专为 Vue.js 应用程序开发的状态管理模式
  2、核心概念
    * 五大属性：state, getter, mutation, action, module
      state: 存储数据、状态，在根实例注册了store, 用 this.$store.state 来访问
      getter: 计算状态属性，返回值会被缓存起来，当它的依赖发生变化会重新计算
      mutation: 更改 state 中的唯一方法
      action: 包含任意的异步操作，提交 mutation 改变状态，而不是直接改变状态
      module: 将 store 分割成模块，每个模块都有state、getter、mutation、action 甚至是嵌套子模块
  3、流程
      dispath    commit
  action => mutation => state
  4、持久化工具
    vuex-persistedstate
``` 

### 7、v-for 和 v-if 优先级
```
  2.x 版本中在一个元素上同时使用 v-if 和 v-for 时，v-for 会优先作用
  3.x 版本中 v-if 总是优先于 v-for 生效
  迁移策略
    由于语法上存在歧义，建议避免在同一元素上同时使用两者。
    比起在模板层面管理相关逻辑，更好的办法是通过创建计算属性筛选出列表，并以此创建可见元素
```

### 8、Vue.nextTick
```
  在下次 DOM 更新循环结束之后执行延迟回调
  在修改数据之后立即使用这个方法，获取更新后的 DOM
```

### 9、vue 项目的优化（代码层面的优化）
```
  * v-if 和 v-show 区分使用场景
  * computed 和 watch 区分使用场景
  * v-for 遍历必须为 item 添加 key，同时避免使用 v-if
  * 长列表的性能优化
  * 事件的销毁
  * 图片资源懒加载
  * 路由懒加载
  * 第三方插件按需加载
  * 优化无限列表性能
  * 服务端渲染 SSR 或者预加载
```

### 10、computed 和 watch 的区别和运用的场景
```
  区别：
    computed 计算属性，依赖 data 属性值，有缓存的。只有他的依赖属性值发生改变，下一次获取的值会重新计算
    watch 观察作用，类似于某些数据的监听回调，每当监听的数据发生改变会执行后续操作
  运用场景： 
    computed 当我们需要进行数值计算，并且依赖于其他数据时，应该使用computed 因为可以利用缓存机制，避免每次获取值时，都需要重新计算
    watch 当我们需要数据变化时执行异步或者开销较大的操作时候，应该使用它
      使用它选项允许我们执行异步操作，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。
```

## react

### 1、hook钩子函数
```
  1、useState hook
    * 让函数组件也可以有state状态，并进行状态数据的读写操作
    * 语法 const [data, setData] = useState(defaultVal)
    * useState（）说明
        参数：第一次初始化指定的值在内部做缓存
        返回值：包含2个元素的数组，第一个为内部当前状态值，第二个为更新状态值的函数
    * setData（）两种写法
      setData（newValue）：参数为非函数组值，直接指定新的状态值，内部用其覆盖原来的状态值
      setData（value => newValue）：参数作为函数，接受原本的状态值，返回新的状态值，内部用其覆盖原来的值

  2、useEffect hook
    * 可以让你在函数组件中执行副作用（用于模拟生命周期的钩子）
    * react中的副作用操作：
        发送请求数据的获取
        设置订阅、启动定时器
        手动更改真实DOM
    * 语法和说明：
      useEffect(() => {
        在此可操作性任何带副作用的操作
        return () => { 在组件卸载前执行
          在此做一些收尾性的工作，取消订阅、清定时器
        }
      }, [stateValue]) 如果指定是[]，回调函数只会在第一次render后执行
    * 可以把useEffect Hook 看做是如下三个函数的结合
      componentDidMount()
      componentDidUpdate()
      componentWillUnmount()

  3、useRef hook
    * 可以在函数组件中存储、查找组件内的标签或任意其他类型
    * 语法 const refDom = useRef() <input ref={ refDom } /> 
    * 使用 保存标签对象，功能和React.createRef()一样
```

## 移动端

## webpack

### 1、loader和plugins 区别
```
  它们是两个完全不同的东西。loader负责处理源文件，如CSS、jsx文件，一次处理一个文件。而 plugins并不直接操作单个文件，它直接对整个构建过程起作用。
  loader 文件、编译转换工具
  plugins webpack的监听器，接受webpack下发的消息通知下发
```

### 2、图片处理常见的加载器有几种
```
  * file-loader，默认情况下会根据图片生成对应的MD5散列的文件格式。
  * url-loader，它类似于file-loader，但是url-loader可以根据自身文件的大小，来决定是否把转化为base64格式的DataUrl单独作为文件，也可以自定义对应的散列文件名。
  * image-webpack-loader，提供压缩图片的功能。
```

### 3、webpack 层面代码优化
```
  * webpack 对图片进行压缩
  * 减少 ES6 转为 ES5 的冗余代码
  * 提取公共代码
  * 模板预编译
  * 提取组件的CSS
  * 优化 sourceMap
  * 构建结果输出分析
```

## 库
```
  * lodash 内置方法库
    https://lodash.com/docs/4.17.15
```

## 安全
```
  1、XSS攻击的防范
    * HttpOnly 防止劫取 Cookie
    * 输入检查-不要相信用户的所有输入
    * 输出检查-存的时候转义或者编码

  2、CSRF攻击的防范
    * 验证码
    * Referer Check
    * 添加token验证
```