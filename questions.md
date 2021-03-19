# 知识点整理

## native js

### 1、判断引用数据类型方法（内置PAI、对象的toString方法、原型链）
```
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

### 5、方法重载（ Overload）与方法重写（ Override）的区别
```
  方法重载属于编译时的多态，根据传递的参数不同，执行不同的业务逻辑，得到不同的结果。
  方法重写属于运行时的多态，子类原型指向父类原型，子类重写父类的方法，在调用子类方法的时候使用子类的方法，从而重写父类中定义的方法。
```

### 6、网站安全
```
  * XSS 攻击指的是跨站脚本攻击，是一种代码注入攻击。攻击者通过在网站注入恶意脚本，使之在用户的浏览器上运行，从而盗取用户的信息如 cookie 等
    预防：
    1）存入数据库的数据都进行的转义处理
    2）对服务端输出进行转义
    3）使用HttpOnly Cookie：将重要的cookie标记为httponly，这样就无法使用js代码获取cookie。
  * CSRF 攻击指的是跨站请求伪造攻击，攻击者诱导用户进入一个第三方网站，然后该网站向被攻击网站发送跨站请求。
   预防：
    1）第一种是同源检测的方法，服务器根据 http 请求头中 origin 或者 referer 信息来判断请求是否为允许访问的站点，从而对请求进行过滤。当 origin 或者 referer 信息都不存在的时候，直接阻止。这种方式的缺点是有些情况下 referer 可以被伪造。还有就是我们这种方法同时把搜索引擎的链接也给屏蔽了，所以一般网站会允许搜索引擎的页面请求，但是相应的页面请求这种请求方式也可能被攻击者给利用。
    2）第二种方法是使用 CSRF Token 来进行验证，服务器向用户返回一个随机数 Token ，当网站再次发起请求时，在请求参数中加入服务器端返回的 token ，然后服务器对这个 token 进行验证。这种方法解决了使用 cookie 单一验证方式时，可能会被冒用的问题，但是这种方法存在一个缺点就是，我们需要给网站中的所有请求都添加上这个 token，操作比较繁琐。还有一个问题是一般不会只有一台网站服务器，如果我们的请求经过负载平衡转移到了其他的服务器，但是这个服务器的 session 中没有保留这个 token 的话，就没有办法验证了。这种情况我们可以通过改变 token 的构建方式来解决。
    3）第三种方式使用双重 Cookie 验证的办法，服务器在用户访问网站页面时，向请求域名注入一个Cookie，内容为随机字符串，然后当用户再次向服务器发送请求的时候，从 cookie 中取出这个字符串，添加到 URL 参数中，然后服务器通过对 cookie 中的数据和参数中的数据进行比较，来进行验证。使用这种方式是利用了攻击者只能利用 cookie，但是不能访问获取 cookie 的特点。并且这种方法比 CSRF Token 的方法更加方便，并且不涉及到分布式访问的问题。这种方法的缺点是如果网站存在 XSS 漏洞的，那么这种方式会失效。同时这种方式不能做到子域名的隔离。
    4）第四种方式是使用在设置 cookie 属性的时候设置 Samesite ，限制 cookie 不能作为被第三方使用，从而可以避免被攻击者利用。Samesite 一共有两种模式，一种是严格模式，在严格模式下 cookie 在任何情况下都不可能作为第三方 Cookie 使用，在宽松模式下，cookie 可以被请求是 GET 请求，且会发生页面跳转的请求所使用。
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
  proty
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

### 4、vue-router
```
  全局守卫
  1、beforeEach(to, from, next)
  1、afterEach(to, from, next)
  局部守卫
  1、beforeRouteEnter(to, from, next)
  1、beforeRouteUpdate(to, from, next)
  1、beforeRouteLeave(to, from, next)
```

### 5、keep-alive
```
  第一次进入，钩子的触发顺序:created-> mounted-> activated
  当再次进入（前进或者后退）时，只触发activated事件挂载的方法等
  只执行一次的放在 mounted 中；组件每次进去执行的方法放在 activated 中
    1）include - 字符串或正则表达式，只有名称匹配的组件会被缓存
    2）exclude - 字符串或正则表达式，任何名称匹配的组件都不会被缓存
    3）include 和 exclude 的属性允许组件有条件地缓存。二者都可以用“，”分隔字符串、正则表达式、数组。当使用正则或者是数组时，要记得使用v-bind 。
```

## 移动端

### 1、点击穿透
```
  * 蒙层出现时：
    1）底部任然可以滚动
    2）点击会触发蒙层下面的元素监听事件
  * 解决方案
    1）全部使用`touch`事件
    2）添加 pointer-events:none样式
    3）轻触〔tap）后延迟350ms再隐藏蒙层 蒙层消失会变慢
```

## webpack

### 1、常用的工具或者插件
```
  *  HtmlWebpackPlugin：依据一个HTML模板，生成HTML文件，并将打包后的资源文件自动引入。
  *  commonsChunkPlugin：抽取公共模块，减小包占用的内存空间，例如vue的源码、 jQuery的源码等。
  *  css-loader：解析CSS文件依赖，在 JavaScript中通过 require方式引入CSS文件。
  *  style-loader.：通过 style标签引入CSS。
  *  extract-text-webpack- plugin：将样式抽取成单独的文件。
  *  url-loader：实现图片文字等资源的打包，limit选项定义大小限制，如果小于该限制，则打包成base64编码格式；如果大于该限制，就使用file-loader去打包成图片。
  *  hostess：实现浏览器兼容。
  *  babel：将 JavaScript未来版本（ EMAScript6、 EMAScript2016等）转换成当前浏览器支持的版本。
  *  hot module replacement：修改代码后，自动刷新、实时预览修改后的效果
  *  ugliifyJsPlugin：压缩 JavaScript代码。
```

### 2、loader和plugins 区别
```
  它们是两个完全不同的东西。loader负责处理源文件，如CSS、jsx文件，一次处理一个文件。而 plugins并不直接操作单个文件，它直接对整个构建过程起作用。
  loader 文件、编译转换工具
  plugins webpack的监听器，接受webpack下发的消息通知下发
```

### 3、图片处理常见的加载器有几种
```
  * file-loader，默认情况下会根据图片生成对应的MD5散列的文件格式。
  * url-loader，它类似于file-loader，但是url-loader可以根据自身文件的大小，来决定是否把转化为base64格式的DataUrl单独作为文件，也可以自定义对应的散列文件名。
  * image-webpack-loader，提供压缩图片的功能。
```