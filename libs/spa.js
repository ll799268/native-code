
/**
 * hash 模式
 * 核心通过监听 url 中的 hash 来进行路由跳转
 */
class HashRouter {
  constructor() {
    // 内部数据使用下划线开头，只读数据使用$开头
    this._routes = {} // 存放路由path及callback
    this.currentUrl = ''

    // 监听路由change调用对应的路由回调
    window.addEventListener('load', this.refresh, false)
    window.addEventListener('hashchange', this.refresh, false)
  }

  route(path, callback) {
    this._routes[path] = callback
  }

  push(path) {
    this._routes[path] && this._routes[path]()
  }
}

window.miniRouter = new HashRouter()

// eg: 
// miniRouter.route('/', () => console.log('page1'))  
// miniRouter.route('/page2', () => console.log('page2'))  

// miniRouter.push('/') // page1  
// miniRouter.push('/page2') // page2  
// end eg


/**
 * history 模式
 * history 模式核心借用 HTML5 history api，api 提供了丰富的 router 相关属性先了解一个几个相关的api
 * history.pushState 浏览器历史纪录添加记录
 * history.replaceState修改浏览器历史纪录中当前纪录
 * history.popState 当 history 发生变化时触发
 */
class HistoryRouter {
  constructor() {
    this._routes = {}
    this.listerPopState()
  }

  init(path) {
    window.history.replaceState({ path }, null, path)
    this._routes[path] && this._routes[path]()
  }

  route(path, callback) {
    this._routes[path] = callback
  }

  push(path) {
    window.history.pushState({ path }, null, path)
    this._routes[path] && this._routes[path]()
  }

  listerPopState() {
    window.addEventListener('popstate', e => {
      const path = e.state && e.state.path
      this._routes[path] && this._routes[path]()
    })
  }
}

// eg:
window.miniRouter = new HistoryRouter();
miniRouter.route('/', () => console.log('page1'))
miniRouter.route('/page2', () => console.log('page2'))

setTimeout(() => {
  miniRouter.push('/page2')  // page2  
}, 1000);
// end eg