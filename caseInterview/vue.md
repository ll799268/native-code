# vue篇

## 1、响应式系统理解

* 概念：
  所谓数据响应式就是对数据层做出更改能够触发视图层做出更新响应的机制
* 为什么vue需要响应式：
  mvvm框架中要解决的一个核心问题是连接数据层和视图层。通过数据驱动应用，数据变化，视图更新
* 它能给我们带来什么好处：
  以vue为例说明，通过数据响应式加上虚拟DOM和patch(补丁)算法，可以使我们只需要操作数据，完全不用接触繁琐的dom操作，从而大大提升开发效率
* vue的响应式是怎么实现的：
  * Observer(观察者)对初始数据通过Object.defineProperty添加setter、getter，
    当取数据变化(即调用get)的时候添加订阅对象(wachter)到数组里，
    当给数据赋值(即调用set)的时候就能知道数据的变化，
    此时调用发布订阅中心，从而遍历当前数据的订阅数组，执行里面所有的watcher，通知变化
  * 如果是数组通过覆盖该数组原型的方法，扩展它的七个变更方法，是这些方法可以额外的做更新通知，从而作出响应。缺点是：
    * 初始化时的递归遍历会造成性能损失
    * 新增或删除属性时需要用户使用 Vue.set/delete 这样特殊的api才可以生效
    * 对于es6中新产生的Map、Set这些数据结构不支持等问题
* vue3中的响应式的新变化
  为了解决这些问题，vue3重新编写了这一部分的实现。
  * 利用ES6的proxy机制代理要响应化的数据结构，它有很多好处，编程体验是一致的，不需要使用特殊的api，初始化性能和内存消耗都得到了大幅度改善
  * 由于响应化的实现代码抽取为独立的reactivity包，使得我们可以更加灵活的使用它，我们甚至不需要引入vue都可以体验

## 2、双向绑定原理

  vue是采用数据劫持结合发布者-订阅者模式的方式，通过Object.defindProperty()来劫持各个属性的setter、getter，在数据变动时发布消息给订阅者，
触发响应的监听回调

* 具体步骤
  * 需要observer的数据对象进行递归遍历，包括子属性对象的属性，都加上setter和getter，给这个对象的某个值复制，就会触发setter，那么久能监听到了数据变化
  * compile解析横板命令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图
  * Watcher订阅名是observer和Compile之间通信的桥梁，主要做的事情是：
    * 在自身实例化时往属性订倒器(dep)里面添加自己
    * 自身必须有一个update()方法
    * 待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中定的回调，则功成身退
  * MVVM作为数据绑定的入口，和Observer、Compile和Watcher三者，通过Observer来监听自己的modle数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer和Compile之间的通信桥梁，达到数据变化->数据更新、视图交互变化->数据mode变更的双向绑定

## 3、生命周期

```js
  // 实例初始化之后，数据观测(data ovserver)和event/watcher事件配置之前被调用
  `beforeCreate`:
    initLifecycle(vm) // 初始化组件生命周期标志位
    initEvents(vm) // 初始化事件监听
    initRender(vm) // 初始化渲染方法
    callHook(vm, 'beforeCreate') // 调用beforeCreate钩子函数并且触发beforeCreate钩子事件
    initInjections(vm) // resolve injections before data/props
    initState(vm) // 初始化props、data、method、watch、methods
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

  // 在实例创建完成后被立即调用。在这一步，实例已完成以下的配置:  
  // 数据观测(data observer)，property和方法的运算，watch/event事件回调。然而，挂载阶段还没开始，$el property 目前尚不可用
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
  `activated`:

  // 实例销毁之前调用。在这一步，实例仍然完全可用(该钩子在服务器端渲染期间不被调用)
  `beforedDestroy`:

  // 实例销毁之后调用。该钩子被调用后，对应的 Vue 实例的所有指令都被解绑，所有的事件监听器被移除，所有的子实例也都被销毁(该钩子在服务器端渲染期间不被调用)
  `destroyed`:

```

## 4、父子组件生命周期执行顺序

```js
  // 1、挂载阶段
  beforeCreate(父) -> created(父) -> beforeMount(父) -> beforeCreate(子) -> created(子) -> beforeMount(子) -> mounted(子) -> mounted(父)
  // 2、子组件更新阶段
  beforeUpdate(父) -> beforeUpdate(子) -> updated(子) -> updated(父)
```

## 5、new Vue的步骤

* init -> $mount -> compile -> render -> vnode -> patch -> DOM

```js
  initMixin(Vue) // 定义init方法，初始化Vue实例
  stateMixin(Vue) // 定义$set、$get、$delete、$watch
  eventsMixin(Vue) // 定义$on、$once、$off、$emit
  lifecycleMixin(Vue) // 定义 _update、$forceUpdate、$destory
  renderMixin(Vue) // 定义 _render 返回虚拟dom
```

## 6、vue2中defineProperty和vue3中proxy区别

`Object.defineProperty(obj, key, descriptor)`

* 缺点：
  * 无法监听数组的变化
  * 修改属性值的时候需要遍历对象再修改

`watcher = new Proxy(tarage, handler)`

* 优点：
  * 可以直接监听数组的变化
  * 返回的是一个新对象，可以操作新的对象达到目的
* 缺点：兼容性问题

## 7、v-for和v-if优先级

* 2.x 版本中在一个元素上同时使用 v-if 和 v-for 时，v-for 会优先作用
* 3.x 版本中 v-if 总是优先于 v-for 生效
* 迁移策略
  * 由于语法上存在歧义，建议避免在同一元素上同时使用两者。
  * 比起在模板层面管理相关逻辑，更好的办法是通过创建计算属性筛选出列表，并以此创建可见元素

## 8、methods、computed和watch的区别和运用的场景

* 区别：  
  methods：内部用来定义函数，需要手动调用。而不像computed和watch那样，自动执行预先定义的函数  
  computed：计算属性，依赖 data 属性值，有缓存的。只有他的依赖属性值发生改变，下一次获取的值会重新计算。一个数据受多个数据影响  
  watch：观察作用，类似于某些数据的监听回调，每当监听的数据发生改变会执行后续操作。一个数据影响多个数据
* 运用场景：
  computed：当我们需要进行数值计算，并且依赖于其他数据时，应该使用computed 因为可以利用缓存机制，避免每次获取值时，都需要重新计算  
  watch：当我们需要数据变化时执行异步或者开销较大的操作时候，应该使用它。使用它选项允许我们执行异步操作，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。  
  computed的多对一，watch一对多

## 9、keep-alive

* props：
  * include 字符串或者正则表达式。只有名称匹配的组件会被缓存
  * exclude 字符串或正则表达式，任何名称匹配的组件都不会被缓存  
    include和exclude的属性允许组件有条件的缓存。二者都可以用`,`分隔字符串、正则表达式、数组
  * max 数字，最多可以缓存多少组件实例
* 用法
  * `<keep-alive>`包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。和`<transiton>`相似，`<keep-alive>`是一个抽象组件：它自身不会渲染一个DOM元素，也不会出现在组件的父组件链中
  * 第一次进入，钩子的触发顺序: created -> mounted -> actived
  * 当再次进入（前进或者后退）时，只触发 actived 和 deactivated 事件挂载的方法、router 的 beforeRouteEnter

```js
  // todo1 生命周期定义了三个钩子函数
  created() {
    this.catch = Object.create(null) // 分别缓存虚拟DOM
    this.keys = [] // 缓存的虚拟DOM的键集合
  }
  destroyed () {
    for (const key in this.catch) {
      pruneCacheEntry(this.catch, key, this.keys) // 删除所有缓存
    }
  }
  // 实时监听黑名单的变动
  // 在mounted这个钩子中对include、exclude参数进行检测，然后实时地更新(删除)this.catch对象数据。pruneCache函数的核心也是去调用pruneCacheEntry
  mounted () {
    this.$watch('include', val => {
      pruneCache(this, name => matchs(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matchs(val, name))
    })
  }
  // todo2 render
  // 第一步：获取<keep-alive>包裹着的第一个子组件及其组件名
  // 第二步：根据设定的黑白名单(如果有)进行条件匹配，决定是否缓存。不匹配，直接返回组件实例(VNode)，否则执行第三步
  // 第三步：根据组件ID和tag生成缓存Key，并在缓存对象中查找是否已缓存过该组件实例。如果存在，直接取出缓存值并更新该key在this.keys中的位置(更新key位置是实现LRU置换策略的关键)，否则执行第四步
  // 第四步：在this.cache对象中存储该组件实例并保存key值，之后检查缓存的实例数量是否超过max的设置值，超过则根据LRU置换策略删除最近最久未使用的实例(即是下标为0的那个key)
  // 第五步：最后并且很重要，将该组件实例的keepAlive属性值设置为true
```

## 10、Vue.nextTick

概念：将回调延迟到下次DOM更新循环之后执行。在修改数据之后立即使用它，然后等待DOM更新

```js
  // todo1 将回调函数放入callbacks等待执行
  let callbacks = []

  // todo2 先对当前环境进行判断，将执行任务放到宏任务或微任务中并使用timerFunc执行
  // 是否兼容Promise(微任务)
  if (typeof Promise !== 'undefined' && isNative(Promise)) {} 
  // 不是IE浏览器，兼容MutationObserver(DOM树做出改变进行监听)(微任务)
  // MutationObserver是HTML5新增的属性，用于监听DOM修改事件，能够监听到节点的属性、文本内容、子节点等的改动，是一个功能强大的利器。
  else if (!isIE && typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {} 
  // 是否兼容setImmediate(宏任务)
  else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {} 
  // 不兼容Promise、MutationObserver和setImmediate就使用setTimeout(宏任务)
  else { // setTimeout(fn, 0) }
```

使用场景

* nextTick是Vue提供的一个全局API，由于vue的异步更新策略导致我们对数据的修改不会立刻体现在dom变化之上，此时如果想要立即获取dom状态，就需要使用这个方法
* Vue在更新DOM时是异步执行的。只要侦听到数据变化，Vue将开启一个队列，并缓冲在同一个事件循环中发生的所有数据变更。如果同一个watcher被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和DOM操作是非常重要的。nextTick方法会在队列中加入一个回调函数，确保该函数在前面dom操作完成之后才调用
* 所以当我们想在修改数据后立即看到dom执行结果就需要用到nextTick方法
* 比如。我在干什么的时候就会使用nextTick传一个回调函数进去，在里面执行dom操作即可
* 实现，它会在callbacks里面加入我们传入的函数然后用timerFunc异步方式调用它们，首选的异步方式会是promise

## 11、异步更新队列

Vue在更新DOM时是异步执行的。只要侦听到数据变化，Vue将开启一个队列，并缓存在同一事件循环中发生的所有数据变更。如果同一个watcher被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和DOM操作是非常重要的。然后，在下一个的事件循环`tick`中，Vue刷新队列并执行实际(已去重的)工作。Vue在内部对异步队列尝试使用原生的`Promise.then`、`MutationObserver`和`setImmediate`，如果执行环境不支持，则会采用`setTimeout(fn, 0)`替代

## 12、Vue中给对象添加新属性界面不刷新

原因：Vue 不允许在已经创建的实例动态添加新的响应式属性，若想实现数据与视图同步更新，可采用：

* 如果为对象添加少量的新属性，可以直接采用 Vue.set(orginObj, key, vaule)
* 如果需要为新对象添加大量的新属性，则通过 Object.assign({}, originObj, { key: value }) 创建新对象
* 如果实在不知道怎么操作时，可采用 $forceUpdate() 进行强制刷新

## 13、无法检测对象property的添加或者移除

原因：
  由于 JavaScript(ES5) 的限制，Vue不能检测到对象属性的添加或删除。因为Vue在初始化实例时将属性转为getter/setter，所以属性必须在data对象上
才能让Vue.js转换它，才能让它是响应的
解决办法：

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

## 14、Vue中mixin的理解和应用场景

* 概念:
  * 本质其实就是一个js对象，它可以包含我们组件中任意功能选项，如data、components、methods、created、computed 等
  * 我们只要将共用的功能以对象的方式传入 mixins 选项中，当组件使用 mixins对象时所有mixins对象的选项都将被混入该组件本身的选项中来
  * 在 Vue 中我们可以局部混入和全局混入
* 应用场景:
  * 在日常的开发中，我们经常会遇到在不同的组件中经常会需要用到一些相同或者相似的代码，这些代码的功能相对独立

## 15、vue中的directive

* 生命周期：
  * bind函数：只调用一次，指令第一次绑定在元素上调用，即初始化调用一次，
  * inserted函数：并绑定元素插入父级元素（即new vue中el绑定的元素）时调用（此时父级元素不一定转化为了dom）
  * update函数：在元素发生更新时就会调用，可以通过比较新旧的值来进行逻辑处理
  * componentUpdated函数：元素更新完成后触发一次
  * unbind函数：在元素所在的模板删除的时候就触发一次

* 钩子函数对应的参数el, binding, vnode, oldnode, 具体参数讲解如下：
  * el指令所绑定的元素 可以直接操组dom元素
  * binding一个对象，具体包括以下属性：
    * name：定义的指令名称 不包括v-
    * value：指令的绑定值，如果绑定的是一个计算式，value为对应计算结果
    * oldvalue：指令绑定元素的前一个值，只对update和componentUpdated钩子函数有值
    * expression：指令绑定的原始值 不对值进行任何加工
    * arg：传递给指令的参数
    * modifiers：指令修饰符，如：`v-focus.show.async` 则接收的 modifiers 为`｛ show：true，async：true ｝`
  * vnode：vue编译生成的虚拟dom
  * oldVnode：上一个 vnode，只在 update 和 componentUpdated 钩子函数中有效

## 16、v-for中的key

key 是给每一个 vnode 的唯一 id，也是diff的一种优化策略，可以根据 key 更准确，更快找到 vnode 节点

* 如果不用 key, Vue 会采用就地复地原则：最小化 element 的移动，并且会尝试最大程度在同适当位置对相同类型的 element 做 patch 或者 reuse
* 如果使用了 key, Vue 会根据 key 的顺序记录 element, 曾经拥有了 key 的 element 如果不再出现的话，会被直接 remove 或者 destoryed

## 17、diff算法

* 概念特点：
  * diff 算法是一种通过同层的树节点进行比较的高级算法
  * 比较只会在同层进行，不会跨层级比较
  * 在diff比较过程中 循环从两边向中间比较
  * diff 算法在很多场景都有使用，在 vue 中，作用域虚拟 dom 渲染成真实的 dom 的新旧 VNode 节点比较
* 比较方式  
  diff 整体策略：深度优先，同层比较
  * 比较会在同层级进行，不会跨层级比较
  * 比较过程中，循环从两边向中间收拢
* 比较步骤
  * 调用`patch`方法，传入新旧虚拟DOM，开始同层对比
  * 调用`isSameNode`方法，对比新旧节点是否同类型节点
  * 如果不同，新节点直接代替旧节点
  * 如果相同，调用`patchNode`进行对比文件
    * 如果旧节点和新节点都是文本节点，则新文本代替旧文本
    * 如果旧节点有子节点，新节点没，则删除旧节点的子节点
    * 如果旧节点没有子节点，新节点有，则把子节点新增上去
    * 如果都有子节点，则调用`updateChildren`方法进行新旧子节点的对比
    * 子节点对比为首尾对比法

## 18、vue-router

* 路由守卫钩子
  * 全局守卫
    * beforeEach(to, from, next)
    * afterEach(to, from, next)
  * 局部守卫
    * beforeRouteEnter(to, from, next)
    * beforeRouteUpdate(to, from, next)
    * beforeRouteLeave(to, from, next)
* 路由原理
  * hash模式（hashchange）
    * url 改变的时候 会触发 hashchange 事件
  * history模式（popstate）
    * 通过浏览器前进后退改变 URL 时会触发 popstate 事件
    * 通过pushState、replaceState、`<a>`标签改变 URL 不会触发 popstate 事件。
    * 好在我们可以拦截 pushState、replaceState的调用和`<a>`标签的点击事件来检测 URL 变化
    * 通过js 调用history的back，go，forward方法课触发该事件
  * abstract：适用于Node

## 19、vuex

* 概念
  * vuex 是一个专为 Vue.js 应用程序开发的状态管理模式
* 核心概念
  五大属性：state, getter, mutation, action, module
  * state: 存储数据、状态，在根实例注册了store, 用 this.$store.state 来访问
  * getter: 计算状态属性，返回值会被缓存起来，当它的依赖发生变化会重新计算
  * mutation: 更改 state 中的唯一方法
  * action: 包含任意的异步操作，提交 mutation 改变状态，而不是直接改变状态
  * module: 将 store 分割成模块，每个模块都有state、getter、mutation、action 甚至是嵌套子模块
* 流程
    dispath    commit
action => mutation => state
* 持久化工具
  vuex-persistedstate

## 20、Vue项目的优化（代码层面的优化）

* v-if 和 v-show 区分使用场景
* computed 和 watch 区分使用场景
* v-for 遍历必须为 item 添加 key，同时避免使用 v-if
* 使用keep-alive缓存组件
* 使用异步组件
* 长列表的性能优化
* 事件的销毁
* 图片资源懒加载
* 路由懒加载
* 第三方插件按需加载
* 优化无限列表性能
* 服务端渲染 SSR 或者预加载

## 21、new Vue得到的实例和组件实例有什么区别

实例为根组件，组件实例通过__proto__可以访问上层组件实例

## 22、为什么data是个函数并且返回一个对象呢

data之所以只一个函数，是因为一个组件可能会多处调用，而每一次调用就会执行data函数并返回新的数据对象，这样，可以避免多出调用之间的数据污染

## 23、为什么只对对象劫持，而要对数组进行方法重写

因为对象最多也就十几个属性，拦截起来数量差不多，但是数组可能会有很多，拦截起来非常耗性能，所以直接重写数组原型上的方法，是比较节省性能的方案

## 24、虚拟DOM

* 主要分为三部分：
  * 通过建立节点描述对象
  * diff算法比较分析新旧两个虚拟DOM差异
  * 将差异patch到真实DOM上实现更新

* 虚拟DOM的优势有以下几点：
  * 小修改无需频繁更新DOM，框架的diff算法会自动比较，分析出需要更新的节点，按需更新
  * 更新数据不会造成频繁的回流和重绘
  * 表达力更强，数据更新更加方便
  * 保存的是js对象，具备跨平台能力
* 不足：首次渲染大量DOM时，由于多了一层虚拟DOM的计算，会比innerHTML插入慢  

## 25、有哪些修饰符()

* 事件修饰符
  * .stop：阻止事件冒泡
  * .prevent：阻止默认事件
  * .capture：事件的捕获(内部元素触发的事件先在此处理，然后才交到由内部元素进行处理)
  * .self：点击事件绑定本身才触发(事件不是从内部元素触发的)
  * .once：事件只触发一次
  * .passive：相当于给移动端滚动事件加一个.lazy
* 按键修饰符
  * .enter、.tab、.delete、.esc、.space、.up、.down：键盘按键
  * .left、.rigth、.middle：鼠标按键
* 自定义修饰符
  * .sync：简化修改父值的步骤
* 表单修饰符
  * .lazy：输入框失去焦点才会更新vmodel的值
  * .number：将vmodel的值转换为数字
  * .trim：将vmodel的值首尾空格去掉
