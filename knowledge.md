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