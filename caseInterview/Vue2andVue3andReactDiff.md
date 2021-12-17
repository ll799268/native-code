## Vue2、Vue3、React 对比

### 1、React和Vue的对比
* 相同之处
  + 使用`Virtual DOM`
  + 组件化开发
  + 父子组件单项数据流，不建议直接修改从父组件传过去的值
  + 提供了响应式(Reactive)和组件化(Composable)的视图组件
  + 将注意力集中保持在核心库，而将其他功能如路由和全局状态管理交给相关的库
* 不同点
  + 概念 
    - Vue是MVVM类型的框架，React是MVC类型的框架
    - Vue采用单文件组件的方式进行开发，也就是把传统的web页面html、css、js全部放到一个文件，而React是采用jsx的方式(JSX是一种js的语法扩展，采用于React架构中，其格式比较像是模板语言)。React的作者认为视图表现、数据和逻辑天然就是耦合的
    - diff算法不同，Vue Diff使用双向链表，一边对比，一边更新DOM，React主要通过Diff队列保存哪些DOM需要更新，得到patch树(补丁)，最后再统一操作批量更新DOM
    - 数据绑定方式不同，Vue采用v-model来实现。React采用事件onChange来更新数据
  + 监听数据变化的实现原理不同
    - Vue通过getter/setter以及一些函数的劫持，能精确知道数据变化，不需要特别的优化就能达到很好的性能
    - React默认是通过比较引用的方式进行的，如果不优化(PureComponent/shouldComponentUpdate)可能导致大量不必要的VDOM的重新渲染
  + 模板渲染方式的不同
    - 表层上，模板语法不用
      + Vue是通过一种拓展的HTML语法进行渲染
      + React是通过JSX渲染模板
    但其实这是表面现象，毕竟React并不必须依赖JSX
    - 在深层上，模板的原理不通，这才是他们的本质区别
      + Vue是在组件js代码分离的单独的模板中，通过指令来实现的，比如条件语句就需要v-if来实现
      + React是在组件js代码中，通过原生js实现模板中的常见语法，比如插值，条件，循环等，都是通过js语法实现的
  + 组件通信的区别
    - Vue常用
      + 父组件通过props向子组件传递数据或者回调，虽然可以传递回调，但是我们一般只传数据，而通过事件的机制来处理子组件向父组件的通信
      + 子组件通过事件(emit)向父组件发送消息
      + 通过V2.2.0中新增的provide/inject来实现父组件向子组件注入数据，可以跨越多个层级
    - React常用
      + 父组件通过props可以向子组件传递数据或者回调
      + 可以通过context进行跨层级的通信，这其实和provide/inject起到的作用差不多
    可以看到，React本身并不支持自定义事件，Vue中子组件向父组件传递消息有两种方式：事件和回调函数   
    而且Vue更倾向于使用事件，但是在React中我们都是使用回调函数的
  + 生命周期
    - Vue2：created/mounted/updated/destroyed/activated
    - Vue3：onMounted/onUpdated/onUnmounted/onRenderTracked/onRenderTriggered
    - React：componentDidMount/componentDidUptate/componentWillUnmount/componentWillReceiveProps/shouldComponentUpdate
  + 状态管理
    - Vue：采用是Vuex
    - React：redux/mobx/Recoil/XState/flux
      + 如果是传统的大型复杂React应用，推荐还是使用Redux进行状态管理
      + 如果是中小型复杂度的React应用，可以考虑使用Mobx。Mobx提供了类似于分布式的状态管理机制，原理更为简单，使用起来很方便，但是当复杂度极高的时候，整体状态管理上来说不如Redux方便
      + 如果希望拥抱未来，可以直接使用基于React Hooks的全套解决方案
    - Vuex 和 Redux 的区别
      从表面来说，store注入和使用方式有一些区别
        + 在Vuex中，$store被直接注入到了组件实例中，因此可以比较灵活的使用：
          - 使用dispatch和commit提交更新
          - 通过mapState或者直接通过this.$store来读取数据
        + 在Redux中，我们每一个组件都需要显示的用connect把需要的props和dispatch连接起来
      另外Vuex更加灵活一点，组件既可以dispatch action也可以commit updates，而Redux中只能进行dispath，并不能直接调用reducer进行修改  
      从实现原理上，最大的区别两点式
        + Redux使用的是不可变数据，而Vuex的数据是可变的。Redux每次都是用新的state替换旧的state，而Vuex是直接修改
        + Redux在检测数据变化时候，是通过diff的方式比较差异的，而Vuex其实和Vue的原理一样，是通过getter/setter来比较的

### 2、Vue2和Vue3的区别
  * 挂载方式
    + Vue3可以通过结构的方式拿到`createApp`方法，通过该方法得到app调用`mount`进行挂载。这也是Vue3函数式编程的设计理念，这种设计方式可以按需引用资源，更好的利用tree-shaking(摇树：描述移除js上下文的未引用代码)来减少打包体积
    + Vue2是通过`new Vue`创建实例，通过参数el确定挂载的dom进行挂载，也可以不传el直接使用`app.$mount('#app')`
  * 生命周期
    + Vue3中移除了`beforeCreate`和`created`，增加了`setup`函数。其他周期函数基本就是在命名上加了前缀`on`，以驼峰命名方式命名，要写在setup函数里面  
    + 此外还增加了onRenderTracked和onRenderTriggered是用来调试的，这两个事件都有带有一个DebuggerEvent，他使我们能够知道是什么导致Vue实例中的重新渲染
    + Vue3采用函数式编程，打破了`this`的限制，能够更好的复用性，真正体现实现功能的高内聚低耦合，更利于代码的可扩展性和可维护性
  * 数据响应式方法
    + Vue3提供`reactive和ref`，一般ref可以用来定义基础类型，也哭是引用类型，reactive只能定义引用类型
      - ref的本质就是`reactive({ value: 原始数据 })`，例如Ref((10) => Reactive({ value: 10 }))
      - 对于引用类型，什么时候用ref，什么时候用reactive？简单来说，如果你只打算修改引用类型的一个属性，那么推荐用reactive，如果你打算变量重赋值，那么一定要用ref
      - ref定义的变量通过`xx.value = x` 改变，reactive定义的变量通过`Obj.xx = x` 
    + Vue2直接将数据放到了data中，通过`this.xx = x`来改变
    针对数据响应式原理两者变化很大，vue2是利用`object.defineProperty`，vue3是利用`Proxy和Reflect`来实现，最大的优势就是vue3可以监听到数组、对象新增/删除或多层嵌套数据结构的响应