# 知识点整理

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
