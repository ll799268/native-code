## HTML相关
### 1、一些低调的HTML属性
* input:type=accept 会限制上传图片的类型
* img:onerror onerror="this.src=xx"
* div tabindex属性
  + tabindex属性 代表着元素是否会被聚焦
  + tabindex属性也可以代表tab键导航的顺序
  + tabinde="-1" 代表元素可以被聚焦，但是不能在tab键可访问的范围里，这对于构建无障碍的功能很有用
  + 尽量不要用大于0的tabindex，这可能会使得依赖辅助技术的人们无法操作页面
  + 如果为`<div>`也设置了tabindex，其子节点若没有设置tabindex，是无法使用`ctrl/command+上/下/左/右`进行scroll的。
  + tabindex 的最大值是32767

### 2、script的async和defer属性
* async 脚本文件一旦加载完成，会立即执行
  + 经典脚本：经典脚本在资源可用后会立刻解析并执行
  + 模块脚本：模块脚本会使得资源和他们的依赖放入延迟队列中，在资源可用后会立刻解析并且执行
* defer 脚本文件会在DOM解析完成后，DOMContentLoad事件之前执行
  + defer 节本会阻止DOMContentLoad事件发生，知道这个脚本加载并且执行完毕
  + defer 必须设置在有src的script
  + module script 是默认defer的
  + defer脚本会按照执行顺序执行

### 3、DOM那点事
Element和NodeList
+ Element
  - 属性  
    attributes、classList、className、clientHeight、clientWeight、clientTop、clientLeft、id、innerHTML、localHTML、outerHTML、scrollTop、scrollWeight、scrollHeight
  - 方法  
    addEventListener、getAttribute、getAttribute、toggleAttribute、getAttributeNames、getBoundingClientRect、getElementsByClassName、getElementByTagName、hasAttributes、insertAdjacentElement、querySelector、querySelectorAll、removeAttribute、removeEventListener、scroll、scrollBy、scrollTo
    + toggleAttribute(name, [,force]) 切换给定元素属性的布尔值的状态，如果存在就添加、不存在就移除
    + insertAdjacentElement(position, element)
      position的值有beforebegin(在该元素之前)、afterbegin(只在该元素当中，第一个子节点之前)、beforeend(只在该元素当中，最后一个孩子之后)、afterend(在该元素之后)
  - 事件 可以使用addEventListener 添加事件  
    error、scroll、select、show、cut、whell、copy、paste、compositioned、compositionstart、compositionupdate、blur、focus、focusin、focusout、fullscreenchange、fullscreenerror、keydown、keypress、keyup、auxclick、click、contnentmenu、dbclick、mousedown、mouseenter、mouseleave、mousemove、mouseout、mouseover、mouseup、touchcancel、touchstart、touchmove、touchend
+ NodeList
  - NodeList对象是一个nodes集合
  - 可以通过Node.childNodes和documentSelectorAll()返回
  - NodeList虽然不是叔叔但是有forEach方法可以迭代
  - 可以通过Array.from()将NodeList转换为一个真实的数组
区别：
  - 可以把Element理解为一个Node，因为Element继承了Node Interface
  - 可以把NodeList理解为一组Node，因为NodeList就是一个nodes集合
  - 通过document.querySelector()返回的是一个Element。通过document.querySelectorAll()返回的是一个NodeList

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


## 单独内容
### 1、History相关
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