# 知识点整理


## native js

### 1、闭包
```
  概念：
  函数在执行的时候会放到一个执行栈上执行，当函数执行完毕之后会在执行栈上移除
  但是由于堆上的成员因为被外部引用不能释放
  因此内部函数依然可以访问外部函数的成员
  缺点：内存消耗很大，容易导致内存泄漏
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