## router路由篇

### 1、概念
路由就是通过互联的网络把信息源地址传输到目的地址的活动。路由发生在OSI网略参考模型中的第三层。路由引导分组转送，经过一些中间的节点后，到它们最后的目的地。做成硬件的话，则称为路由器。路由通常根据路由表一个个存储到各个目的地的最佳路劲的表来引导分组转送

### 2、History相关
* 属性值：  
  + `length`：返回浏览器历史列表中URL数量
  + `scrollRestoration`：滚动条恢复属性允许web应用程序在历史导航上显示地设置默认滚动恢复行为
    - 该属性有两个可选值
      + 默认为auto，将恢复用户已滚动到的页面上的位置
      - manual，不还原页上的位置，用户必须手动滚动到该位置
  + state：返回一个表示历史堆栈顶部的状态的值，这是一种可以不必等待popstate事件而查看状态的方式
* 方法：
  + `history.pushState(object, title, url)`方法接受三个参数，`object`为随着状态保存的一个对象，`title`为新页面的标题，`url`为新的网址
  + `replaceState(object, title, url)`与`pushState`的唯一区别在于该方法是替换掉history栈顶元素
  + `history.go(x)`去到对应的url历史记录
  + `history.back()`相当于浏览器的后退按钮
  + `history.forward()`相当于浏览器的前进按钮
* 特性
  + 不可变的对象，不能重写
  + 页面栈最多为50条
  + pushState和location.href的区别：
    - 使用location.href跳转页面会发起新的文档请求，而history.pushState不会
    - location.href可跳转到其他域名，而history.pushState不能
    - location.href与history.pushState都会往历史列表中添加一条记录
  + popstate事件的触发条件
    - 因为location.href和history.go(0)是刷新页面的跳转，所以不会触发
    - history.pushState、history.replaceState不会触发
    - location.hash、history.back、history.go、history.forward触发
* 单页应用  
    history最常见的使用就是搭建前端单页应用。使用`history.pushState`方法可以改变地址栏的路径而不用刷新页面，所以这使得我们只需要在第一次进入页面的时候去请求一次html，后续的页面呈现规则由js来控制，根据不同url路径来加载不同的js模块。使用history路由需要注意额是服务器需要做好处理URL的准备，因为当用户在url为`'/a/b/c'`的页面进行刷新操作，服务器很有可能因为匹配不到路径而返回404状态码，应当对这样的路径也都返回html文件