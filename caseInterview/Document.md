## Document相关

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
#### 2、DOM那点事
Element和NodeList
+ Element
  - 属性  
    attributes、classList、className、clientHeight、clientWeight、clientTop、clientLeft、id、innerHTML、localHTML、outerHTML、scrollTop、scrollWeight、scrollHeight
  - 方法  
    addEventListener、getAttribute、setAttribute、toggleAttribute、getAttributeNames、getBoundingClientRect、getElementsByClassName、getElementByTagName、hasAttributes、insertAdjacentElement、querySelector、querySelectorAll、removeAttribute、removeEventListener、scroll、scrollBy、scrollTo
    + toggleAttribute(name, [,force]) 切换给定元素属性的布尔值的状态，如果存在就添加、不存在就移除
    + insertAdjacentElement(position, element)
      position的值有beforebegin(在该元素之前)、afterbegin(只在该元素当中，第一个子节点之前)、beforeend(只在该元素当中，最后一个孩子之后)、afterend(在该元素之后)
  - 事件 可以使用addEventListener 添加事件  
    error、scroll、select、show、cut、whell、copy、paste、compositioned、compositionstart、compositionupdate、blur、focus、focusin、focusout、fullscreenchange、fullscreenerror、keydown、keypress、keyup、auxclick、click、contextmenu、dbclick、mousedown、mouseenter、mouseleave、mousemove、mouseout、mouseover、mouseup、touchcancel、touchstart、touchmove、touchend
+ NodeList
  - NodeList对象是一个nodes集合
  - 可以通过Node.childNodes和documentSelectorAll()返回
  - NodeList虽然不是数组但是有forEach方法可以迭代
  - 可以通过Array.from()将NodeList转换为一个真实的数组
区别：
  - 可以把Element理解为一个Node，因为Element继承了Node Interface
  - 可以把NodeList理解为一组Node，因为NodeList就是一个nodes集合
  - 通过document.querySelector()返回的是一个Element。通过document.querySelectorAll()返回的是一个NodeList