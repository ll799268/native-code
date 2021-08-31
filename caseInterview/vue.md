### 1、响应式理解
* 概念：
  所谓数据响应式就是对数据层做出更改能够触发视图层做出更新响应的机制
* 为什么vue需要响应式：
  mvvm 框架中要解决的一个核心问题是连接数据层和视图层。通过数据驱动应用，数据变化，视图更新
* 它能给我们带来什么好处：
  以vue为例说明，通过数据响应式加上虚拟DOM和patch算法，可以使我们只需要操作数据，完全不用接触繁琐的dom操作，从而大大提升开发效率
* vue的响应式是怎么实现的：
  + Observer(观察者)对初始数据通过Object.defineProperty添加setter、getter，
    当取数据(即调用get)的时候添加订阅对象(wachter)到数组里，
    当给数据赋值(即调用set)的时候就能知道数据的变化，
    此时调用发布订阅中心，从而遍历当前数据的订阅数组，执行里面所有的watcher，通知变化
  + 如果是数组通过覆盖该数组原型的方法，扩展它的七个变更方法，是这些方法可以额外的做更新通知，从而作出响应。缺点是：
    * 初始化时的递归遍历会造成性能损失
    * 新增或删除属性时需要用户使用 Vue.set/delete 这样特殊的api才可以生效
    * 对于es6中新产生的Map、Set这些数据结构不支持等问题
* vue3中的响应式的新变化
  为了解决这些问题，vue3重新编写了这一部分的实现。
  * 利用ES6的proxy机制代理要响应化的数据结构，它有很多好处，编程体验是一致的，不需要使用特殊的api，初始化性能和内存消耗都得到了大幅度改善
  * 由于响应化的实现代码抽取为独立的reactivity包，使得我们可以更加灵活的使用它，我们甚至不需要引入vue都可以体验

### 2、生命周期
```js
  // 创建实例（vm）
  `beforeCreate`:
    initLifecycle(vm) // 初始化组件生命周期标志位
    initEvents(vm) // 初始化事件监听
    initRender(vm) // 初始化渲染方法
    callHook(vm, 'beforeCreate')
    // 初始化依赖注入内容，在初始化data、props之前
    initInjections(vm) // resolve injections before data/props
    initState(vm) // 初始化props、data、method、watch、methods
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

  // 实例完成 observer(数据观测) 和 property（传入的prop数据） 和方法的运算
  `created`:

  // 在挂载开始之前被调用 相关的 render 函数首次被调用
  `beforeMount`:

  // 实例被挂载后调用，这时的 el 被创建的 vm.$el 替换了。如果根实例挂载到了一个文档内的元素上，被调用的 vm.$el 也是在文档内
  `mounted`:

  // 数据更新时调用，发生在虚拟 DOM 打补丁之前，这里适合在更新之前访问现有的 DOM 比如手动移除已添加的事件监听
  `beforeUpdate`:

  // 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子
  // 当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。
  `updated`:

  // 被 keep-alive 缓存的组件激活时调用(该钩子在服务器端渲染期间不被调用)
  `active`:

  // 实例销毁之前调用。在这一步，实例仍然完全可用(该钩子在服务器端渲染期间不被调用)
  `beforedDestroy`:

  // 实例销毁之后调用。该钩子被调用后，对应的 Vue 实例的所有指令都被解绑，所有的事件监听器被移除，所有的子实例也都被销毁(该钩子在服务器端渲染期间不被调用)
  `destroyed`:

```

### 3、父子组件生命周期执行顺序

```js
  // 1、挂载阶段
  beforeCreate(父) -> created(父) -> beforeMount(父) -> beforeCreate(子) -> created(子) -> beforeMount(子) -> mounted(子) -> mounted(父)
  // 2、子组件更新阶段
  beforeUpdate(父) -> beforeUpdate(子) -> updated(子) -> updated(父)
```

### 4、new Vue 的步骤
+ `new Vue` 的时候会调用 _init 方法
  * 定义 `$set`、`$get`、 `$delete`、`$watch` 等方法
  * 定义 `$on`、`$off`、`$emit` 等事件
  * 定义 `_update`、`$forceUpdate`、`$destroy` 生命周期

+ 调用 `$mount` 进行页面的挂载
+ 挂载的时候主要是通过 `mountComponent` 方法
+ 定义 `updateComponent` 更新函数
+ 执行 `render` 生成虚拟 `DOM`
+ `_update` 将虚拟 `DOM` 生成真实的 `DOM` 结构，并渲染到页面中

### 5、vue2 中 defineProperty 和 vue3 中 proxy 区别
`Object.defineProperty(obj, key, descriptor)`
* 缺点： 
  * 无法监听数组的变化
  * 修改属性值的时候需要遍历对象再修改

`watcher = new Proxy(tarage, handler)`
* 优点： 
  * 可以直接监听数组的变化
  * 返回的是一个新对象，可以操作新的对象达到目的
* 缺点：兼容性问题

### 6、v-for 和 v-if 优先级
* 2.x 版本中在一个元素上同时使用 v-if 和 v-for 时，v-for 会优先作用
* 3.x 版本中 v-if 总是优先于 v-for 生效
* 迁移策略
  + 由于语法上存在歧义，建议避免在同一元素上同时使用两者。
  + 比起在模板层面管理相关逻辑，更好的办法是通过创建计算属性筛选出列表，并以此创建可见元素

### 7、computed 和 watch 的区别和运用的场景
* 区别：
  computed 计算属性，依赖 data 属性值，有缓存的。只有他的依赖属性值发生改变，下一次获取的值会重新计算
  watch 观察作用，类似于某些数据的监听回调，每当监听的数据发生改变会执行后续操作
* 运用场景：
  computed 当我们需要进行数值计算，并且依赖于其他数据时，应该使用computed 因为可以利用缓存机制，避免每次获取值时，都需要重新计算
  watch 当我们需要数据变化时执行异步或者开销较大的操作时候，应该使用它
    使用它选项允许我们执行异步操作，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。

### 8、keep-alive
+ 第一次进入，钩子的触发顺序: created-> mounted-> actived
+ 当再次进入（前进或者后退）时，只触发 actived 事件挂载的方法、router 的 beforeRouteEnter
+ 只执行一次的放在 mounted 中；组件每次进去执行的方法放在 actived 中
    * include - 字符串或正则表达式，只有名称匹配的组件会被缓存
    * exclude - 字符串或正则表达式，任何名称匹配的组件都不会被缓存
    * include 和 exclude 的属性允许组件有条件地缓存。二者都可以用“，”分隔字符串、正则表达式、数组。当使用正则或者是数组时，要记得使用v-bind
  ！！！ 服务端不会执行 actived 方法

### 9、vue-router
+ 路由守卫钩子
  * 全局守卫
    + beforeEach(to, from, next)
    + afterEach(to, from, next)
  * 局部守卫
    + beforeRouteEnter(to, from, next)
    + beforeRouteUpdate(to, from, next)
    + beforeRouteLeave(to, from, next)
+ 路由原理
  * hash模式（hashchange）
    + url 改变的时候 会触发 hashchange 事件
  * history模式（popstate）
    + 通过浏览器前进后退改变 URL 时会触发 popstate 事件
    + 通过pushState、replaceState、<a>标签改变 URL 不会触发 popstate 事件。
    + 好在我们可以拦截 pushState、replaceState的调用和<a>标签的点击事件来检测 URL 变化
    + 通过js 调用history的back，go，forward方法课触发该事件

### 10、vuex
+ 概念
  * vuex 是一个专为 Vue.js 应用程序开发的状态管理模式
+ 核心概念
  五大属性：state, getter, mutation, action, module
    * state: 存储数据、状态，在根实例注册了store, 用 this.$store.state 来访问
    * getter: 计算状态属性，返回值会被缓存起来，当它的依赖发生变化会重新计算
    * mutation: 更改 state 中的唯一方法
    * action: 包含任意的异步操作，提交 mutation 改变状态，而不是直接改变状态
    * module: 将 store 分割成模块，每个模块都有state、getter、mutation、action 甚至是嵌套子模块
+ 流程
    dispath    commit
action => mutation => state
+ 持久化工具
  vuex-persistedstate

### 11、Vue.nextTick
在下次 DOM 更新循环结束之后执行延迟回调
在修改数据之后立即使用这个方法，获取更新后的 DOM

### 12、Vue 项目的优化（代码层面的优化）
* v-if 和 v-show 区分使用场景
* computed 和 watch 区分使用场景
* v-for 遍历必须为 item 添加 key，同时避免使用 v-if
* 长列表的性能优化
* 事件的销毁
* 图片资源懒加载
* 路由懒加载
* 第三方插件按需加载
* 优化无限列表性能
* 服务端渲染 SSR 或者预加载

### 13、Vue 中给对象添加新属性界面不刷新
原因：Vue 不允许在已经创建的实例动态添加新的响应式属性，若想实现数据与视图同步更新，可采用：
  * 如果为对象添加少量的新属性，可以直接采用 Vue.set(orginObj, key, vaule)
  * 如果需要为新对象添加大量的新属性，则通过 Object.assign({}, originObj, { key: value }) 创建新对象
  * 如果实在不知道怎么操作时，可采用 $forceUpdate() 进行强制刷新

### 14、Vue 中 mixin 的理解和应用场景
* 概念:
  + 本质其实就是一个js对象，它可以包含我们组件中任意功能选项，如data、components、methods、created、computed 等
  + 我们只要将共用的功能以对象的方式传入 mixins 选项中，当组件使用 mixins对象时所有mixins对象的选项都将被混入该组件本身的选项中来
  + 在 Vue 中我们可以局部混入和全局混入
* 应用场景:
  + 在日常的开发中，我们经常会遇到在不同的组件中经常会需要用到一些相同或者相似的代码，这些代码的功能相对独立

### 15、v-for 中的 key
key 是给每一个 vnode 的唯一 id，也是diff的一种优化策略，可以根据 key 更准确，更快找到 vnode 节点
  * 如果不用 key, Vue 会采用就地复地原则：最小化 element 的移动，并且会尝试最大程度在同适当位置对相同类型的 element 做 patch 或者 reuse
  * 如果使用了 key, Vue 会根据 key 的顺序记录 element, 曾经拥有了 key 的 element 如果不再出现的话，会被直接 remove 或者 destoryed

### 16、diff 算法
+ 概念特点：
  + diff 算法是一种通过同层的树节点进行比较的高级算法
  + 比较只会在同层进行，不会跨层级比较
  + 在diff比较过程中 循环从两边向中间比较
  + diff 算法在很多场景都有使用，在 vue 中，作用域虚拟 dom 渲染成真实的 dom 的新旧 VNode 节点比较
+ 比较方式
  diff 整体策略：深度优先，同层比较
  * 比较会在同层级进行，不会跨层级比较
  * 比较过程中，循环从两边向中间收拢

### 17、无法检测对象 property 的添加或者移除

原因：
由于 JavaScript(ES5) 的限制，Vue.js 不能检测到对象属性 的添加或删除。因为 Vue.js 在初始化实例时将属性转为 getter/setter，所以属性必须在 data 对象上才能让 Vue.js 转换它，才能让它是响应的
解决办法

```js
  // 动态添加单个
  Vue.set(vm.obj, propertyName, newValue)
  vm.$set(vm.obj, propertyName, newValue)

  // 动态添加多个
  this.obj = Object.assign({}, this.obj, {a: 1, b: 2})

  // 动态移除
  Vue.delete(vm.obj, propertyName/index)
  vm.$set(vm.obj, propertyName/index)
```

### 18、new Vue得到的实例和组件实例有什么区别
实例为根组件，组件实例通过__proto__可以访问上层组件实例

### 19、vue 中的 directive
* 生命周期：
  + bind函数：只调用一次，指令第一次绑定在元素上调用，即初始化调用一次，
  + inserted函数：并绑定元素插入父级元素（即new vue中el绑定的元素）时调用（此时父级元素不一定转化为了dom）
  + update函数：在元素发生更新时就会调用，可以通过比较新旧的值来进行逻辑处理
  + componentUpdated函数：元素更新完成后触发一次
  + unbind函数：在元素所在的模板删除的时候就触发一次

* 钩子函数对应的参数el, binding, vnode, oldnode, 具体参数讲解如下：
  + el指令所绑定的元素 可以直接操组dom元素
  + binding一个对象，具体包括以下属性：
    * name：定义的指令名称 不包括v-
    * value：指令的绑定值，如果绑定的是一个计算式，value为对应计算结果
    * oldvalue：指令绑定元素的前一个值，只对update和componentUpdated钩子函数有值
    * expression：指令绑定的原始值 不对值进行任何加工
    * arg：传递给指令的参数
    * modifiers：指令修饰符，如：`v-focus.show.async` 则接收的 modifiers 为`｛ show：true，async：true ｝`
  + vnode：vue编译生成的虚拟dom
  + oldVnode：上一个 vnode，只在 update 和 componentUpdated 钩子函数中有效