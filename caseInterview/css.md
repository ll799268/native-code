# CSS篇

## 1、CSS特异性

* 概念  
  如果有多个属性或者选择器同时指向同一个元素的CSS冲突，优先使用什么样式规则。
* 层次  
  !important > 行内样式 > ID选择器 > 类选择器 > 通配符、属性选择器、伪类选择器 > 标签选择器 > 伪元素选择器

## 2、BFC

* 概念  
  BFC全称Block Formatting Context，名为块级格式化上下文  
  W3C官方解释：BFC它决定了元素如何对其内容进行定位，以及与其它元素的关系和互相作用，当涉及到可视化布局时，Block Formatting Context提供了一个环境，HTML在这个环境中按照一定的规则进行布局  
  简单来说就是，BFC是一个完全独立的空间(布局环境)，让空间里的子元素不会影响到外面的布局。
* 触发条件
  * overflow: hidden
  * position: absolute
  * position: fixed
  * display: inline-block
  * display: table-cell
  * display: flex
* 规则
  * BFC就是一个块级元素，块级元素会垂直方向一个接一个的排列
  * BFC就是页面中的一个隔离的独立容器，容器里的标签不会影响到外部标签
  * 垂直方向的距离由margin决定，属于同一个BFC的两个相邻的标签外边距会发生重叠
  * 计算BFC的高度时，浮动元素也参与计算
* 解决了什么问题
  * 使用float脱离文档流，高度塌陷
  * margin重叠边距
  * 两栏布局

## 3、IFC

* 概念  
  IFC全称Inline Formatting Context，名为块级格式化上下文  
* 规则
  * 各行内框一个接一个地排列，其排列顺序根据书写模式的设置来决定
    * 对于水平书写模式，各个框从左边开始水平地排列
    * 对于垂直书写模式，各个框从顶部开始垂直地排列
  * 当一行不够的时候会自动切换到下一行
  * 行级上下文的高度由内部最高的内联盒子的高度决定

## 4、nth-of-type和nth-child的区别

* `nth-of-type(n)`是选择父元素的第n个同类型的子元素
* `nth-child(n)`是选择父元素的第n个子元素

## 5、flex布局

* flex：1 0 auto 默认参数
  * flex-grow：定义项的放大比例
    * 默认为0，即使存在剩余空间，也不会放大
    * 参数为1的时候，等分剩余空间，自动放大占位
    * flex-grow为n的项，占据的空间(放大的比例)是flex-grow为1的n倍
  * flex-shrink：定义项的缩小比例
    * 默认为1，如果空间不足，项会自动缩小
    * 所有项为1，当空间不足，缩小的比例相同
    * 参数为0，空间不足时，该项不会自动缩小
    * 参数为n的项，空间不足时缩小的比例是flex-shrink为1的n倍
  * flex-basis：定义在分配多余空间之前，项目占据的主轴空间，浏览器根据此属性计算主轴是否有多余空间
    * 默认值为auto，即项原本大小
    * 设置后项目将占据固定空间

## 6、移动端1px问题

* 使用伪元素

  ```scss
    .one-border {
      position: relative;
      &::after{
        position: absolute;
        content: ' ';
        background-color: red;
        width: 100%;
        height: 1px;
        transform: scaleY(0.5);
        top: 0;
        left: 0;
      }
    }

    .four-border {
      position: relative;
      &::after{
        content: ' ';
        position: absolute;
        top: 0;
        left: 0;
        width: 200%;
        height: 200%;
        transform: scale(0.5);
        transform-origin: left top;
        box-sizing: border-box;
        border: 1px solid red;
        border-radius: 4px;
      }
    }
  ```

  * 优点：全机兼容，真正实现了1px问题，而且可以实现圆角
  * 缺点：暂用伪类，可能影响浮动
* 使用viewport的scale值

```js
var viewport = document.querySelector('meta[name=viewport]')
if (window.devicePixelRatio == 1) {
  viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no')
}
if (window.devicePixelRatio == 2) {
  viewport.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no')
}
if (window.devicePixelRatio == 3) {
  viewport.setAttribute('content', 'width=device-width, initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.3333333333333333, user-scalable=no')
}
var docEl = document.documentElement;
var fontsize = 32 * (docEl.clientWidth / 750) + 'px'
docEl.style.fontSize = fontsize
```

* 优点：全机型兼容，直接写1px不能再方便
* 缺点：适用于新的项目，老项目可能改动大

* 使用边框图片
  * 优点：没有副作用
  * 缺点：圆角比较模糊
* 使用box-shadow
  * 优点：使用简单，圆角也可以实现
  * 缺点：模拟方法的实现，仔细看可以看出阴影不是边框

## 7、两栏布局

* flex

  ```css
    .parent {
      display: flex;
    }
    .left {
      width: 100px;
    }
    .right {
      flex: 1;
    }
  ```

  缺点：出现等列高的情况。flex容器的一个默认属性值：`align-items：stretch`
* 父overflow + float + padding/margin-left

  ```css
    .parent {
      overflow: hidden;
    }
    .left {
      width: 100px;
      float: left;
    }
    .right {
      margin/padding-left: 100px;
    }
  ```

* 左float + 右触发BFC保持流体特性

  ```css
    .left {
      width: 100px;
      float: left;
    }
    .right {
      overflow: hidden;
    }
  ```

* inline-block + font-size + calc

  ```css
    .parent {
      width: 100%;
      font-size: 0;
    }
    .left {
      display: inline-block;
      width: 100px;
      font-size: 14px;
    }
    .right {
      display: inline-block;
      width: calc(100% - 100px);
      font-size: 14px;
    }
  ```

* absolute + right值为0

  ```css
    .parent {
      position: relative;
      overflow: hidden;
    }
    .left {
      width: 100px;
      position: absolute;
      left: 0;
      top: 0;
    }
    .right {
      position: absolute;
      top: 0;
      left: 100px;
      right: 0
    }
  ```

## 7、CSS方法论

* OOCSS
  * 结构与皮肤分离，即不要将位置、尺寸等结构属性和字体、颜色等皮肤属性写在一个选择器中

  ```html
    <style>
      .line {
        background-color: #ccc;
      }

      .col {
        width: 100px;
        float: left;
      }
    </style>
    <div class="line col"></div>
  ```
  
  * 内容与容器分离，即让对象的行为可预测，避免对位置的依赖，子元素即使离开了容器也应该能正确显示

  ```html
    <style>
     .line {
        background-color: #ccc;
      }

     .unit {
        width: 50%;
      }
    </style>
    <div class="line">
      <div class="unit"></div>
    </div>
  ```

  缺点:
  * 虽然样式的粒度变小了，但同时会产生许多充满类的HTML元素
  * 在避免特殊性冲突时，OOCSS选择的方案是放弃层叠，这样就无法最大程度地利用关系选择器的优势
  * 为了让类能更通用，在命名时就得弱化语义

* BEM (Block Element Modifier)
  * 块（Block）：一个独立的实体，比如一个按钮、一个表单域、一个模块等等。
  * 元素（Element）：块的一部分，比如按钮中的文字、表单域中的输入框等等。
  * 修饰符（Modifier）：用来描述一个元素的特殊状态，比如按钮的禁用状态、表单域的错误状态等等。  
  
  缺点:
  * BEM与OOCSS一样，也抛弃了层叠，因此也不能完全挖掘出关系选择器的潜力
  * CSS类名可能会比较长而且复杂
  * 需要完善规则说明文档，否则HTML结构将难以阅读

* SMACSS  
SMACSS（Scalable and Modular Architecture for CSS）是指可伸缩及模块化的CSS架构，由Jonathan Snook在2011年雅虎工作时提出。他在OOCSS和BEM的基础上添加了五种类别的组件的处理规则，具体如下所列  
  * 基准（Base）是指组件的基本样式，例如按钮的基本样式（背景色、边框等）、表单域的基本样式（背景色、边框等）
  * 布局（Layout）是指组件的不同布局，例如按钮的不同布局（水平、垂直等）
  * 模块（Module）是指组件的不同功能，例如按钮的不同功能（按钮、输入框、按钮组等）、表单域的不同功能（输入框、选择框等）
  * 状态（State）是指组件的不同状态，例如按钮的不同状态（hover、active、focus等）、表单域的不同状态（error、success等）
  * 主题（Theme）也就是换肤，描述了页面的外观，它可修改前面四个类别的样式，例如链接颜色、布局方式
