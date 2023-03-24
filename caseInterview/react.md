## react篇

### 1、hook 钩子函数
+ `useState hook`
  * 让函数组件也可以有state状态，并进行状态数据的读写操作
  * 语法 const [data, setData] = useState(defaultVal)
  * useState()说明
      参数：第一次初始化指定的值在内部做缓存
      返回值：包含2个元素的数组，第一个为内部当前状态值，第二个为更新状态值的函数
  * setData()两种写法
    setData(newValue)：参数为非函数组值，直接指定新的状态值，内部用其覆盖原来的状态值
    setData(value => newValue)：参数作为函数，接受原本的状态值，返回新的状态值，内部用其覆盖原来的值

+ `useEffect hook`
  * 可以让你在函数组件中执行副作用(用于模拟生命周期的钩子)
  * react中的副作用操作：
      发送请求数据的获取
      设置订阅、启动定时器
      手动更改真实DOM
  * 语法和说明：
    useEffect(() => {
      在此可操作性任何带副作用的操作
      return () => { 在组件卸载前执行
        在此做一些收尾性的工作，取消订阅、清定时器
      }
    }, [stateValue]) 如果指定是[]，回调函数只会在第一次render后执行
  * 可以把useEffect Hook 看做是如下三个函数的结合
    componentDidMount()
    componentDidUpdate()
    componentWillUnmount()

+ `useRef hook`
  * 可以在函数组件中存储、查找组件内的标签或任意其他类型
  * 语法 const refDom = useRef() <input ref={ refDom } />
  * 使用 保存标签对象，功能和React.createRef()一样

+ `useContext hook`
  * 用于管理组件的上下文，可以使用多级嵌套的组件之间更加方便地进行通信

+ `useReducer hook`
  * 用以管理组件的状态，可以使组件更加灵活和易于维护

+ `useCallback hook`：用于缓存函数，可以提高组件的性能表现

### 2、memo、useCallback、useMemo
* memo
  + React.memo为高阶组件，它与React.PureComponents非常相似。区别返回props结果相反  
  + 如果你的组件在相同的props的情况下渲染相同的结果，那么你可以通过将其包装在React.memo中调用，以此通过记忆组件渲染结果的方式来提高组件的性能表现。
  + React.memo 仅检查props变更。如果函数组件被 React.memo 包裹，且其实现中拥有useState、useReducer或useContext的Hook，当state或context发生变化时，它仍会重新渲染
  + 默认情况下其只会对复杂对象做浅层对比，如果你想要控制对比过程，那么请将自定义的比较函数通过第二个参数传入来实现  
  ```js
    function MyComponent (props) {
      // 使用props渲染
    }
    function areEqual(prevProps, nextProps) {
      // 如果把 nextProps 传入 render 方法的返回结果与将 prevProps 传入 render 方法的返回结果一致则返回 true, 否则返回 false
    }
    export default React.memo(MyComponent, areEqual)
  ```
  此方法仅作为性能优化的方式，但请不要依赖它来阻止渲染，因为这会产生bug  
* useCallback
  + 把内联回调函数及依赖项数组作为参数传入useCallback，他将返回该回调函数的memoized版本，该回调函数仅在某个依赖项改变时才会更新。当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染(例如`shouldComponetsUpdate`)的子组件时，它将非常有用
  + `useCallback(fn, [deps])` 相当于 `useMemo(() => fn, [deps])`
  ```js
    const memoizedCallback = useCallback(
      () => {
        doSomething(a, b)
      },
      [a, b],
    )
  ```
* useMemo
  + 把创建函数和依赖项数组作为参数传入useMemo，它仅会在某个依赖项改变时才会重新计算memoized值。这种优化有助于避免在每次渲染时都进行高开销的计算
  + 记住，传入useMemo的函数会在渲染期间执行。请不要在这几个函数内部执行与渲染无关的操作，诸如副作用这类的操作属于`useEffect`的使用范畴
  + 如果没有提供依赖项数组，useMemo在每次渲染时都会计算新的值
  + 你可以把useMemo作为性能优化的一种手段，但不要把它当成语义上的保证。将来，react可能会选择遗忘以前的一些memoized值，并在一下渲染时重新计算它们，如果它离屏组件释放内存
  ```js
    const memoizedValue = useMemo(
      () => computedExpensiveValue(a, b),
      [a, b]
    )
  ```

总结：
1、在子组件不需要父组件的值和函数的情况下，只需要使用memo函数包裹组件即可  
2、而在使用函数的情况，需要考虑有没有函数传递给子组件使用useCallback  
3、而在使用值所依赖的想，并且是对象和数组等值得时候二使用useMemo(当返回的是原始类型数据就不要使用了)


### 3、Fiber 架构
* 问题：
  js引擎和页面渲染引擎两个线程是互斥的，当其中一个线程执行时，另一个线程只能挂起等待
  如果js线程长时间占用了主线程，那么渲染层面的更新就不得不长时间等待，界面长时间不断更新，会导致页面响应速度变差，用户可能会感觉到卡顿
* 特性：
  + 为每个增加了优先级，优先级高的任务可以中断低优先级的任务。然后再重新执行优先级低的任务
  + 增加了异步任务，调用requestldleCallback api，浏览器空闲的时候执行
  + dom diff 树变成了链表，一个dom对应两个fiber，对应两个队列，这都是为找到被中断的任务重新执行
从架构角度来看，Fiber 是对 React 核心算法(即调和过程)的重写
从编码角度来看，Fiber 是 React 内部所定义的一种数据结构，它是对Fiber 树结构的节点单位，也就是React 16 新架构下的虚拟DOM
* 原理：
  + Fiber 把渲染任务更新过程拆分成多个子任务，每次只做一小部分，做完看是否有剩余时间，如果有继续下一个任务；如果没有，挂起当前任务，将时间控制权交给主线程，等主线程不忙的时候在继续进行
  + 即可以中断和恢复，恢复后也可以复用之前的中间状态，并给不同的任务赋予不同的优先级，其中每个任务更新单元为React Element 对应的 Fiber 节点
  实现的方式的是 requestIdleCallback 方法：
    * window.requestIdleCallback() 方法将在浏览器的空闲时段内调用的函数排队。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入相应
  + 首先 React 中任务切割为多个步骤，分批完成。在完成一部分任务之后，将控制权交回浏览器，让浏览器有时间再进行页面的渲染。等浏览器忙完之后有剩余时间，再继续之前React未完成的任务，是一种合作式调度
  + 该实现过程是基于 Fiber 节点实现，作为静态的数据结构来说，每个Fiber节点对应一个 React element，保存了该组件的类型(函数组件、类组件、原生组件等等)、对应的DOM节点等信息
  + 作为动态的工作单元来说，每个 Fiber 节点保存了本次更新中该组件改变的状态、要执行的工作

### 4、技巧篇
* 使用jsx做表达式判断时候，需要强制转换为`Bollean`类型
```js
  const num = 0
  !!num && <span>{ num }</span>
```
如果不使用!!强制转换数据类型，会在页面输出0

### 5、react 的渲染过程中，兄弟节点之间是怎么处理的，也就是key值不一样的时候
通常我们输入节点的时候都是map一个数组然后返回一个ReactNode，为了方便react内部进行优化，我们必须给每一个ReactNode添加key，这个key prop在设计值不是给开发者用的，是给react用的，大概作用是给每一个ReactNode添加一个身份标识，方便react进行识别  
在渲染过程中，如果key一样，若组件属性有所变化，则react只更新组件对应的属性；没有变化则不更新  
如果key不一样，则react先销毁组件，然后重新创建组件

### 6、react-dom-router
* 路由入口文件：
  ```js
    import { Suspense } from 'react'
    import {
      HashRouter as Router,
      Switch,
      Route,
      Redirect
    } from 'react-router-dom'
    import Loading from 'Loading'

    const routes = []

    return (
      <Router>
        <Suspense fallback={ <Loading /> }>
          // 保证下面的route，即使有多个与路径匹配，也只有第一个会显示
          <Switch>
            {
              routes.map(route => {
                return <Route exact key={ route.path }
                  path={ route.path }
                  component={ route.component }
                />
              })
            }
            <Redirect to='/index' />
          </Switch>
        </Suspense>
      </Router>
    )
  ```
* 路由配置文件
  ```js
    import { lazy } from 'react'
    const Login = lazy(() => import('@pages/Login'))

    const routes = [
      {
        {
          name: 'login',
          path: '/login',
          component: Login,
          title: '登录'
        }
      }
    ]
  ```
* 普通页面使用路由对象
  ```js
    import {
      HashRouter as Router
    } from 'react-router-dom'

    const router = new Router()
    router.xx
  ```


### 7、不可变数据
不可变数据概念来源于函数式编程。函数式编程中，对已初始化的变量是不可更改的，每次更改会创建新的变量
解决方法：
  + Immutable
    原理如下：
    - Immutable的实现原理是Persistent Data Structur(持久化数据结构)，对Immutable对象的任何修改或添加删除操作都会返回一个新的Immutable对象，同时使用旧数据创建新数据时，要保证旧数据同时可用且不变  
    - 为了避免想deepClone一样，把所有节点都复制一遍带来的性能损耗，Immutable使用了StructuralSharing(结构共享)，即如果对象树中一个节点发生改变，只修改这个节点和受它影响的父节点，其它节点则进行共享

### 8、