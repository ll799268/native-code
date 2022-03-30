## CSS篇

### 1、CSS特异性
* 概念  
  如果有多个属性或者选择器同时指向同一个元素的CSS冲突，优先使用什么样式规则。
* 层次  
  !important > 行内样式 > ID选择器 > 类选择器 > 通配符、属性选择器、伪类选择器 > 标签选择器 > 伪元素选择器

### 2、BFC
* 概念  
  BFC全称Block Formatting Context，名为块级格式化上下文  
  W3C官方解释：BFC它决定了元素如何对其内容进行定位，以及与其它元素的关系和互相作用，当涉及到可视化布局时，Block Formatting Context提供了一个环境，HTML在这个环境中按照一定的规则进行布局  
  简单来说就是，BFC是一个完全独立的空间(布局环境)，让空间里的子元素不会影响到外面的布局。
* 触发条件
  + overflow: hidden
  + position: absolute
  + position: fixed
  + display: inline-block
  + display: table-cell
  + display: flex
* 规则
  + BFC就是一个块级元素，块级元素会垂直方向一个接一个的排列
  + BFC就是页面中的一个隔离的独立容器，容器里的标签不会影响到外部标签
  + 垂直方向的距离由margin决定，属于同一个BFC的两个相邻的标签外边距会发生重叠
  + 计算BFC的高度时，浮动元素也参与计算
* 解决了什么问题
  + 使用float脱离文档流，高度塌陷
  + margin重叠边距
  + 两栏布局

### 3、IFC
* 概念  
  IFC全称Inline Formatting Context，名为块级格式化上下文  
* 规则
  + 各行内框一个接一个地排列，其排列顺序根据书写模式的设置来决定
    - 对于水平书写模式，各个框从左边开始水平地排列
    - 对于垂直书写模式，各个框从顶部开始垂直地排列
  + 当一行不够的时候会自动切换到下一行
  + 行级上下文的高度由内部最高的内联盒子的高度决定

### 4、nth-of-type和nth-child的区别
* `nth-of-type(n)`是选择父元素的第n个同类型的子元素
* `nth-child(n)`是选择父元素的第n个子元素
