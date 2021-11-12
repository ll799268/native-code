## HTML相关
### 1、一些低调的HTML属性
* input:accept 会限制上传图片的类型
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


## js相关
### 1、typeof
`typeof`返回一个字符串，表示该操作值得数据类型。可能返回的类型字符串有：`string`、`bollean`、`number`、`bigint`、`symbol`、`undefined`、`function`、`object`

### 2、BigInt
`BigInt` 是一种内置对象，他提供了一种方法来表示大于`2**53-1`的整数
* BigInt 能使用运算符+、*、-、**和%