# 创建

## **1. 设置镜像源，切换到国内淘宝镜像地址，国外的地址大概率情况会请求超时**

```
npm config set registry https://registry.npm.taobao.org/
npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
```

## **2. 安装vue-cli**

```
npm install -g vue-cli
```

## **3. 通过vue安装electron-vue，并初始化项目**

```
vue init simulatedgreg/electron-vue help-electron
```

安装成功，这里存在另一个坑。安装成功后根据提示通过yarn进行项目的安装有可能报错（反正我的报错了），换用cnpm进行安装，直接使用npm进行运行即可

## 4.安装依赖

```
cd electronvue
cnpm install
npm run dev
```

## 5.启动项目

![image-20210712175551772](E:\workNotes\electron-vue项目.assets\image-20210712175551772.png)

找到项目中

![image-20210712175618995](E:\workNotes\electron-vue项目.assets\image-20210712175618995.png)

在文件内找到

![image-20210712175644307](E:\workNotes\electron-vue项目.assets\image-20210712175644307.png)

插入

```js
templateParameters(compilation, assets, options) {
  return {
    compilation: compilation,
    webpack: compilation.getStats().toJson(),
    webpackConfig: compilation.options,
    htmlWebpackPlugin: {
      files: assets,
      options: options
    },
    process,
  };
},
```

注意：两个文件都需要添加

再次启动~

## 报错处理

### 控制台报错

![image-20210712183035408](E:\workNotes\electron-vue项目.assets\image-20210712183035408.png)



![image-20210712191936899](E:\workNotes\electron-vue项目.assets\image-20210712191936899.png)

### gyp verb `which` failed Error: not found: python2

- 安装gyp命令 npm install -g node-gyp ；
- 安装[Python 2.7](https://www.python.org/downloads/)（`v3.x.x`不支持），安装后要配置环境变量。成功后执行`npm config set python python2.7`
- 执行 `npm config set msvs_version 2017`



### node-sass sass-loader 与node版本不匹配

> 根据node版本选择node-sass版本









# 功能

## vue-devtools

### 1、下载vue-devtools

> https://github.com/vuejs/devtools/tree/v5.1.1
>
> npm i
>
> npm run build
>
> 将 /shells/chrome 复制到项目中

![image-20210719184550942](E:\workNotes\electron-vue项目.assets\image-20210719184550942.png)

### 2、electron引入

> 使用 `session.defaultSession.loadExtension(absPath)` API
>
>  [BrowserWindow.addDevToolsExtension(path) 在 Electron 13 版本已移除](https://www.electronjs.org/docs/breaking-changes#removed-browserwindow-extension-apis)

```js
// main/index.dev.js
import { session  } from 'electron'
import path from 'path'
require('electron').app.on('ready', () => {
  if(process.env.NODE_ENV === 'development'){
    session.defaultSession.loadExtension(path.resolve(__dirname, '../../chrome'))
  }
})

require('./index')
```

### 3、报错处理

`Warnings loading extension at C:\Users\Lst30\Desktop\help_electron\chrome: Unrecognized manifest key 'browser_action'. Permission 'contextMenus' is unknown or URL pattern is malformed.`

> 删除 chrome/mainfest.json 中 browser_action 和 contextMenus 配置项





## 最小化到托盘

### 1、package.json 文件

> 在 package.json 的build中添加 `extraResources:["static/"]`
>
> 将系统所用icon放到static文件夹中
>
> extraResources 的作用是打包时，将static文件夹复制到 打包的文件夹内
>
> 例子： `\build\win-unpacked\resources\static

```js
// package.json 
"build":{
    ...,
    "extraResources": [
      "static/"
    ],
}
```



### 2、main/index.js

> 配置最小化托盘
>
> 注意：要区分开发和生产环境对托盘图标的引用路径
>
> 生产环境从 `\build\win-unpacked\resources\static` 引入icon
>
> __static 指的就是 `\build\win-unpacked\resources\static`路径

```js
import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron'

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
  // global.__static = window.require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let appTray = null // 引用放外部，防止被当垃圾回收
function setTray () { // 隐藏主窗口，并创建托盘，绑定关闭事件
  // 用一个 Tray 来表示一个图标,这个图标处于正在运行的系统的通知区
  //  ，通常被添加到一个 context menu 上.
  // 系统托盘右键菜单
  let trayMenuTemplate = [{ // 系统托盘图标目录
    label: '退出',
    click: function () {
      app.quit()
    }
  }]
  // 当前目录下的app.ico图标
  let iconPath = null
  if(process.env.NODE_ENV === 'development'){
    iconPath = path.join(__dirname, '../../static/icons/tray.ico')
  }else{
    iconPath = path.join(__static, '/icons/tray.ico')
  }
  appTray = new Tray(iconPath)
  // 图标的上下文菜单
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate)
  // 隐藏主窗口
  mainWindow.hide()
  // 设置托盘悬浮提示
  appTray.setToolTip('never forget')
  // 设置托盘菜单
  appTray.setContextMenu(contextMenu)
  // 单击托盘小图标显示应用
  appTray.on('click', function () {
    // 显示主程序
    mainWindow.show()
    // 关闭托盘显示
    appTray.destroy()
  })
}

ipcMain.on('toMin', () => {
  setTray()
})
```





## 无边窗口

```js
// main/index.js
  mainWindow = new BrowserWindow({
    height: 440,
    width: 750,
    frame: false, // 这里
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      webSecurity: false
    }
  })

```



<img src="E:\workNotes\electron-vue项目.assets\image-20210715102436708.png" alt="image-20210715102436708" style="zoom:50%;" />

<img src="E:\workNotes\electron-vue项目.assets\image-20210715102502549.png" alt="image-20210715102502549" style="zoom: 50%;" />

## 设置可拖拽区域

- 应用程序需要在 CSS 中指定 -webkit-app-region: drag 来告诉 Electron 哪些区域是可拖拽的
- 在可拖拽区域内部使用 -webkit-app-region: no-drag 则可以将其中部分区域排除
- 拖动行为可能与选择文本冲突。 例如, 当您拖动标题栏时, 您可能会意外地选择标题栏上的文本。 为防止此操作, 您需要在可区域中禁用文本选择

```css
.titlebar {
  -webkit-app-region: drag;
  -webkit-user-select: none;
}
```

- 在某些平台上，可拖拽区域不被视为窗口的实际内容，而是作为窗口边框处理，因此在右键单击时会弹出系统菜单。 要使上下文菜单在所有平台上都正确运行, 您永远也不要在可拖拽区域上使用自定义上下文菜单。
- 备注：如果你在某些页面设置了可拖拽区，跳转到一个新的页面，而这个新的页面没有设置可拖拽区，则会沿用上一页面的可拖拽区，感觉很奇怪，也没有相应的dom支持，就像取用的上一页面固定的像素区域一样（测试发现是这样，不准确之处请指正，谢谢）。如果拖拽区域不同，这种情况下，在新的页面中设置上拖拽区域即可。



## 无边框模式下禁止双击最大化窗口

> 解决问题：Electron无边框模式下-webkit-app-region: drag;双击最大化的问题。

```js
 mainWindow.setMenu(null)
  // 设置窗口是否可以由用户手动最大化。
  mainWindow.setMaximizable(false)
  // 设置用户是否可以调节窗口尺寸
  mainWindow.setResizable(false)
```





## 打开控制台

### 开发模式

```js
// main/index.js
import { ipcMain } from 'electron'
ipcMain.on('openDevtools', () => {
  mainWindow.webContents.openDevTools({mode: 'detach'})
})
```

```vue
<script>
	
</script>
```



### 生产模式





## electron-log





## 最小化窗口

```js
// 最小化
// mainWindow new BrowserWindow的对象
ipcMain.on('minum', () => {
    mainWindow.minimize();
});
```



## 显示隐藏窗口

```js
        mainWindow.hide();
        endWindow.show();
```



## 设置窗口显示在最前端

```js
endWindow.setAlwaysOnTop(false);
endWindow.setAlwaysOnTop(true);
```

## 主进程向渲染进程发送消息

```js
// 渲染进程接收
import { ipcRenderer } from 'electron'
mounted () {
    ipcRenderer.on('sendMessage',()=>{
        console.log('sendMessage')
    })
},
    
// 主进程发送
// mainWindow 实例化的BrowserWindow 页面
mainWindow.webContents.send('sendMessage')
```





## 渲染进程向主进程发送消息

```js
// 主进程 接收消息
ipcMain.on('openDevtools', () => {
  mainWindow.webContents.openDevTools({mode: 'detach'})
})
// 渲染进程发送消息
import { ipcRenderer } from 'electron'

toControl(){
    ipcRenderer.send('openDevtools','');
},
```



## socket.io报错

在web中使用socket.io正常无比，到了electron就问题不断。一直报 xhr poll error。

首先做了如下尝试：

不使用require方式引入socket.io，使用文件路径方式引入socket.io-client.js。报错改为net-error，这个就是常见的https证书的问题。

然后查找资料，在启动时添加

`app.commandLine.appendSwitch('ignore-certificate-errors');`

即可忽略证书问题。

然后socket就连通了。

## 限制多开exe

```js
//禁止打开多个exe
const isSecondInstance = app.requestSingleInstanceLock()
if (!isSecondInstance) {
    app.quit()
}
```

## 日志electron-log

const log = require('electron-log');



## 注册表 通过浏览器调起exe

```js
app.setAsDefaultProtocolClient("range");
```

## 关闭

```js
ipcMain.on('closeAll', () => {
  console.log('close')
  app.quit()
  app.exit(0)
})
```

## 开启多个窗口

> 如果不需要开启多个窗口，直接使用vue的路由进行页面切换

### 单vue开多个窗口

```js
// router/index.js 正常配置路由
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/page/home.vue').default
    },
    {
      path: '/downLoad',
      name: 'downLoad',
      component: require('@/page/downLoad.vue').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
```

```js
// mian/index.js
function createWindow () {
  mainWindow = new BrowserWindow({
    height: 440,
    width: 750,
    // frame: false,
    ransparent: true,
    title: 'electron-demo',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      webSecurity: false
    }
  })
  mainWindow.setMaximizable(false)
  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  let size = screen.getPrimaryDisplay().workAreaSize
  downWindow = new BrowserWindow({
    width: 320,
    height: 250,
    x: size.width - 330,
    y: size.height - 260,
    title: 'downWindow',
    frame: false,
    useContentSize: false,
    show: false,
    transparent: true,
    backgroundColor: '#00000000',
    resizable: false,
    maximizable: false,
    movable: true,
    webPreferences: {
      devTools: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      webSecurity: false
    }
  })
  downWindow.loadURL(winURL + '#/downLoad') // 路由拼接
  downWindow.on('closed', () => {
    downWindow = null
  })
}

ipcMain.on('openDownLoad', (e, t) => {
  if (t === '1') {
    downWindow.show()
  } else {
    downWindow.hide()
  }
})
```









### 多vue开多个窗口









# electron中的API

## 汇总

|                                                              |                   |                                                              |
| :----------------------------------------------------------- | :---------------- | :----------------------------------------------------------- |
| API                                                          | Processes         | Description                                                  |
| [快捷键](http://www.electronjs.org/docs/api/accelerator)     |                   | 定义键盘快捷键。                                             |
| [app](http://www.electronjs.org/docs/api/app)                | Main              | 控制你的应用程序的生命周期事件。                             |
| [autoUpdater](http://www.electronjs.org/docs/api/auto-updater) | Main              | Enable apps to automatically update themselves.              |
| [BrowserView](http://www.electronjs.org/docs/api/browser-view) |                   | 创建和控制视图                                               |
| [BrowserWindow](http://www.electronjs.org/docs/api/browser-window) | Main              | 创建并控制浏览器窗口。                                       |
| [类: BrowserWindowProxy](http://www.electronjs.org/docs/api/browser-window-proxy) |                   | 操纵子浏览器窗口                                             |
| [类: ClientRequest](http://www.electronjs.org/docs/api/client-request) |                   | 发起HTTP/HTTPS请求.                                          |
| [剪贴板](http://www.electronjs.org/docs/api/clipboard)       |                   | 在系统剪贴板上执行复制和粘贴操作。                           |
| [类: CommandLine](http://www.electronjs.org/docs/api/command-line) |                   | 操作Chromium读取的应用程序的命令行参数                       |
| [支持的命令行开关](http://www.electronjs.org/docs/api/command-line-switches) |                   | Electron支持的命令行开关.                                    |
| [contentTracing](http://www.electronjs.org/docs/api/content-tracing) | Main              | 从Chromium收集追踪数据以找到性能瓶颈和慢操作。               |
| [contextBridge](http://www.electronjs.org/docs/api/context-bridge) |                   | 在隔离的上下文中创建一个安全的、双向的、同步的桥梁。         |
| [类：Cookies](http://www.electronjs.org/docs/api/cookies)    |                   | 查询和修改一个会话的cookies                                  |
| [crashReporter](http://www.electronjs.org/docs/api/crash-reporter) | Main and Renderer | 将崩溃日志提交给远程服务器                                   |
| [类: Debugger](http://www.electronjs.org/docs/api/debugger)  |                   | 备用的 Chrome 远程调试接口。                                 |
| [desktopCapturer](http://www.electronjs.org/docs/api/desktop-capturer) | Renderer          | 访问关于使用navigator.mediaDevices.getUserMedia API 获取的可以用来从桌面捕获音频和视频的媒体源的信息。 |
| [对话框](http://www.electronjs.org/docs/api/dialog)          |                   | 显示用于打开和保存文件、警报等的本机系统对话框。             |
| [类: Dock](http://www.electronjs.org/docs/api/dock)          |                   | 在 macOS dock中控制您的应用                                  |
| [类：downloadItem](http://www.electronjs.org/docs/api/download-item) |                   | 控制来自于远程资源的文件下载。                               |
| [环境变量](http://www.electronjs.org/docs/api/environment-variables) |                   | 在不更改代码的情况下控制应用程序配置和行为。                 |
| [Chrome 扩展支持](http://www.electronjs.org/docs/api/extensions) |                   | 注意：Electron 不支持商店中的任意 Chrome 扩展，Electron 项目的目标不是与 Chrome 的扩展实现完全兼容。 |
| [File 对象](http://www.electronjs.org/docs/api/file-object)  |                   | 在文件系统中，使用HTML5 File 原生API操作文件                 |
| [无边框窗口](http://www.electronjs.org/docs/api/frameless-window) |                   | 打开一个无工具栏、边框、和其它图形化外壳的窗口。             |
| [系统快捷键](http://www.electronjs.org/docs/api/global-shortcut) |                   | 在应用程序没有键盘焦点时，监听键盘事件。                     |
| [inAppPurchase](http://www.electronjs.org/docs/api/in-app-purchase) |                   | Mac App Store中的应用内购买                                  |
| [类：IncomingMessage](http://www.electronjs.org/docs/api/incoming-message) |                   | 处理 HTTP/HTTPS 请求的响应。                                 |
| [ipcMain](http://www.electronjs.org/docs/api/ipc-main)       | Main              | 从主进程到渲染进程的异步通信。                               |
| [ipcRenderer](http://www.electronjs.org/docs/api/ipc-renderer) | Renderer          | 从渲染器进程到主进程的异步通信。                             |
| [Menu](http://www.electronjs.org/docs/api/menu)              | Main              | 创建原生应用菜单和上下文菜单。                               |
| [菜单项](http://www.electronjs.org/docs/api/menu-item)       |                   | 添加菜单项到应用程序菜单和上下文菜单中                       |
| [MessageChannelMain](http://www.electronjs.org/docs/api/message-channel-main) |                   | 主进程中用于通道消息传递的通道接口。                         |
| [MessagePortMain](http://www.electronjs.org/docs/api/message-port-main) |                   | 主进程中用于通道消息传递的端口接口。                         |
| [nativeImage](http://www.electronjs.org/docs/api/native-image) | Main and Renderer | 使用 PNG 或 JPG 文件创建托盘、dock和应用程序图标。           |
| [本地主题](http://www.electronjs.org/docs/api/native-theme)  |                   | 读取并响应Chromium本地色彩主题中的变化。                     |
| [net](http://www.electronjs.org/docs/api/net)                | Main              | 使用Chromium的原生网络库发出HTTP / HTTPS请求                 |
| [netLog](http://www.electronjs.org/docs/api/net-log)         |                   | Logging network events for a session.                        |
| [通知](http://www.electronjs.org/docs/api/notification)      |                   | 创建OS(操作系统)桌面通知                                     |
| [电源监视器](http://www.electronjs.org/docs/api/power-monitor) |                   | 监视电源状态的改变。                                         |
| [省电拦截器 \| powerSaveBlocker](http://www.electronjs.org/docs/api/power-save-blocker) |                   | 阻止系统进入低功耗 (休眠) 模式。                             |
| [进程](http://www.electronjs.org/docs/api/process)           |                   | 处理对象的扩展                                               |
| [protocol](http://www.electronjs.org/docs/api/protocol)      | Main              | 注册自定义协议并拦截基于现有协议的请求。                     |
| [remote](http://www.electronjs.org/docs/api/remote)          | Renderer          | 在渲染进程中使用主进程模块。                                 |
| [screen](http://www.electronjs.org/docs/api/screen)          | Main and Renderer | 检索有关屏幕大小、显示器、光标位置等的信息。                 |
| [ServiceWorkers](http://www.electronjs.org/docs/api/service-workers) |                   | Query and receive events from a sessions active service workers. |
| [session](http://www.electronjs.org/docs/api/session)        | Main              | 管理浏览器会话、cookie、缓存、代理设置等。                   |
| [ShareMenu](http://www.electronjs.org/docs/api/share-menu)   |                   | Create share menu on macOS.                                  |
| [shell](http://www.electronjs.org/docs/api/shell)            | Main and Renderer | 使用默认应用程序管理文件和 url。                             |
| [简介](http://www.electronjs.org/docs/api/synopsis)          |                   | 如何使用 Node.js 和 Electron APIs                            |
| [systemPreferences](http://www.electronjs.org/docs/api/system-preferences) | Main              | 获取system preferences.                                      |
| [触控板](http://www.electronjs.org/docs/api/touch-bar)       |                   | 为原生macOS应用创建TouchBar布局                              |
| [类: TouchBarButton](http://www.electronjs.org/docs/api/touch-bar-button) |                   | 为mac os应用在touch bar中创建一个按钮组件                    |
| [类: TouchBarColorPicker](http://www.electronjs.org/docs/api/touch-bar-color-picker) |                   | 在macOS 应用程序中，为触控栏创建拾色器                       |
| [类: TouchBarGroup](http://www.electronjs.org/docs/api/touch-bar-group) |                   | 为本地mac os创建一个触控条组                                 |
| [类: TouchBarLabel](http://www.electronjs.org/docs/api/touch-bar-label) |                   | 在原生macOS应用程序的触摸栏中创建一个标签                    |
| [TouchBarOtherItemsProxy](http://www.electronjs.org/docs/api/touch-bar-other-items-proxy) |                   | Instantiates a special "other items proxy", which nests TouchBar elements inherited from Chromium at the space indicated by the proxy. By default, this proxy is added to each TouchBar at the end of the input. For more information, see the AppKit docs on NSTouchBarItemIdentifierOtherItemsProxy Note: Only one instance of this class can be added per TouchBar. |
| [类: TouchBarPopover](http://www.electronjs.org/docs/api/touch-bar-popover) |                   | 为macOS原生应用在触摸栏中创建一个弹出控件                    |
| [类: TouchBarScrubber](http://www.electronjs.org/docs/api/touch-bar-scrubber) |                   | 创建一个scrubber (可滚动的选择程序)                          |
| [类: TouchBarSegmentedControl](http://www.electronjs.org/docs/api/touch-bar-segmented-control) |                   | 创建一个分段控件（按钮组），其中一个按钮具有选定状态         |
| [类: TouchBarSlider](http://www.electronjs.org/docs/api/touch-bar-slider) |                   | 为本机 macOS 应用程序在触摸栏中创建滑块                      |
| [类: TouchBarSpacer](http://www.electronjs.org/docs/api/touch-bar-spacer) |                   | 在mac os应用中，为touch bar中的相邻项之间留白                |
| [Tray](http://www.electronjs.org/docs/api/tray)              | Main              | 添加图标和上下文菜单到系统通知区                             |
| [webContents](http://www.electronjs.org/docs/api/web-contents) | Main              | 渲染以及控制 web 页面                                        |
| [webFrame](http://www.electronjs.org/docs/api/web-frame)     | Renderer          | 自定义渲染当前网页                                           |
| [webFrameMain](http://www.electronjs.org/docs/api/web-frame-main) |                   | Control web pages and iframes.                               |
| [类：WebRequest](http://www.electronjs.org/docs/api/web-request) |                   | 在一个请求生命周期的不同阶段，截取和修改其内容。             |
| [标签](http://www.electronjs.org/docs/api/webview-tag)       |                   | 在一个独立的 frame 和进程里显示外部 web 内容。               |
| [从渲染进程打开窗口](http://www.electronjs.org/docs/api/window-open) |                   |                                                              |



## app

> app模块是为了控制整个应用的生命周期设计的，可以通过app.on方法来监听Electron的整个生命周期中的事件

### ready事件

初始化时被触发，通过app.on(‘ready’, function createwindow(){})来触发，一般用来初始化窗口。

```js
app.on('ready', createWindow);
```

### window-all-closed事件

当所有窗口都被关闭时触发。

这个时间仅在应用还没有退出时才能触发。 如果用户按下了 Cmd + Q， 或者开发者调用了 app.quit() ，Electron 将会先尝试关闭所有的窗口再触发 will-quit 事件， 在这种情况下 window-all-closed 不会被触发。

```js
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```



### before-quit事件

>  在应用程序开始关闭它的窗口的时候被触发。

### will-quit事件

>  当所有的窗口已经被关闭，应用即将退出时被触发。

### quit事件

> 当应用程序正在退出时触发。

```js
// 试图关掉所有的窗口。before-quit 事件将会最先被触发。如果所有的窗口都被成功关闭了， will-quit 事件将会被触发，默认下应用将会被关闭。
app.quit()
```

### isReady

> 返回 Boolean 类型 - 如果 Electron 已经完成初始化，则返回 true, 其他情况为 false

```js
app.isReady()
```

### active事件

```js
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})
```



### 自定义事件

#### on注册

```js
app.on('second-instance', async (event, argv) => {
    log.warn('194', process.platform)
    // Windows 下通过协议URL启动时，URL会作为参数，所以需要在这个事件里处理
    if (process.platform === 'win32') {
        console.log("window 准备执行网页端调起客户端逻辑");
        handleArgvFromWeb(argv);
    }
});
```



#### emit调用

```js
const _handleAfterReady = () => {
    // windows如果是通过url schema启动则发出时间处理
    // 启动参数超过1个才可能是通过url schema启动
    log.warn('180', process.argv)
    if (process.argv.length > 1) {
        if (!app.isReady()) {
            app.once("browser-window-created", () => {
                // app 未打开时，通过 open-url打开 app，此时可能还没 ready，需要延迟发送事件
                // 此段ready延迟无法触发 service/app/ open-url 处理，因为saga初始化需要时间
                app.emit("second-instance", null, process.argv);
            });
        } else {
            app.emit("second-instance", null, process.argv);
        }
    }
};
```



## ipcMain

> 当在主进程中使用时，它处理从渲染器进程（网页）发送出来的异步和同步信息,
>
> 当然也有可能从主进程向渲染进程发送消息。

```js
ipcMain.on('openDevtools', () => {
  mainWindow.webContents.openDevTools({mode: 'detach'})
})
```

## ipcRenderer

> 使用它提供的一些方法从渲染进程 (web 页面) 发送同步或异步的消息到主
>
> 进程。 也可以接收主进程回复的消息

**向主进程发送消息**

```js
import { ipcRenderer } from 'electron'

toControl(){
    ipcRenderer.send('openDevtools','');
},
```

**接收主进程发送来的消息**

```js
mounted () {
    ipcRenderer.on('sendMessage',()=>{
        console.log('sendMessage')
    })
},
    
// main/index.js
// mainWindow 实例化的BrowserWindow 页面
mainWindow.webContents.send('sendMessage')
```





## BrowserWindow

### 配置项

- **width：**   Integer -窗口宽度,单位像素. 默认是 800

- **height：** Integer - 窗口高度,单位像素. 默认是 600.

- **x：** Integer - 窗口相对于屏幕的左偏移位置.默认居中.

- **y：** Integer - 窗口相对于屏幕的顶部偏移位置.默认居中.

- **useContentSize：**Boolean - width和 height使用web网页size, 这意味着实际窗口的size应该包括窗口框架的size，稍微会大一点，默认为 false

- **center：**Boolean - 窗口屏幕居中.

- **minWidth：**Integer - 窗口最小宽度，默认为 0

- **minHeight：**Integer - 窗口最小高度，默认为 0

- **maxWidth：**Integer - 窗口最大宽度，默认无限制.

- **maxHeight：**Integer - 窗口最大高度，默认无限制.

- **resizable：**Boolean - 是否可以改变窗口size，默认为 true

- **movable：**Boolean - 窗口是否可以拖动. 在 Linux 上无效. 默认为 true

- **minimizable：**Boolean - 窗口是否可以最小化. 在 Linux 上无效. 默认为 true

- **maximizable：**Boolean - 窗口是否可以最大化. 在 Linux 上无效. 默认为 true

- **closable：**Boolean - 窗口是否可以关闭. 在 Linux 上无效. 默认为 true

- **alwaysOnTop：**Boolean - 窗口是否总是显示在其他窗口之前. 在 Linux 上无效. 默认为 false

- **fullscreen：**Boolean - 窗口是否可以全屏幕. 当明确设置值为 false，全屏化按钮将会隐藏，在 macOS 将禁用. 默认 false

- **fullscreenable：**Boolean - 在 macOS 上，全屏化按钮是否可用，默认为 true

- **skipTaskbar：**Boolean - 是否在任务栏中显示窗口. 默认是false

- **kiosk：**Boolean - kiosk 方式. 默认为 false

- **title：**String - 窗口默认title. 默认 "Electron"

- **icon：**[NativeImage](https://link.jianshu.com?t=https://electron.org.cn/doc/api/native-image.html) - 窗口图标, 如果不设置，窗口将使用可用的默认图标.

- **show：**Boolean - 窗口创建的时候是否显示. 默认为 true

- **frame：**Boolean - 指定 false来创建一个 [Frameless Window](https://link.jianshu.com?t=https://electron.org.cn/doc/api/frameless-window.html). 默认为 true

- **acceptFirstMouse：**Boolean - 是否允许单击web view来激活窗口 . 默认为 false

- **disableAutoHideCursor：**Boolean - 当 typing 时是否隐藏鼠标.默认 false

- **autoHideMenuBar：**Boolean - 除非点击 Alt，否则隐藏菜单栏.默认为 false

- **enableLargerThanScreen：**Boolean - 是否允许改变窗口大小大于屏幕. 默认是 false

- **backgroundColor：**String -窗口的 background color 值为十六进制,如 #66CD00(支持透明度). 默认为在 Linux 和 Windows 上为 #000(黑色) , Mac上为 #FFF(或透明).

- **hasShadow：**Boolean - 窗口是否有阴影. 只在 macOS 上有效. 默认为 true

- **darkTheme：**Boolean - 为窗口使用 dark 主题, 只在一些拥有 GTK+3 桌面环境上有效. 默认为 false

- **transparent：**Boolean - 窗口 [透明](https://link.jianshu.com?t=https://electron.org.cn/doc/api/frameless-window.html). 默认为 false

- **type：**String - 窗口type, 默认普通窗口.

- **titleBarStyle：**String - 窗口标题栏样式.

- **parent：**String- 通过parent选项，`child` 窗口将总是显示在 `top` 窗口的顶部.

  - ```js
    const { BrowserWindow } = require('electron')
    
    const top = new BrowserWindow()
    const child = new BrowserWindow({ parent: top })
    child.show()
    top.show()
    ```

- **webPreferences：**Object - 设置界面特性.网页功能设置
  - nodeIntegration Boolean - 是否完整支持node。默认为 true。

  - preload String - 界面的其它脚本运行之前预先加载一个指定脚本。这个脚本将一直可以使用 node APIs 无论 node integration 是否开启。脚本路径为绝对路径。当 node integration 关闭，预加载的脚本将从全局范围重新引入node的全局引用标志。查看例子 here。

  - session [Session](https://www.lmlphp.com/r?x=Gg63w7TLQajc1ryOPF9U0XFiIhvL6EkCvmUiCF9tw5bZ4d8XWKe0mW76%2FqkJv8MMVwCU4X97KQ4v6GWcISelzcUpcugkMafCaUcigACOyOrTIiRTb13eFliRWSGxMACYZUOVQ65IWSILPiETB6aA06DVuHC03QtUjRYcrWalhCY%3D) - 设置界面session。而不是直接忽略session对象，也可用 partition 来代替，它接受一个 partition 字符串。当同时使用 session 和 partition， session 优先级更高. 默认使用默认 session。

  - partition String - 通过session的partition字符串来设置界面session. 如果 partition 以 persist:开头, 这个界面将会为所有界面使用相同的 partition. 如果没有 persist: 前缀, 界面使用历史session. 通过分享同一个 partition，所有界面使用相同的session. 默认使用默认 session.

  - zoomFactor Number - 界面默认缩放值，3.0 表示 300%. 默认 1.0.

  - javascript Boolean - 开启javascript支持. 默认为true.

  - webSecurity Boolean - 当设置为 false，它将禁用相同地方的规则 (通常测试服), 并且如果有2个非用户设置的参数，就设置 allowDisplayingInsecureContent 和 allowRunningInsecureContent 的值为true. 默认为 true.

  - allowDisplayingInsecureContent Boolean -允许一个使用 https的界面来展示由 http URLs 传过来的资源. 默认false.

  - allowRunningInsecureContent Boolean - Boolean -允许一个使用 https的界面来渲染由 http URLs 提交的html,css,javascript. 默认为 false。

  - images Boolean - 开启图片使用支持. 默认 true.

  - textAreasAreResizable Boolean - textArea 可以编辑. 默认为 true.

  - webgl Boolean - 开启 WebGL 支持. 默认为 true.

  - webaudio Boolean - 开启 WebAudio 支持. 默认为 true.

  - plugins Boolean - 是否开启插件支持. 默认为 false.

  - experimentalFeatures Boolean - 开启 Chromium 的 可测试 特性. 默认为 false.

  - experimentalCanvasFeatures Boolean - 开启 Chromium 的 canvas 可测试特性. 默认为 false.

  - directWrite Boolean - 开启窗口的 DirectWrite font 渲染系统. 默认为 true.

  - blinkFeatures String - 以 , 分隔的特性列表, 如 CSSVariables,KeyboardEventKey. 被支持的所有特性可在 [setFeatureEnabledFromString](https://www.lmlphp.com/r?x=oamsi%2FgVterpL1AKstwO8ugtoxEc19gRjEIbEueP3b16ASz%2BoFobP2v3C1LbVm0lIVfk02dQ31BF3yxRxyq1PR1mriGyutTgjrPhbIt5ChpqhrBGKV2xoYDCc%2FQw0ExubUMVtlrvX%2BSeUWyWYf%2F8DkhyC9SIsWnIZszKkv3x65bwonYhxOQ50szA5Psq9fcT%2FK6JB%2B%2FUFLcga%2BGorINllxtuuqqIrgKheFOIeFswbrsBLm9cdkHp%2B6X6YLOfzWVQOlBLbODFevURIUNlEikSP79yC89DkKpwKra9tLw9CGI%3D) 中找到.

  - defaultFontFamily

     

    Object - 设置 font-family 默认字体.

    - standard String - 默认为 Times New Roman.
    - serif String - 默认为 Times New Roman.
    - sansSerif String - 默认为 Arial.
    - monospace String - 默认为 Courier New.

  - defaultFontSize Integer - 默认为 16.

  - defaultMonospaceFontSize Integer - 默认为 13.

  - minimumFontSize Integer - 默认为 0.

  - defaultEncoding String - 默认为 ISO-8859-1.

  

### 实例事件

#### [事件： 'page-title-updated'](http://www.electronjs.org/docs/api/browser-window#事件：-page-title-updated)

返回:

- `event` Event
- `title` String
- `explicitSet` Boolean

文档更改标题时触发，调用`event.preventDefault()`将阻止更改标题 当标题合成自文件 URL 中时， `explicitSet` 的值为false。

#### [事件： 'close'](http://www.electronjs.org/docs/api/browser-window#事件：-close)

返回:

- `event` Event

在窗口要关闭的时候触发。 它在DOM 的`beforeunload` 和 `unload` 事件之前触发. 调用`event.preventDefault()`将阻止这个操作。

通常你想通过 `beforeunload`处理器来决定是否关闭窗口，但是它也会在窗口重载的时候触发. 在 Electron 里，返回除 `undefined`之外的任何值都将取消关闭. 例如：

```javascript
window.onbeforeunload = (e) => {
  console.log('I do not want to be closed')

  // 与通常的浏览器不同,会提示给用户一个消息框,
  //返回非空值将默认取消关闭
  //建议使用对话框 API 让用户确认关闭应用程序.
  e.returnValue = false // 相当于 `return false` ，但是不推荐使用
}
Copy
```

***注意**: `window.onbeforeunload = handler` 和 `window.addEventListener('beforeunload', handler)` 的行为有细微的区别。 推荐总是显式地设置 `event.returnValue`, 而不是仅仅返回一个值, 因为前者在Electron中作用得更为一致.*

#### [事件： 'closed'](http://www.electronjs.org/docs/api/browser-window#事件：-closed)

在窗口关闭时触发 当你接收到这个事件的时候, 你应当移除相应窗口的引用对象，避免再次使用它.

#### [事件: 'session-end' ](http://www.electronjs.org/docs/api/browser-window#事件-session-end-windows)*Windows*

因为强制关机或机器重启或会话注销而导致窗口会话结束时触发

#### [事件: 'unresponsive'](http://www.electronjs.org/docs/api/browser-window#事件-unresponsive)

网页变得未响应时触发

#### [事件: 'responsive'](http://www.electronjs.org/docs/api/browser-window#事件-responsive)

未响应的页面变成响应时触发

#### [事件: 'blur'](http://www.electronjs.org/docs/api/browser-window#事件-blur)

当窗口失去焦点时触发

#### [事件: 'focus'](http://www.electronjs.org/docs/api/browser-window#事件-focus)

当窗口获得焦点时触发

#### [事件: 'show'](http://www.electronjs.org/docs/api/browser-window#事件-show)

当窗口显示时触发

#### [事件: 'hide'](http://www.electronjs.org/docs/api/browser-window#事件-hide)

当窗口隐藏时触发

#### [事件: 'ready-to-show'](http://www.electronjs.org/docs/api/browser-window#事件-ready-to-show)

当页面已经渲染完成(但是还没有显示) 并且窗口可以被显示时触发

请注意，使用此事件意味着渲染器会被认为是"可见的"并绘制，即使 `show` 是false。 如果您使用 `paintWhenInitiallyHidden: false`，此事件将永远不会被触发。

#### [事件: 'maximize'](http://www.electronjs.org/docs/api/browser-window#事件-maximize)

窗口最大化时触发

#### [事件: 'unmaximize'](http://www.electronjs.org/docs/api/browser-window#事件-unmaximize)

当窗口从最大化状态退出时触发

#### [事件: 'minimize'](http://www.electronjs.org/docs/api/browser-window#事件-minimize)

窗口最小化时触发

#### [事件: 'restore'](http://www.electronjs.org/docs/api/browser-window#事件-restore)

当窗口从最小化状态恢复时触发

#### [事件: 'will-resize' ](http://www.electronjs.org/docs/api/browser-window#事件-will-resize-macos-windows)*macOS**Windows*

返回:

- `event` Event
- `newBounds` [Rectangle](http://www.electronjs.org/docs/api/structures/rectangle) - 将要调整到的窗口尺寸。

调整窗口大小前触发。 调用 `event.preventDefault()` 将阻止窗口大小调整。

请注意，该事件仅在手动调整窗口大小时触发。 通过 `setBounds`/`setSize` 调整窗口大小不会触发此事件。

#### [事件: 'resize'](http://www.electronjs.org/docs/api/browser-window#事件-resize)

调整窗口大小后触发。

#### [事件：'resized' ](http://www.electronjs.org/docs/api/browser-window#事件：resized-macos-windows)*macOS**Windows*

当窗口完成调整大小后触发一次。

这通常在手动调整窗口大小后触发。 在 macOS 系统上，使用`setBounds`/`setSize`调整窗口大小并将`animate`参数设置为`true`也会在调整大小完成后触发此事件。

#### [事件: 'will-move' ](http://www.electronjs.org/docs/api/browser-window#事件-will-move-macos-windows)*macOS**Windows*

返回:

- `event` Event
- `newBounds` [Rectangle](http://www.electronjs.org/docs/api/structures/rectangle) - 窗口将要被移动到的位置。

窗口移动前触发。 在Windows上，调用 `event.preventDefault()` 将阻止窗口移动。

请注意，该事件仅在手动调整窗口大小时触发。 通过 `setBounds`/`setSize` 调整窗口大小不会触发此事件。

#### [事件: 'move'](http://www.electronjs.org/docs/api/browser-window#事件-move)

窗口移动到新位置时触发

#### [事件: 'moved' ](http://www.electronjs.org/docs/api/browser-window#事件-moved-macos-windows)*macOS**Windows*

当窗口移动到新位置时触发一次

**注意**: 在 macOS 上，此事件是`move`的别名。

#### [事件: 'enter-full-screen'](http://www.electronjs.org/docs/api/browser-window#事件-enter-full-screen)

窗口进入全屏状态时触发

#### [事件: 'leave-full-screen'](http://www.electronjs.org/docs/api/browser-window#事件-leave-full-screen)

窗口离开全屏状态时触发

#### [事件: 'enter-html-full-screen'](http://www.electronjs.org/docs/api/browser-window#事件-enter-html-full-screen)

窗口进入由HTML API 触发的全屏状态时触发

#### [事件: 'leave-html-full-screen'](http://www.electronjs.org/docs/api/browser-window#事件-leave-html-full-screen)

窗口离开由HTML API触发的全屏状态时触发

#### [事件: 'always-on-top-changed'](http://www.electronjs.org/docs/api/browser-window#事件-always-on-top-changed)

返回:

- `event` Event
- `isAlwaysOnTop` Boolean

设置或取消设置窗口总是在其他窗口的顶部显示时触发。

#### [事件： 'app-command' *Windows__Linux*](http://www.electronjs.org/docs/api/browser-window#事件：-app-command-windows__linux)

返回:

- `event` Event
- `command` String

请求一个[应用程序命令](https://msdn.microsoft.com/en-us/library/windows/desktop/ms646275(v=vs.85).aspx)时触发. 典型的是键盘上的媒体键或浏览器命令, 以及在Windows上的一些鼠标中内置的“后退”按钮。

命令是小写的，下划线替换为连字符，以及`APPCOMMAND_` 前缀将被删除。 例如 `APPCOMMAND_BROWSER_BACKWARD`将被`browser-backward`触发.

```javascript
const { BrowserWindow } = require('electron')
const win = new BrowserWindow()
win.on('app-command', (e, cmd) => {
  // Navigate the window back when the user hits their mouse back button
  if (cmd === 'browser-backward' && win.webContents.canGoBack()) {
    win.webContents.goBack()
  }
})
Copy
```

以下应用命令在 Linux 上有明确地支持：

- `browser-backward`
- `browser-forward`

#### [事件: 'scroll-touch-begin' ](http://www.electronjs.org/docs/api/browser-window#事件-scroll-touch-begin-macos)*macOS*

滚轮事件阶段开始时触发

#### [事件: 'scroll-touch-end' ](http://www.electronjs.org/docs/api/browser-window#事件-scroll-touch-end-macos)*macOS*

滚轮事件阶段结束时触发

#### [事件: 'scroll-touch-edge' ](http://www.electronjs.org/docs/api/browser-window#事件-scroll-touch-edge-macos)*macOS*

滚轮事件阶段到达元素边缘时触发

#### [事件: 'swipe' ](http://www.electronjs.org/docs/api/browser-window#事件-swipe-macos)*macOS*

返回:

- `event` Event
- `direction` String

三指滑动时触发。 可能的方向是 `up`, `right`, `down`, `left`。

此事件的基本方法是用来处理旧的macOS风格的触摸板滑动，屏幕内容不会随着滑动而移动。 大多数macOS触摸板都不再允许配置这样的滑动，因此为了正确地触发该事件，需将`System Preferences > Trackpad > More Gestures`中'Swipe between pages'首选项设置为'Swipe with two or three fingers'。

#### [事件: 'rotate-gesture' ](http://www.electronjs.org/docs/api/browser-window#事件-rotate-gesture-macos)*macOS*

返回:

- `event` Event
- `rotation` Float

在触控板旋转手势上触发。 持续触发直到旋转手势结束。 每次触发的 `rotation` 值是自上次触发以来旋转的角度。 旋转手势最后一次触发的事件值永远是`0`。 逆时针旋转值为正值，顺时针旋转值为负值。

#### [事件: 'sheet-begin' ](http://www.electronjs.org/docs/api/browser-window#事件-sheet-begin-macos)*macOS*

窗口打开sheet(工作表) 时触发

#### [事件: 'sheet-end' ](http://www.electronjs.org/docs/api/browser-window#事件-sheet-end-macos)*macOS*

窗口关闭sheet(工作表) 时触发

#### [事件: 'new-window-for-tab' ](http://www.electronjs.org/docs/api/browser-window#事件-new-window-for-tab-macos)*macOS*

当点击了系统的新标签按钮时触发

#### [事件: 'system-context-menu' ](http://www.electronjs.org/docs/api/browser-window#事件-system-context-menu-windows)*Windows*

返回:

- `event` Event
- `point` [Point](http://www.electronjs.org/docs/api/structures/point) - 上下文菜单触发时的屏幕坐标。

当系统上下文菜单在窗口上触发时发出， 通常只在用户右键点击你窗口的非客户端区域时触发。 非客户端区域指的是窗口标题栏或无边框窗口中被你声明为 `-webkit-app-region: drag` 的任意区域。

调用 `event.preventDefault()` 将阻止菜单显示。

### [静态方法](http://www.electronjs.org/docs/api/browser-window#静态方法)

`BrowserWindow` 类有以下方法:

#### [`BrowserWindow.getAllWindows()`](http://www.electronjs.org/docs/api/browser-window#browserwindowgetallwindows)

返回 `BrowserWindow[]` - 所有打开的窗口的数组

#### [`BrowserWindow.getFocusedWindow()`](http://www.electronjs.org/docs/api/browser-window#browserwindowgetfocusedwindow)

返回 `BrowserWindow | null` - 此应用程序中当前获得焦点的窗口，如果无就返回 `null`.

#### [`BrowserWindow.fromWebContents(webContents)`](http://www.electronjs.org/docs/api/browser-window#browserwindowfromwebcontentswebcontents)

- `webContents` [WebContents](http://www.electronjs.org/docs/api/web-contents)

返回 `BrowserWindow | null` - 返回拥有给定 `webContents`的窗口，否则如果内容不属于一个窗口，返回`null`。

#### [`BrowserWindow.fromBrowserView(browserView)`](http://www.electronjs.org/docs/api/browser-window#browserwindowfrombrowserviewbrowserview)

- `browserView` [BrowserView](http://www.electronjs.org/docs/api/browser-view)

返回 `BrowserWindow | null` - 拥有给定 `browserView` 的窗口。 如果给定的视图没有附加到任何窗口，返回 `null`。

#### [`BrowserWindow.fromId(id)`](http://www.electronjs.org/docs/api/browser-window#browserwindowfromidid)

- `id` Integer

返回 `BrowserWindow | null` - 带有给定 `id` 的窗口。

### 实例属性

使用 `new BrowserWindow `创建的对象具有以下属性:

```javascript
const { BrowserWindow } = require('electron')
// 本例中 `win` 是我们的实例
const win = new BrowserWindow({ width: 800, height: 600 })
win.loadURL('https://github.com')
Copy
```

#### [`win.webContents` *只读*](http://www.electronjs.org/docs/api/browser-window#winwebcontents-只读)

此窗口拥有的 `WebContents` 对象。 所有与网页相关的事件和操作都将通过它完成。

有关它的方法和事件, 请参见 [`webContents` documentation](http://www.electronjs.org/docs/api/web-contents)

#### [`win.id` *只读*](http://www.electronjs.org/docs/api/browser-window#winid-只读)

一个 `Integer` 属性代表了窗口的唯一ID。 每个ID在整个Electron应用程序的所有 `BrowserWindow` 实例中都是唯一的。

#### [`win.autoHideMenuBar`](http://www.electronjs.org/docs/api/browser-window#winautohidemenubar)

一个 `Boolean` 属性决定窗口菜单栏是否自动隐藏。 一旦设置，菜单栏将只在用户单击 `Alt` 键时显示。

如果菜单栏已经可见，将该属性设置为 `true` 将不会使其立刻隐藏。

#### [`win.simpleFullScreen`](http://www.electronjs.org/docs/api/browser-window#winsimplefullscreen)

一个 `Boolean` 属性，用于决定窗口是否处于简单(pre-Lion) 全屏模式。

#### [`win.fullScreen`](http://www.electronjs.org/docs/api/browser-window#winfullscreen)

一个 `Boolean` 属性，用于决定窗口是否处于全屏模式。

#### [`win.visibleOnAllWorkspaces`](http://www.electronjs.org/docs/api/browser-window#winvisibleonallworkspaces)

一个 `Boolean` 属性，用于决定窗口是否在所有工作区中可见。

**注意：** 在 Windows 上始终返回 false。

#### [`win.shadow`](http://www.electronjs.org/docs/api/browser-window#winshadow)

一个 `Boolean` 属性，用于决定窗口是否显示阴影。

#### [`win.menuBarVisible` ](http://www.electronjs.org/docs/api/browser-window#winmenubarvisible-windows-linux)*Windows**Linux*

一个 `Boolean` 属性，用于决定菜单栏是否可见。

**注意：** 如果菜单栏自动隐藏，用户仍然可以通过单击 `Alt` 键来唤出菜单栏。

#### [`win.kiosk`](http://www.electronjs.org/docs/api/browser-window#winkiosk)

一个 `Boolean` 属性，用于决定窗口是否处于kiosk模式。

#### [`win.documentEdited` ](http://www.electronjs.org/docs/api/browser-window#windocumentedited-macos)*macOS*

一个 `Boolean` 属性指明窗口文档是否已被编辑。

当设置为 `true` 时，标题栏的图标将变灰。

#### [`win.representedFilename` ](http://www.electronjs.org/docs/api/browser-window#winrepresentedfilename-macos)*macOS*

一个 `String` 属性，用于确定窗口代表的文件的路径名，文件的图标将显示在窗口的标题栏中。

#### [`win.title`](http://www.electronjs.org/docs/api/browser-window#wintitle)

一个 `String` 属性，用于确定原生窗口的标题。

**注意：** 网页的标题可以与原生窗口的标题不同。

#### [`win.minimizable`](http://www.electronjs.org/docs/api/browser-window#winminimizable)

一个 `Boolean` 属性，用于决定窗口是否可被用户手动最小化。

在 Linux 上，setter 不会进行任何操作，尽管 getter 返回的是 `true`。

#### [`win.maximizable`](http://www.electronjs.org/docs/api/browser-window#winmaximizable)

一个 `Boolean` 属性，用于决定窗口是否可被用户手动最大化。

在 Linux 上，setter 不会进行任何操作，尽管 getter 返回的是 `true`。

#### [`win.fullScreenable`](http://www.electronjs.org/docs/api/browser-window#winfullscreenable)

一个 `Boolean` 属性，决定最大化/缩放窗口按钮是切换全屏模式还是最大化窗口。

#### [`win.resizable`](http://www.electronjs.org/docs/api/browser-window#winresizable)

一个 `Boolean` 属性，用于决定窗口是否可被用户手动调整大小。

#### [`win.closable`](http://www.electronjs.org/docs/api/browser-window#winclosable)

一个 `Boolean` 属性，用于决定窗口是否可被用户手动关闭。

在 Linux 上，setter 不会进行任何操作，尽管 getter 返回的是 `true`。

#### [`win.movable`](http://www.electronjs.org/docs/api/browser-window#winmovable)

一个 `Boolean` 属性，用于决定窗口是否可被用户移动。

在 Linux 上，setter 不会进行任何操作，尽管 getter 返回的是 `true`。

#### [`win.excludedFromShownWindowsMenu` ](http://www.electronjs.org/docs/api/browser-window#winexcludedfromshownwindowsmenu-macos)*macOS*

一个 `Boolean` 属性，用于决定窗口是否从应用程序的 Windows 菜单排除。 默认值为 `false`

```js
const win = new BrowserWindow({ height: 600, width: 600 })

const template = [
  {
    role: 'windowmenu'
  }
]

win.excludedFromShownWindowsMenu = true

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
Copy
```

#### [`win.accessibleTitle`](http://www.electronjs.org/docs/api/browser-window#winaccessibletitle)

一个 `String` 属性，定义一个仅为如屏幕阅读器等辅助工具提供的替代标题 。 此字符串不直接对用户可见

### 实例方法

使用 `new BrowserWindow `创建的对象具有以下实例方法:

**注意:** 某些方法仅在特定的操作系统上可用, 这些方法会被标记出来。

#### [`win.destroy()`](http://www.electronjs.org/docs/api/browser-window#windestroy)

强制关闭窗口, 除了`closed`之外，`close`，`unload` 和 `beforeunload` 都不会被触发

#### [`win.close()`](http://www.electronjs.org/docs/api/browser-window#winclose)

尝试关闭窗口。 该方法与用户手动单击窗口的关闭按钮效果相同。 但网页可能会取消这个关闭操作。 查看 [关闭事件](http://www.electronjs.org/docs/api/browser-window#event-close)。

#### [`win.focus()`](http://www.electronjs.org/docs/api/browser-window#winfocus)

聚焦于窗口

#### [`win.blur()`](http://www.electronjs.org/docs/api/browser-window#winblur)

取消窗口的聚焦

#### [`win.isFocused()`](http://www.electronjs.org/docs/api/browser-window#winisfocused)

返回 `Boolean` - 判断窗口是否聚焦

#### [`win.isDestroyed()`](http://www.electronjs.org/docs/api/browser-window#winisdestroyed)

返回 `Boolean` -判断窗口是否被销毁

#### [`win.show()`](http://www.electronjs.org/docs/api/browser-window#winshow)

显示并聚焦于窗口

#### [`win.showInactive()`](http://www.electronjs.org/docs/api/browser-window#winshowinactive)

显示但不聚焦于窗口

#### [`win.hide()`](http://www.electronjs.org/docs/api/browser-window#winhide)

隐藏窗口

#### [`win.isVisible()`](http://www.electronjs.org/docs/api/browser-window#winisvisible)

返回 `Boolean` - 判断窗口是否可见

#### [`win.isModal()`](http://www.electronjs.org/docs/api/browser-window#winismodal)

返回 `Boolean` - 判断是否为模态窗口

#### [`win.maximize()`](http://www.electronjs.org/docs/api/browser-window#winmaximize)

最大化窗口。 如果窗口尚未显示，该方法也会将其显示 (但不会聚焦)。

#### [`win.unmaximize()`](http://www.electronjs.org/docs/api/browser-window#winunmaximize)

取消窗口最大化

#### [`win.isMaximized()`](http://www.electronjs.org/docs/api/browser-window#winismaximized)

返回 `Boolean` - 判断窗口是否最大化

#### [`win.minimize()`](http://www.electronjs.org/docs/api/browser-window#winminimize)

最小化窗口。 在某些平台上, 最小化的窗口将显示在Dock中。

#### [`win.restore()`](http://www.electronjs.org/docs/api/browser-window#winrestore)

将窗口从最小化状态恢复到以前的状态。

#### [`win.isMinimized()`](http://www.electronjs.org/docs/api/browser-window#winisminimized)

返回 `Boolean` -判断窗口是否最小化

#### [`win.setFullScreen(flag)`](http://www.electronjs.org/docs/api/browser-window#winsetfullscreenflag)

- `flag` Boolean

设置窗口是否应处于全屏模式。

#### [`win.isFullScreen()`](http://www.electronjs.org/docs/api/browser-window#winisfullscreen)

返回 `Boolean` - 窗口当前是否已全屏

#### [`win.setSimpleFullScreen(flag)` ](http://www.electronjs.org/docs/api/browser-window#winsetsimplefullscreenflag-macos)*macOS*

- `flag` Boolean

进入或离开简单的全屏模式。

简单全屏模式模拟了 Lion (10.7) 之前的macOS版本中的原生全屏行为。

#### [`win.isSimpleFullScreen()` ](http://www.electronjs.org/docs/api/browser-window#winissimplefullscreen-macos)*macOS*

返回 `Boolean` - 窗口是否为简单全屏模式(pre-Lion)。

#### [`win.isNormal()`](http://www.electronjs.org/docs/api/browser-window#winisnormal)

返回 `Boolean` - 窗口是否处于正常状态（未最大化，未最小化，不在全屏模式下）。

#### [`win.setAspectRatio(aspectRatio[, extraSize\])`](http://www.electronjs.org/docs/api/browser-window#winsetaspectratioaspectratio-extrasize)

- `aspectRatio` Float- 为内容视图保持的宽高比.
- `extraSize` [Size](http://www.electronjs.org/docs/api/structures/size) (可选) *macOS* - 保持宽高比时不包括的额外大小。

这将使窗口保持长宽比。 额外的大小允许开发人员有空间 (以像素为单位), 不包括在纵横比计算中。 此 API 已经考虑了窗口大小和内容大小之间的差异。

想象一个使用高清视频播放器和相关控件的普通窗口。 假假如左边缘有15px, 右边缘有25px, 在播放器下面有50px. 为了保持播放器本身16:9 的长宽比 (标准的HD长宽比为1920x1080)， 我们可以使用 16/9 和 { width: 40, height: 50 } 的参数调用这个函数。 第二个参数不管网页中的额外的宽度和高度在什么位置, 只要它们存在就行. 在全部内部窗口中，加上任何额外的宽度和高度 。

当窗口使用类似于 `win.setSize` 这样的 API 调整窗口时，宽高比不会被采用。

#### [`win.setBackgroundColor(backgroundColor)`](http://www.electronjs.org/docs/api/browser-window#winsetbackgroundcolorbackgroundcolor)

- `backgroundColor` String - 十六进制的窗口背景色，如 `#66CD00`、`#FFF`和`#80FFFFFF`。 (如果`transparent`是`true`的话，也支持alpha 通道。) 默认值为 `#FFF`（白色）。

设置窗口的背景颜色。 请参阅 [设置`背景颜色`](http://www.electronjs.org/docs/api/browser-window#setting-backgroundcolor)。

#### [`win.previewFile(path[, displayName\])` ](http://www.electronjs.org/docs/api/browser-window#winpreviewfilepath-displayname-macos)*macOS*

- `path` String -要用 QuickLook 预览的文件的绝对路径。 这一点很重要，因为Quick Look 使用了路径上的文件名和文件扩展名 来决定要打开的文件的内容类型。
- `displayName` String (可选) - 在Quick Look 模态视图中显示的文件的名称。 这完全是视觉的，不会影响文件的内容类型。 默认值为 `path`.

使用 [Quick Look](https://en.wikipedia.org/wiki/Quick_Look)来预览路径中的文件.

#### [`win.closeFilePreview()` ](http://www.electronjs.org/docs/api/browser-window#winclosefilepreview-macos)*macOS*

关闭当前打开的 [Quick Look](https://en.wikipedia.org/wiki/Quick_Look) 面板.

#### [`win.setBounds(bounds[, animate\])`](http://www.electronjs.org/docs/api/browser-window#winsetboundsbounds-animate)

- `bounds` Partial<[Rectangle](http://www.electronjs.org/docs/api/structures/rectangle)>
- `animate` Boolean (可选) *macOS*

重置窗口，并且移动窗口到指定的位置. 任何未提供的属性将默认为其当前值。

```javascript
const { BrowserWindow } = require('electron')
const win = new BrowserWindow()

// set all bounds properties
win.setBounds({ x: 440, y: 225, width: 800, height: 600 })

// set a single bounds property
win.setBounds({ width: 100 })

// { x: 440, y: 225, width: 100, height: 600 }
console.log(win.getBounds())
Copy
```

#### [`win.getBounds()`](http://www.electronjs.org/docs/api/browser-window#wingetbounds)

返回 [`Rectangle`](http://www.electronjs.org/docs/api/structures/rectangle) - 窗口的 `bounds` 作为 `Object`。

#### [`win.getBackgroundColor()`](http://www.electronjs.org/docs/api/browser-window#wingetbackgroundcolor)

返回 `String` - 获取窗口的背景颜色。 请参阅 [设置`背景颜色`](http://www.electronjs.org/docs/api/browser-window#setting-backgroundcolor)。

#### [`win.setContentBounds(bounds[, animate\])`](http://www.electronjs.org/docs/api/browser-window#winsetcontentboundsbounds-animate)

- `bounds` [Rectangle](http://www.electronjs.org/docs/api/structures/rectangle)
- `animate` Boolean (可选) *macOS*

调整窗口的工作区 (如网页) 的大小并将其移动到所提供的边界。

#### [`win.getContentBounds()`](http://www.electronjs.org/docs/api/browser-window#wingetcontentbounds)

返回 [`Rectangle`](http://www.electronjs.org/docs/api/structures/rectangle) - 窗口客户端区域的 `bounds` `对象`。

#### [`win.getNormalBounds()`](http://www.electronjs.org/docs/api/browser-window#wingetnormalbounds)

返回 [`Rectangle`](http://www.electronjs.org/docs/api/structures/rectangle) - 包含正常状态下的窗口大小。

**注意：**无论当前的窗口状态为：最大化、最小化或者全屏，这个方法都将得到窗口在正常显示状态下的位置信息以及大小信息。 在正常状态下，getBounds 与 getNormalBounds 得到的边界信息 [`Rectangle`](http://www.electronjs.org/docs/api/structures/rectangle) 是一致的。

#### [`win.setEnabled(enable)`](http://www.electronjs.org/docs/api/browser-window#winsetenabledenable)

- `enable` Boolean

禁用或者启用窗口。

#### [`win.isEnabled()`](http://www.electronjs.org/docs/api/browser-window#winisenabled)

返回 `Boolean` - 窗口是否启用。

#### [`win.setSize(width, height[, animate\])`](http://www.electronjs.org/docs/api/browser-window#winsetsizewidth-height-animate)

- `width` Integer
- `height` Integer
- `animate` Boolean (可选) *macOS*

调整窗口的`width`和 `height`. 如果 `width` 或 `height` 低于任何设定的最小尺寸约束，窗口将对齐到约束的最小尺寸。

#### [`win.getSize()`](http://www.electronjs.org/docs/api/browser-window#wingetsize)

返回 `Integer []`-包含窗口的宽度和高度。

#### [`win.setContentSize(width, height[, animate\])`](http://www.electronjs.org/docs/api/browser-window#winsetcontentsizewidth-height-animate)

- `width` Integer
- `height` Integer
- `animate` Boolean (可选) *macOS*

将窗口的工作区 (如网页) 的大小调整为 `width` 和 `height`。

#### [`win.getContentSize()`](http://www.electronjs.org/docs/api/browser-window#wingetcontentsize)

返回 `Integer []`-包含窗口的宽度和高度。

#### [`win.setMinimumSize(width, height)`](http://www.electronjs.org/docs/api/browser-window#winsetminimumsizewidth-height)

- `width` Integer
- `height` Integer

设置窗口最小化的 `width` 和`height`.

#### [`win.getMinimumSize()`](http://www.electronjs.org/docs/api/browser-window#wingetminimumsize)

返回 `Integer []`-包含窗口最小化的宽度和高度。

#### [`win.setMaximumSize(width, height)`](http://www.electronjs.org/docs/api/browser-window#winsetmaximumsizewidth-height)

- `width` Integer
- `height` Integer

设置窗口最大化的 `width` 和 `height`.

#### [`win.getMaximumSize()`](http://www.electronjs.org/docs/api/browser-window#wingetmaximumsize)

返回 `Integer []`-包含窗口最大化的宽度和高度。

#### [`win.setResizable(resizable)`](http://www.electronjs.org/docs/api/browser-window#winsetresizableresizable)

- `resizable` Boolean

设置用户是否可以手动调整窗口大小。

#### [`win.isResizable()`](http://www.electronjs.org/docs/api/browser-window#winisresizable)

返回 `Boolean` - 用户是否可以手动调整窗口大小。

#### [`win.setMovable(movable)` ](http://www.electronjs.org/docs/api/browser-window#winsetmovablemovable-macos-windows)*macOS**Windows*

- `movable` Boolean

设置用户是否可以移动窗口。 在Linux上不起作用。

#### [`win.isMovable()` ](http://www.electronjs.org/docs/api/browser-window#winismovable-macos-windows)*macOS**Windows*

返回 `Boolean` - 窗口是否可以被用户拖动

在 Linux 上总是返回 `true`。

#### [`win.setMinimizable(minimizable)` ](http://www.electronjs.org/docs/api/browser-window#winsetminimizableminimizable-macos-windows)*macOS**Windows*

- `minimizable` Boolean

设置用户是否可以手动将窗口最小化。 在Linux上不起作用。

#### [`win.isMinimizable()` ](http://www.electronjs.org/docs/api/browser-window#winisminimizable-macos-windows)*macOS**Windows*

返回 `Boolean` - 用户是否可以手动最小化窗口。

在 Linux 上总是返回 `true`。

#### [`win.setMaximizable(maximizable)` ](http://www.electronjs.org/docs/api/browser-window#winsetmaximizablemaximizable-macos-windows)*macOS**Windows*

- `maximizable` Boolean

设置用户是否可以手动最大化窗口。 在Linux上不起作用。

#### [`win.isMaximizable()` ](http://www.electronjs.org/docs/api/browser-window#winismaximizable-macos-windows)*macOS**Windows*

返回 `Boolean` - 窗口是否可以最大化.

在 Linux 上总是返回 `true`。

#### [`win.setFullScreenable(fullscreenable)`](http://www.electronjs.org/docs/api/browser-window#winsetfullscreenablefullscreenable)

- `fullscreenable` Boolean

设置最大化/缩放窗口按钮是切换全屏模式还是最大化窗口。

#### [`win.isFullScreenable()`](http://www.electronjs.org/docs/api/browser-window#winisfullscreenable)

返回 `Boolean` - 最大化/缩放窗口按钮是切换全屏模式还是最大化窗口。

#### [`win.setClosable(closable)` ](http://www.electronjs.org/docs/api/browser-window#winsetclosableclosable-macos-windows)*macOS**Windows*

- `closable` Boolean

设置用户是否可以手动关闭窗口。 在Linux上不起作用。

#### [`win.isClosable()` ](http://www.electronjs.org/docs/api/browser-window#winisclosable-macos-windows)*macOS**Windows*

返回 `Boolean` - 窗口是否被用户关闭了.

在 Linux 上总是返回 `true`。

#### [`win.setAlwaysOnTop(flag[, level\][, relativeLevel])`](http://www.electronjs.org/docs/api/browser-window#winsetalwaysontopflag-level-relativelevel)

- `flag` Boolean
- `level` String (可选) *macOS* *Windows* - 值包括 `normal`, `floating`, `torn-off-menu`, `modal-panel`, `main-menu`, `status`, `pop-up-menu`, `screen-saver`和 ~~`dock`~~(已弃用)。 当 `flag` 属性为true时，默认值为 `floating` 。 当flag为false时，`level` 会重置为 `normal`。 请注意，包括从 `floating` 到 `status` ，窗口会被置于 macOS 上的 Dock 下方和 Windows 上的任务栏下方。 从 `pop-up-menu` 到更高级别，窗口显示在 macOS 上的Dock上方和 Windows 上的任务栏上方。 更多信息，请查阅 [macOS 文档](https://developer.apple.com/documentation/appkit/nswindow/level)。
- `relativeLevel` Integer (可选) *macOS* - 设置此窗口相对于给定 `级别`的层数。. 默认值为`0`. 请注意, Apple 不鼓励在 `屏幕保护程序` 之上设置高于1的级别。

设置窗口是否应始终显示在其他窗口的前面。 设置后，窗口仍然是一个正常窗口，而不是一个无法获取焦点的工具框窗口。

#### [`win.isAlwaysOnTop()`](http://www.electronjs.org/docs/api/browser-window#winisalwaysontop)

返回 `Boolean` - 当前窗口是否始终在其它窗口之前.

#### [`win.moveAbove(mediaSourceId)`](http://www.electronjs.org/docs/api/browser-window#winmoveabovemediasourceid)

- `mediaSourceId` String - DesktopCapturerSource格式的窗口 id 。 例如 "window:1869:0"。

将窗口按z轴顺序移动到源窗口前面。 如果 `mediaSourceId` 不是window类型，或者如果窗口不存在，则此方法会抛出一个错误。

#### [`win.moveTop()`](http://www.electronjs.org/docs/api/browser-window#winmovetop)

无论焦点如何, 将窗口移至顶端(z轴上的顺序).

#### [`win.center()`](http://www.electronjs.org/docs/api/browser-window#wincenter)

将窗口移动到屏幕中央。

#### [`win.setPosition(x, y[, animate\])`](http://www.electronjs.org/docs/api/browser-window#winsetpositionx-y-animate)

- `x` Integer
- `y` Integer
- `animate` Boolean (可选) *macOS*

将窗口移动到 `x` 和 `y`。

#### [`win.getPosition()`](http://www.electronjs.org/docs/api/browser-window#wingetposition)

返回 `Integer[]` - 返回一个包含当前窗口位置的数组.

#### [`win.setTitle(title)`](http://www.electronjs.org/docs/api/browser-window#winsettitletitle)

- `title` String

将原生窗口的标题更改为 `title`。

#### [`win.getTitle()`](http://www.electronjs.org/docs/api/browser-window#wingettitle)

返回 `String`-原生窗口的标题。

**注意：** 网页的标题可以与原生窗口的标题不同。

#### [`win.setSheetOffset(offsetY[, offsetX\])` ](http://www.electronjs.org/docs/api/browser-window#winsetsheetoffsetoffsety-offsetx-macos)*macOS*

- `offsetY` Float
- `offsetX` Float (可选)

改变macOS上sheet组件的附着点。 默认情况下，sheet贴在窗口边框正下方，但你可能需要在 HTML 渲染工具栏下方显示它们。 例如：

```javascript
const { BrowserWindow } = require('electron')
const win = new BrowserWindow()

const toolbarRect = document.getElementById('toolbar').getBoundingClientRect()
win.setSheetOffset(toolbarRect.height)
Copy
```

#### [`win.flashFrame(flag)`](http://www.electronjs.org/docs/api/browser-window#winflashframeflag)

- `flag` Boolean

启动或停止闪烁窗口, 以吸引用户的注意。

#### [`win.setSkipTaskbar(skip)`](http://www.electronjs.org/docs/api/browser-window#winsetskiptaskbarskip)

- `skip` Boolean

使窗口不显示在任务栏中。

#### [`win.setKiosk(flag)`](http://www.electronjs.org/docs/api/browser-window#winsetkioskflag)

- `flag` Boolean

进入或离开 kiosk 模式。

#### [`win.isKiosk()`](http://www.electronjs.org/docs/api/browser-window#winiskiosk)

返回 `Boolean` - 判断窗口是否处于kiosk模式.

#### [`win.isTabletMode()` ](http://www.electronjs.org/docs/api/browser-window#winistabletmode-windows)*Windows*

返回 `Boolean` - 无论当前窗口是否处在 Windows 10 平板模式

因为 Windows 10 用户可以 [将他们的 PC 作为平板电脑来使用](https://support.microsoft.com/en-us/help/17210/windows-10-use-your-pc-like-a-tablet)，在此模式下，应用可以选择为平板电脑的界面做出优化，如扩展标题栏和隐藏标题栏按钮。

此 API 返回 窗口是否在平板电脑模式下，并且 `调整大小` 事件可以用于监听对平板模式的更改。

#### [`win.getMediaSourceId()`](http://www.electronjs.org/docs/api/browser-window#wingetmediasourceid)

返回 `String` - DesktopCapturerSource的id格式的窗口 id 。 例如 "window:1324:0"。

更确切地说，格式是 `window:id:other_id`。在Windows上 `id` 是 `HWND` 类型；在macOS上是 `CGWindowID` (`uint64_t`)；在Linux上是 `Window` (`unsigned long`)。 `other_id` 用于识别同一顶层窗口内的Web 内容 (选项卡)。

#### [`win.getNativeWindowHandle()`](http://www.electronjs.org/docs/api/browser-window#wingetnativewindowhandle)

返回 `Buffer` - 窗口的平台特定句柄

Windows上句柄类型为 `HWND`，macOS 上为 `NSView*`，Linux 上为`Window` (`unsigned long`)

#### [`win.hookWindowMessage(message, callback)` ](http://www.electronjs.org/docs/api/browser-window#winhookwindowmessagemessage-callback-windows)*Windows*

- `message` Integer

- ```
  callback
  ```

   

  Function

  - `wParam` any - 提供给 WndProc的 `wParam` 值。
  - `lParam` any - 提供给 WndProc的 `lParam` 值。

钩住窗口消息。 当消息到达 WndProc 时调用`callback` 。

#### [`win.isWindowMessageHooked(message)` ](http://www.electronjs.org/docs/api/browser-window#winiswindowmessagehookedmessage-windows)*Windows*

- `message` Integer

返回 `Boolean` - `true` 或`false` ，具体取决于是否钩挂了消息.

#### [`win.unhookWindowMessage(message)` ](http://www.electronjs.org/docs/api/browser-window#winunhookwindowmessagemessage-windows)*Windows*

- `message` Integer

取消窗口信息的钩子。

#### [`win.unhookAllWindowMessages()` ](http://www.electronjs.org/docs/api/browser-window#winunhookallwindowmessages-windows)*Windows*

取消所有窗口信息的钩子。

#### [`win.setRepresentedFilename(filename)` ](http://www.electronjs.org/docs/api/browser-window#winsetrepresentedfilenamefilename-macos)*macOS*

- `filename` String

设置窗口所代表的文件的路径名，并且将这个文件的图标放在窗口标题栏上。

#### [`win.getRepresentedFilename()` ](http://www.electronjs.org/docs/api/browser-window#wingetrepresentedfilename-macos)*macOS*

返回 `String` - 获取窗口当前文件路径.

#### [`win.setDocumentEdited(edited)` ](http://www.electronjs.org/docs/api/browser-window#winsetdocumenteditededited-macos)*macOS*

- `edited` Boolean

明确指出窗口文档是否可以编辑, 如果设置为`true`则将标题栏的图标变成灰色.

#### [`win.isDocumentEdited()` ](http://www.electronjs.org/docs/api/browser-window#winisdocumentedited-macos)*macOS*

返回 `Boolean` - 判断当前窗口文档是否可编辑.

#### [`win.focusOnWebView()`](http://www.electronjs.org/docs/api/browser-window#winfocusonwebview)

#### [`win.blurWebView()`](http://www.electronjs.org/docs/api/browser-window#winblurwebview)

#### [`win.capturePage([rect\])`](http://www.electronjs.org/docs/api/browser-window#wincapturepagerect)

- `rect` [Rectangle](http://www.electronjs.org/docs/api/structures/rectangle) (可选) - 捕获的区域

返回 `Promise<NativeImage>` - 完成后返回一个[NativeImage](http://www.electronjs.org/docs/api/native-image)

在 `rect`内捕获页面的快照。 省略 `rect` 将捕获整个可见页面。 如果页面不可见， `rect` 可能是空的。

#### [`win.loadURL(url[, options\])`](http://www.electronjs.org/docs/api/browser-window#winloadurlurl-options)

- `url` String

- ```
  options
  ```

   

  Object (可选)

  - `httpReferrer` (String | [Referrer](http://www.electronjs.org/docs/api/structures/referrer)) (可选) - HTTP 引用 url。
  - `userAgent` String (可选) - 发起请求的 userAgent.
  - `extraHeaders` String (可选) - 用 "\n" 分割的额外标题
  - `postData` ([UploadRawData](http://www.electronjs.org/docs/api/structures/upload-raw-data) | [UploadFile](http://www.electronjs.org/docs/api/structures/upload-file))
  - `baseURLForDataURL` String (可选) - 要由数据URL加载的文件基本URL(末尾带有路径分隔符)。 仅当指定的`url`是数据url并且需要加载其他文件时，才需要此选项。

返回 `Promise<void>` - 当页面完成加载后 promise 将会resolve (见 [`did-finish-load`](http://www.electronjs.org/docs/api/web-contents#event-did-finish-load))，如果页面加载失败，则 reject (见 [`did-fail-load`](http://www.electronjs.org/docs/api/web-contents#event-did-fail-load))。

与 [`webContents.loadURL(url[, options\])`](http://www.electronjs.org/docs/api/web-contents#contentsloadurlurl-options) 相同。

`url` 可以是远程地址 (例如 `http://`),也可以是 `file://` 协议的本地HTML文件的路径.

为了确保文件网址格式正确, 建议使用Node的 [`url.format`](https://nodejs.org/api/url.html#url_url_format_urlobject) 方法:

```javascript
const url = require('url').format({
  protocol: 'file',
  slashes: true,
  pathname: require('path').join(__dirname, 'index.html')
})

win.loadURL(url)
Copy
```

您可以通过执行以下操作, 使用带有网址编码数据的 `POST`请求加载网址:

```javascript
win.loadURL('http://localhost:8000/post', {
  postData: [{
    type: 'rawData',
    bytes: Buffer.from('hello=world')
  }],
  extraHeaders: 'Content-Type: application/x-www-form-urlencoded'
})
Copy
```

#### [`win.loadFile(filePath[, options\])`](http://www.electronjs.org/docs/api/browser-window#winloadfilefilepath-options)

- `filePath` String

- ```
  options
  ```

   

  Object (可选)

  - `query` Record<String, String> (可选) - 传递给 `url.format()`.
  - `search` String (可选) - 传递给 `url.format()`.
  - `hash` String (可选) - 传递给 `url.format()`.

返回 `Promise<void>` - 当页面完成加载后 promise 将会resolve (见 [`did-finish-load`](http://www.electronjs.org/docs/api/web-contents#event-did-finish-load))，如果页面加载失败，则 reject (见 [`did-fail-load`](http://www.electronjs.org/docs/api/web-contents#event-did-fail-load))。

与 `webContents.loadFile`相同， `filePath` 应该是一个与你的应用程序的根路径相关的HTML文件路径。 有关更多信息，请参阅`webContents` 文档。

#### [`win.reload()`](http://www.electronjs.org/docs/api/browser-window#winreload)

与 `webContents.reload` 相同.

#### [`win.setMenu(menu)` ](http://www.electronjs.org/docs/api/browser-window#winsetmenumenu-linux-windows)*Linux**Windows*

- `menu` Menu | null

将 `menu` 设置为窗口的菜单栏。

#### [`win.removeMenu()` ](http://www.electronjs.org/docs/api/browser-window#winremovemenu-linux-windows)*Linux**Windows*

删除窗口的菜单栏。

#### [`win.setProgressBar(progress[, options\])`](http://www.electronjs.org/docs/api/browser-window#winsetprogressbarprogress-options)

- `progress` Double

- ```
  options
  ```

   

  Object (可选)

  - `mode` String *Windows* - 进度条的状态。 可以是 `none`， `normal`， `indeterminate`， `error` 或 `paused`。

设置进度条的进度值。 有效范围为 [0, 1.0]。

当进度小于0时不显示进度; 当进度大于0时显示结果不确定.

在 Linux 平台上，只支持 Unity 桌面模式, 你需要在 `package.json` 中为 `desktopName` 指定 `*.desktop` 的文件名. 默认情况下，将取 `{app.name}.desktop`。

在 Windows 上, 可以传递模式。 可以接受的值为`none`, `normal`, `indeterminate`, `error`和 `paused`. 如果没有设置模式 (但值在有效范围内) 的情况下调用 `setProgressBar`, 默认值为`normal`。

#### [`win.setOverlayIcon(overlay, description)` ](http://www.electronjs.org/docs/api/browser-window#winsetoverlayiconoverlay-description-windows)*Windows*

- `overlay` [NativeImage](http://www.electronjs.org/docs/api/native-image) | null - 右下角任务栏的显示图标。 如果此参数是 `null`，覆盖层层会被清除。
- `description` String -提供给屏幕阅读器的描述文字

在当前任务栏图标上设置一个 16 x 16 像素的图标, 通常用于传达某种应用程序状态或被动地通知用户。

#### [`win.setHasShadow(hasShadow)`](http://www.electronjs.org/docs/api/browser-window#winsethasshadowhasshadow)

- `hasShadow` Boolean

设置窗口是否有阴影。

#### [`win.hasShadow()`](http://www.electronjs.org/docs/api/browser-window#winhasshadow)

返回 `Boolean` - 判断窗口是否有阴影.

#### [`win.setOpacity(opacity)` ](http://www.electronjs.org/docs/api/browser-window#winsetopacityopacity-windows-macos)*Windows**macOS*

- `opacity` Number - 介于0.0 ( 完全透明 ) 和1.0 ( 完全不透明 ) 之间

设置窗口的不透明度。 在Linux上不起作用。 超出界限的数值被限制在[0, 1] 范围内。

#### [`win.getOpacity()`](http://www.electronjs.org/docs/api/browser-window#wingetopacity)

返回 `Number` - 介于0.0 (完全透明) 和1.0 (完全不透明) 之间。 在Linux上，始终返回1。

#### [`win.setShape(rects)` *实验性*](http://www.electronjs.org/docs/api/browser-window#winsetshaperects-windows-linux-实验性)*Windows**Linux*

- `rects` [Rectangle[\]](http://www.electronjs.org/docs/api/structures/rectangle) - 在窗口上设置形状。 通过传入空列表将窗口恢复为矩形。

对窗口形状的设置决定了窗口内系统允许绘制与用户交互的区域. 在给定的区域外, 没有像素会被绘制, 且没有鼠标事件会被登记. 在该区域外的鼠标事件将不会被该窗口接收, 而是落至该窗口后方的任意窗口.

#### [`win.setThumbarButtons(buttons)` ](http://www.electronjs.org/docs/api/browser-window#winsetthumbarbuttonsbuttons-windows)*Windows*

- `buttons` [ThumbarButton[\]](http://www.electronjs.org/docs/api/structures/thumbar-button)

返回 `Boolean` - 按钮是否成功添加

将指定的一组按钮添加到菜单栏的缩图工具栏上。 返回一个 `Boolean` 对象表示是否成功地添加了缩略图.

由于空间有限, 缩图工具栏中的按钮数量不要超过7个。 一旦设置了缩略图工具栏，则无法删除。 但你可以通过调用 API 传递一个空数组来清除按钮.

`buttons` 是一个 `Button` 对象的数组:

- ```
  Button
  ```

   

  Object

  - `icon` [NativeImage](http://www.electronjs.org/docs/api/native-image) - 在缩图工具栏上显示的图标.
  - `click` Function
  - `tooltip` String (可选) - 按钮的提示文本.
  - `flags` String - 控制按钮的特定状态和行为。 默认情况下，值为 `['enabled']`。

`flags` 属性是一个数组，包含以下`String`类型的值:

- `enabled` - 该按钮处于活动状态并可供用户使用.
- `disabled` - 按钮已禁用。 会以一种视觉状态表示它不会响应用户操作的形式显示。
- `dismissonclick` - 当按钮被点击时，缩略图窗口立即关闭。
- `nobackground` - 不可以画按钮边框，只能使用图片背景。
- `hidden` - 该按钮对用户不可见。
- `noninteractive` - 按钮已启用，但不交互；不绘制按钮按下的状态。 此值用于在通知中使用按钮的实例。

#### [`win.setThumbnailClip(region)` ](http://www.electronjs.org/docs/api/browser-window#winsetthumbnailclipregion-windows)*Windows*

- `region` [Rectangle](http://www.electronjs.org/docs/api/structures/rectangle) 窗口的区域

将窗口的区域设置为在任务栏中悬停在窗口上方时显示的缩略图图像。 通过指定空区域：`{ x: 0, y: 0, width: 0, height: 0 }`，可以重置整个窗口的缩略图。

#### [`win.setThumbnailToolTip(toolTip)` ](http://www.electronjs.org/docs/api/browser-window#winsetthumbnailtooltiptooltip-windows)*Windows*

- `toolTip` String

设置在任务栏中悬停在窗口缩略图上时显示的工具提示。

#### [`win.setAppDetails(options)` ](http://www.electronjs.org/docs/api/browser-window#winsetappdetailsoptions-windows)*Windows*

- ```
  选项
  ```

   

  对象

  - `appId` String (可选) - 窗口的 [App User Model ID](https://msdn.microsoft.com/en-us/library/windows/desktop/dd391569(v=vs.85).aspx). 该项必须设置, 否则其他选项将没有效果.
  - `appIconPath` String (可选) -窗口的 [Relaunch Icon](https://msdn.microsoft.com/en-us/library/windows/desktop/dd391573(v=vs.85).aspx).
  - `appIconIndex` Integer (可选) - `appIconPath`中的图标索引。 未设置 `appIconPath` 时忽略。 默认值为 `0`
  - `relaunchCommand` String (可选) - 窗口的 [重新启动命令](https://msdn.microsoft.com/en-us/library/windows/desktop/dd391571(v=vs.85).aspx).
  - `relaunchDisplayName` String (可选) - 窗口的[重新启动显示名称](https://msdn.microsoft.com/en-us/library/windows/desktop/dd391572(v=vs.85).aspx).

设置窗口任务栏按钮的属性。

**注意：**必须始终同时设置 `relaunchCommand` 和 `relaunchDisplayName`。 如果其中一个属性没有设置，那么这两个属性都不会使用。

#### [`win.showDefinitionForSelection()` ](http://www.electronjs.org/docs/api/browser-window#winshowdefinitionforselection-macos)*macOS*

和 `webContents.showDefinitionForSelection()` 相同.

#### [`win.setIcon(icon)` ](http://www.electronjs.org/docs/api/browser-window#winseticonicon-windows-linux)*Windows**Linux*

- `icon` [NativeImage](http://www.electronjs.org/docs/api/native-image) | String

设置窗口图标

#### [`win.setWindowButtonVisibility(visible)` ](http://www.electronjs.org/docs/api/browser-window#winsetwindowbuttonvisibilityvisible-macos)*macOS*

- `visible` Boolean

设置是否窗口交通灯需要显示。

#### [`win.setAutoHideMenuBar(hide)`](http://www.electronjs.org/docs/api/browser-window#winsetautohidemenubarhide)

- `hide` Boolean

设置窗口菜单栏是否自动隐藏。 一旦设置，菜单栏将只在用户单击 `Alt` 键时显示。

如果菜单栏已经可见, 调用 `setAutoHideMenuBar(true)`时不会立刻隐藏。

#### [`win.isMenuBarAutoHide()`](http://www.electronjs.org/docs/api/browser-window#winismenubarautohide)

返回 `Boolean` - 判断窗口的菜单栏是否自动隐藏.

#### [`win.setMenuBarVisibility(visible)` ](http://www.electronjs.org/docs/api/browser-window#winsetmenubarvisibilityvisible-windows-linux)*Windows**Linux*

- `visible` Boolean

设置菜单栏是否可见。 如果菜单栏自动隐藏，用户仍然可以通过单击 `Alt` 键来唤出菜单栏。

#### [`win.isMenuBarVisible()`](http://www.electronjs.org/docs/api/browser-window#winismenubarvisible)

返回 `Boolean` - 判断窗口的菜单栏是否可见.

#### [`win.setVisibleOnAllWorkspaces(visible[, options\])`](http://www.electronjs.org/docs/api/browser-window#winsetvisibleonallworkspacesvisible-options)

- `visible` Boolean

- ```
  options
  ```

   

  Object (可选)

  - `visibleOnFullScreen` Boolean (optional) *macOS* - Sets whether the window should be visible above fullscreen windows.
  - `skipTransformProcessType` Boolean (optional) *macOS* - Calling setVisibleOnAllWorkspaces will by default transform the process type between UIElementApplication and ForegroundApplication to ensure the correct behavior. However, this will hide the window and dock for a short time every time it is called. If your window is already of type UIElementApplication, you can bypass this transformation by passing true to skipTransformProcessType.

设置窗口是否在所有工作空间上可见

**注意:** 该 API 在 Windows 上无效.

#### [`win.isVisibleOnAllWorkspaces()`](http://www.electronjs.org/docs/api/browser-window#winisvisibleonallworkspaces)

返回 `Boolean` - 判断窗口是否在所有工作空间上可见.

**注意:** 该 API 在 Windows 上始终返回 false.

#### [`win.setIgnoreMouseEvents(ignore[, options\])`](http://www.electronjs.org/docs/api/browser-window#winsetignoremouseeventsignore-options)

- `ignore` Boolean

- ```
  options
  ```

   

  Object (可选)

  - `forward` Boolean (可选) *macOS* *Windows* - 如果为 true, 传递鼠标移动消息给 Chromium，鼠标相关事件将可用，如 `mouseleave`。 仅当` ignore </ 0>为 true 时才被使用。 如果 <code>ignore` 为 false, 转发始终是禁用的，不管这个值是什么。

忽略窗口内的所有鼠标事件

在此窗口中发生的所有鼠标事件将被传递到此窗口下面的窗口, 但如果此窗口具有焦点, 它仍然会接收键盘事件

#### [`win.setContentProtection(enable)` ](http://www.electronjs.org/docs/api/browser-window#winsetcontentprotectionenable-macos-windows)*macOS**Windows*

- `enable` Boolean

防止窗口内容被其他应用捕获

在 macOS 上，它将 NSWindow 的 sharingType 设置为 NSWindowSharingNone。 在 Windows 上，它以参数为 `WDA_EXCLUDEFROMCAPTURE` 调用 SetWindowDisplayAffinity 。 对于 Windows 10 2004以上版，本窗口将完全从抓取中移除，在低版本 Windows 上其行为就像是 `WDA_MONITOR` 捕捉了黑色窗口。

#### [`win.setFocusable(focusable)` ](http://www.electronjs.org/docs/api/browser-window#winsetfocusablefocusable-macos-windows)*macOS**Windows*

- `focusable` Boolean

设置窗口是否可聚焦

在 macOS 上，该方法不会从窗口中移除焦点。

#### [`win.setParentWindow(parent)`](http://www.electronjs.org/docs/api/browser-window#winsetparentwindowparent)

- `parent` BrowserWindow | null

设置 `parent` 为当前窗口的父窗口. 为`null`时表示将当前窗口转为顶级窗口

#### [`win.getParentWindow()`](http://www.electronjs.org/docs/api/browser-window#wingetparentwindow)

返回 `BrowserWindow` - 父窗口.

#### [`win.getChildWindows()`](http://www.electronjs.org/docs/api/browser-window#wingetchildwindows)

返回 `BrowserWindow[]` - 首页的子窗口.

#### [`win.setAutoHideCursor(autoHide)` ](http://www.electronjs.org/docs/api/browser-window#winsetautohidecursorautohide-macos)*macOS*

- `autoHide` Boolean

设置输入时是否隐藏光标

#### [`win.selectPreviousTab()` ](http://www.electronjs.org/docs/api/browser-window#winselectprevioustab-macos)*macOS*

当启用本地选项卡，并且窗口中有另一个标签时，选择上一个选项卡。

#### [`win.selectNextTab()` ](http://www.electronjs.org/docs/api/browser-window#winselectnexttab-macos)*macOS*

当启用本地选项卡，并且窗口中有另一个标签时，选择下一个选项卡。

#### [`win.mergeAllWindows()` ](http://www.electronjs.org/docs/api/browser-window#winmergeallwindows-macos)*macOS*

当启用本地选项卡并且存在多个打开窗口时，将所有窗口合并到一个带有多个选项卡的窗口中。

#### [`win.moveTabToNewWindow()` ](http://www.electronjs.org/docs/api/browser-window#winmovetabtonewwindow-macos)*macOS*

如果启用了本机选项卡并且当前窗口中有多个选项卡，则将当前选项卡移动到新窗口中。

#### [`win.toggleTabBar()` ](http://www.electronjs.org/docs/api/browser-window#wintoggletabbar-macos)*macOS*

如果启用了本机选项卡并且当前窗口中只有一个选项卡，则切换选项卡栏是否可见。

#### [`win.addTabbedWindow(browserWindow)` ](http://www.electronjs.org/docs/api/browser-window#winaddtabbedwindowbrowserwindow-macos)*macOS*

- `browserWindow` BrowserWindow

在该窗口中添加一个窗口作为选项卡，位于窗口实例的选项卡之后。

#### [`win.setVibrancy(type)` ](http://www.electronjs.org/docs/api/browser-window#winsetvibrancytype-macos)*macOS*

- `type` String | null - 可以是 `appearance-based`，`light`，`dark`，`titlebar`，`selection`，`menu`，`popover`，`sidebar`，`medium-light`，`ultra-dark`，`header`，`sheet`，`window`，`hud`，`fullscreen-ui`，`tooltip`，`content`，`under-window` 或 `under-page`。 更多详细信息，请查阅 [macOS documentation](https://developer.apple.com/documentation/appkit/nsvisualeffectview?preferredLanguage=objc)

在浏览器窗口中添加一个动态特效。 传递 `null` 或空字符串将会移除窗口上的动态效果。

请注意， `appearance-based`，`light`，`dark`，`medium-light` 和 `ultra-dark` 已被弃用，并将在即将推出的 macOS 版本中被移除。

#### [`win.setTrafficLightPosition(position)` ](http://www.electronjs.org/docs/api/browser-window#winsettrafficlightpositionposition-macos)*macOS*

- `position` [Point](http://www.electronjs.org/docs/api/structures/point)

Set a custom position for the traffic light buttons in frameless window.

#### [`win.getTrafficLightPosition()` ](http://www.electronjs.org/docs/api/browser-window#wingettrafficlightposition-macos)*macOS*

Returns `Point` - The custom position for the traffic light buttons in frameless window.

#### [`win.setTouchBar(touchBar)` ](http://www.electronjs.org/docs/api/browser-window#winsettouchbartouchbar-macos)*macOS*

- `touchBar` TouchBar | null

设置窗口的触摸条布局 设置为 `null` 或`undefined`将清除触摸条. 此方法只有在macOS 10.12.1+且设备支持触摸条TouchBar时可用.

**注意:** TouchBar API目前为实验性质，以后的Electron版本可能会更改或删除。

#### [`win.setBrowserView(browserView)` *实验*](http://www.electronjs.org/docs/api/browser-window#winsetbrowserviewbrowserview-实验)

- `browserView` [BrowserView](http://www.electronjs.org/docs/api/browser-view) | null - 将 `browserView` 附加到 `win`。 如果已经附加了其他 `BrowserView`，那么它们将会被从此窗口中移除。

#### [`win.getBrowserView()` *实验功能*](http://www.electronjs.org/docs/api/browser-window#wingetbrowserview-实验功能)

返回 `BrowserView | null` - 附加到 `win` 的 `BrowserView` 。 如果未附加，则返回 `null`。 如果附加了多个 `BrowserView`，则抛出错误。

#### [`win.addBrowserView(browserView)` *实验功能*](http://www.electronjs.org/docs/api/browser-window#winaddbrowserviewbrowserview-实验功能)

- `browserView` [BrowserView](http://www.electronjs.org/docs/api/browser-view)

替代 setBrowserView 的API，支持多个browserView一起使用。

#### [`win.removeBrowserView(browserView)` *实验功能*](http://www.electronjs.org/docs/api/browser-window#winremovebrowserviewbrowserview-实验功能)

- `browserView` [BrowserView](http://www.electronjs.org/docs/api/browser-view)

#### [`win.setTopBrowserView(browserView)` *实验功能*](http://www.electronjs.org/docs/api/browser-window#winsettopbrowserviewbrowserview-实验功能)

- `browserView` [BrowserView](http://www.electronjs.org/docs/api/browser-view)

提高 `browserView` 于其它附加到 `win` 的 `BrowserView` 之上 。 如果 `browserView` 未附加到 `win`，则抛出错误。

#### [`win.getBrowserViews()` *实验功能*](http://www.electronjs.org/docs/api/browser-window#wingetbrowserviews-实验功能)

返回 `BrowserView[]` - 所有通过 `addBrowserView` 或 `setBrowserView` 附加的BrowserView数组。

**注意:** BrowserView 的 API目前为实验性质，可能会更改或删除。







## screen





# 启动参数

process.argv

```js
// main/index.js
// ready之后调用
app.on('ready', function () {
    createWindow();
    setTimeout(() => {
        _handleAfterReady();
    }, 300)
})
```



# 打包

## 图标设置

> electron程序的图标在打包时设置
>
> 在package.json中设置

```js
{
    ...  
    "build": {
      ...
      "nsis": {
        "oneClick": false, //不使用一键安装，允许用户自定义
        "allowToChangeInstallationDirectory": true, // 允许用户修改安装路径
        "installerIcon": "./build/icon.ico",  // 安装的图标，默认 build/installerIcon.ico或者应用的图标
        "uninstallerIcon": "./build/icon.ico",// 卸载的图标，默认build/uninstallerIcon.ico或者应用的图标
        "installerHeader": "./build/icon.ico",// 安装的头部，默认build/installerHeader.bmp
        "installerHeaderIcon": "./build/icon.ico",//安装包头部的涂票，默认build/installerHeaderIcon.ico
        "installerSidebar": "./build/sidebar.bmp",// 安装包安装侧边图片，默认build/installerSidebar.bmp，要求164 × 314 像素
        "uninstallerSidebar": "./build/sidebar.bmp"// 安装包卸载侧边图片，默认build/installerSidebar.bmp，要求164 × 314 像素
      } ,
      "fileAssociations": [
        {
          "name": "test file associations",
          "ext": "elefile",
          "icon": "./resources/icon.ico",
          "description": "test file associations"
        }
      ],
      "extraResources": [
        {
          "from": "icons/",
          "to": "icons/"
        }
      ],  
      ...
    },
    ...
}
```



托盘图标很容易设置，但是有的时候我们设置好了，打包之后图标会丢失。这是因为我们打包之后没有把图标也打包过去。所以我们需要在打包的时候将托盘的图片复制过去。

```js
package.json
{
    ...  
    "build": {
      ...
      "extraResources": [
        {
          "from": "icons/", 
          "to": "icons/"
        } // 可以移动多个文件夹，from-to
      ],  
      ...
    },
    ...
}
```







## 问题处理

### 关于multispinner的bug

```
npm install
npm install multispinner -D
```

这里之所以要单独install一下multispinner，是因为官方里面没有添加multispinner的依赖，同时install以后还需要在
.electron-vue\build.js文件中进行引用

```js
const Multispinner = require('multispinner')
```

### 关于task的bug

这个bug是很多人反馈过的，在.electron-vue/build.js中重复申明了task，导致在打包时报错，所以需要对其中一个task进行重命名，我的习惯是将

```js
const tasks = ['main', 'renderer']
  const m = new Multispinner(tasks, {
    preText: 'building',
    postText: 'process'
  })
 // 改为
 const tasks1 = ['main', 'renderer']
 const m = new Multispinner(tasks1, {
   preText: 'building',
   postText: 'process'
 })
```

### resource busy or locked

```js
"Error: EBUSY: resource busy or locked, rename XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXelectron.exe"
```

删除build下的生成文件夹
关闭命令行重新打开，应该是进程使用中
或者换个文件夹生成
实在不行就重启下电脑

### Error: Application entry file “src\renderer\main.js”

```
main": "./src/renderer/main.js",
"Error: Application entry file "src\renderer\main.js" in the "L:\soft_dev\node\vue\wcprint\build\win-ia32-unpacked\resources\app.asar" does not exist. Seems like a wrong configuration"
```

```
npm install multispinner -D
.electron-vue\build.js文件中引用
const Multispinner = require('multispinner')
```

### Found ‘electron’ but not as a devDependency, pruning anyway

如果对electron没有严格要求的话可以忽略，不会影响打包，但是确实会影响部分第三方库的使用，所以还是建议使用推荐库进行打包。或者在部分情况下可以通过将“.electron-vue/webpack.renderer.config.js”中

```
let whiteListedModules = ['vue']
// 改为
let whiteListedModules = ['vue','electron']
```



### window is not defined at ...

![image-20210716151549314](E:\workNotes\electron-vue项目.assets\image-20210716151549314.png)

```js
// main/index.js
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
  // global.__static = window.require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
```









## 生成带有安装向导的exe

### 1、先打包 `npm run build`

### 2、用NSIS工具处理打包后的结果

https://blog.csdn.net/qq_36651243/article/details/84101478?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522161965853816780255276878%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fblog.%2522%257D&request_id=161965853816780255276878&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~first_rank_v2~rank_v29-1-84101478.nonecase&utm_term=nsis

#### **一 NSIS工具的使用**

1、启动NIS Edit。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181115110042932.png)

2、在“文件”菜单中“新建脚本：向导”=>下一步”。

![image-20210719160328153](E:\workNotes\electron-vue项目.assets\image-20210719160328153.png)

3、设置应用程序信息，如软件名称、版本、出版人等，当然最一个网站可以留空，如果设置了，则安装包会生成一个对应网址的“Internet 快捷方式”。

![image-20210719160348392](E:\workNotes\electron-vue项目.assets\image-20210719160348392.png)

4、设置程序选项，如安装包图标、安装程序文件、安装包语言[这里选“SimpChinese”]、用户图形界面及压缩方式等，可以选用默认值，也可以点击对应项目的按钮或下拉菜单更改设置。

![image-20210719160411464](E:\workNotes\electron-vue项目.assets\image-20210719160411464.png)

5、设置安装目录及授权信息，然后后“下一步”，其中授权文件可不填写，如果你需要对你打包的软件提供用户使用文档，可自行创建文件然后将文件目录填入。

![image-20210719160430806](E:\workNotes\electron-vue项目.assets\image-20210719160430806.png)

6、选定程序文件，

默认两个文件选中，删除

![image-20210719164914633](E:\workNotes\electron-vue项目.assets\image-20210719164914633.png)

7、完毕后进行“添加文件”操作，选定我们要打包的文件。

![image-20210719164928762](E:\workNotes\electron-vue项目.assets\image-20210719164928762.png)

选择自己已经编译好的`muise.exe`文件

![image-20210719160509575](E:\workNotes\electron-vue项目.assets\image-20210719160509575.png)

好之后在点击确认。然后回到这个界面在点击添加目录按钮来添加整个要打包的目录。

![image-20210719165004164](E:\workNotes\electron-vue项目.assets\image-20210719165004164.png)

添加好打包的目录和他的子目录

![image-20210719165017824](E:\workNotes\electron-vue项目.assets\image-20210719165017824.png)

8、设置开始菜单中文件夹名称及快捷方式，一般使用默认值， 然后“下一步”。

![image-20210719160531079](E:\workNotes\electron-vue项目.assets\image-20210719160531079.png)

9、指定安装后要运行的程序，同上用默认值并设置相关运行参数及描述，或不想在安装运行任何程序，则留空即可。

![image-20210719160552238](E:\workNotes\electron-vue项目.assets\image-20210719160552238.png)

10、这步是有关卸载程序的相关信息，如卸载时的提示、卸载的图标等。

![image-20210719160609811](E:\workNotes\electron-vue项目.assets\image-20210719160609811.png)

11、点击下一步后，跳到完成向导界面，勾选“保存脚本”和“转换文件路径到相关路径”。

![image-20210719160628038](E:\workNotes\electron-vue项目.assets\image-20210719160628038.png)

12、点击完成后，自定义保存路径和保存文件名。

![image-20210719160646087](E:\workNotes\electron-vue项目.assets\image-20210719160646087.png)

13、打开以后，点击编译运行，生成可执行文件。

![image-20210719160719183](E:\workNotes\electron-vue项目.assets\image-20210719160719183.png)

#### 二 后台运行操作

在如图位置加入如下代码设置对XXX.exe后台运行操作

![image-20210719160811626](E:\workNotes\electron-vue项目.assets\image-20210719160811626.png)

```js
Function .onInstSuccess
  ExecShell "open" "$INSTDIR\ICCKey.exe"
  ExecShell "open" "$INSTDIR\PkiApiService.exe"
FunctionEnd
```

#### 三 卸载结束后台进程操作

首先执行结束后台进程需要确保NSIS安装目录下的Plugins目录下存在下图两个库。

![image-20210719160840873](E:\workNotes\electron-vue项目.assets\image-20210719160840873.png)

然后在卸载函数里添加下图代码。

![image-20210719160858663](E:\workNotes\electron-vue项目.assets\image-20210719160858663.png)

```js
  ;删除进程
  FindProcDLL::FindProc "ICCKey.exe"
  Push "icckey.exe"
  KillProcDLL::KillProc

  FindProcDLL::FindProc "PkiApiService.exe"
  Push "PkiApiService.exe"
  KillProcDLL::KillProc
```

**第二种卸载程序或者安装程序时杀死进程的方法（可以一次性杀死多个进程）**

NSIS使用exec调用windows指令去杀死进程，好处在于可以杀死多个进程，十分方便。

```
nsExec::Exec "taskkill /im ICCKey.exe /f"
```

**安装时杀死进程：**

![image-20210719161001751](E:\workNotes\electron-vue项目.assets\image-20210719161001751.png)

**卸载时杀死进程：**

![image-20210719161015313](E:\workNotes\electron-vue项目.assets\image-20210719161015313.png)

在卸载的时候，加上RMDir /r “$INSTDIR”，可以卸载整个安装目录。

```
RMDir /r "$INSTDIR"
```

#### 四 开机自启动操作

对于制作好的安装包，有些时候可能需要在安装完成界面上添加一个可勾选的开机自启动的选项，下面是具体的细节。
1.在安装完成界面设置添加如下代码，务必要添加在 " !insertmacro MUIPAGEFINISH "之前。

![image-20210719161105743](E:\workNotes\electron-vue项目.assets\image-20210719161105743.png)

```
!define MUI_FINISHPAGE_SHOWREADME
!define MUI_FINISHPAGE_SHOWREADME_Function AutoBoot
!define MUI_FINISHPAGE_SHOWREADME_TEXT "开机自动启动"
```

```
!insertmacro MUI_PAGE_FINISH
```

2.在Section后区段的后面添加Function部分（在Section之后，是为了避免产生未知的错误）把上面的PKI5.0替换成你要打包程序名就行了，主要是把信息写入系统注册表，代码如下：

![image-20210719161149792](E:\workNotes\electron-vue项目.assets\image-20210719161149792.png)

```
Function AutoBoot
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "ICCKey"'"$INSTDIR\ICCKey.exe"'
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "PkiApiService"'"$INSTDIR\PkiApiService.exe"'
FunctionEnd
```

3.前两步已经可以实现开机自启动了。这最后一步，需要在卸载和初始化区段里面把注册表信息删除。原因是让用户在卸载程序和覆盖安装程序后，不会受到刚开始安装程序的写入系统注册表的影响。 在Function .onInit里面添加如下代码：
;删除开机自启

![image-20210719161217286](E:\workNotes\electron-vue项目.assets\image-20210719161217286.png)

```
Function un.onInit
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Run\ICCKey"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Run\PkiApiService"
!insertmacro MUI_UNGETLANGUAGE
  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 "你确实要完全移除 $(^Name) ，其及所有的组件？" IDYES +2
  Abort
FunctionEnd
```

在Section Uninstall里面添加如下代码：
;删除开机自启

![image-20210719161243510](E:\workNotes\electron-vue项目.assets\image-20210719161243510.png)

```
DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Run\ICCKey"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Run\PkiApiService"
```

#### 五 带注册码

使用时需要借助一个PassDialog.dll这个插件去做注册码生成输入框。
然后编写如图代码。

![image-20210719161316670](E:\workNotes\electron-vue项目.assets\image-20210719161316670.png)

```
;安装密码
!define Password "123"
;密码输入页面
Page Custom PasswordPageShow PasswordPageLeave
```

![image-20210719161333387](E:\workNotes\electron-vue项目.assets\image-20210719161333387.png)

```
Function PasswordPageShow
 !insertmacro MUI_HEADER_TEXT "输入密码" "安装程序需要一个正确的安装密码才能继续。"
 PassDialog::InitDialog /NOUNLOAD Password /HEADINGTEXT "请输入密码。" /GROUPTEXT "密码输入框"
 Pop $R0 # Page HWND
 SendMessage $R1 ${EM_SETPASSWORDCHAR} 178 0
 PassDialog::Show
FunctionEnd
;验证密码
Function PasswordPageLeave
 ;从堆栈取出密码
 Pop $R0
 ;密码错误
 StrCmp $R0 '${Password}' +3
  MessageBox MB_OK|MB_ICONEXCLAMATION "密码输入错误！请输入正确的安装密码！"
  Abort
 ;密码正确
  MessageBox MB_OK|MB_ICONEXCLAMATION "密码正确！"
  ;Abort
FunctionEnd
```

#### 六 安装许可证协议

![image-20210719161403519](E:\workNotes\electron-vue项目.assets\image-20210719161403519.png)

NSIS代码部分：

```
; Welcome page
!insertmacro MUI_PAGE_WELCOME
; License page
!define MUI_LICENSEPAGE_CHECKBOX
!insertmacro MUI_PAGE_LICENSE "..\安装条款.txt"
; Instfiles page
!insertmacro MUI_PAGE_INSTFILES
; Finish page
!define MUI_FINISHPAGE_RUN "$INSTDIR\ICCKey.exe"
!insertmacro MUI_PAGE_FINISH

; Uninstaller pages
!insertmacro MUI_UNPAGE_INSTFILES
```

![image-20210719161424823](E:\workNotes\electron-vue项目.assets\image-20210719161424823.png)

#### 七 个性化设置

1.修改logo以及内侧图（左边图片）

```
!define MUI_ABORTWARNING
!define MUI_ICON "..\vv_setupicon.ico"
!define MUI_UNICON "..\vv_setupicon.ico"
!define MUI_WELCOMEFINISHPAGE_BITMAP "..\setbg.bmp"
```

此处需要注意的是：内侧图一定要是windows标准格式BMP图片，可以用windows自带的画图软件将其他格式的图片转成BMP格式，内图大小为164×314，可以根据这个比例放

2.安装包标题及介绍

```
//标题
!define MUI_WELCOMEPAGE_TITLE "\r\n　　　LOL安装示例向导"
//文字介绍
!define MUI_WELCOMEPAGE_TEXT "这个向导将指引你完成LOL的安装进程。\r\n\r\n在开始安装之前，建议先关闭其他相关所有应用程序，这将允许“安装程序“更新指定的系统文件。\r\n\r\n为保证程序的正常安装和运行，若您的电脑遇到弹窗提醒，请允许程序所有操作。\r\n\r\n$_CLICK"
```







# vue-cli创建electron项目

### electron-vue(cli2)

主进程文件为main.js文件

#### 创建

>  cnpm install -g vue-cli
>
>  vue init simulatedgreg/electron-vue xxxxx
>
>  cd xxxxx
>
>  npm i

#### 多页面入口配置

##### 1、创建muti-page.config.js文件

> 在 .electron-vue中增加 muti-page.config.js文件

```js
const glob = require('glob');
const path = require('path');
const PAGE_PATH = path.resolve(__dirname, '../src/renderer/page'); // 文件路径
const HtmlWebpackPlugin = require('html-webpack-plugin');

exports.entries = function () {
  /*用于匹配 pages 下一级文件夹中的 index.js 文件 */
  var entryFiles = glob.sync(PAGE_PATH + '/*/main.js')
  var map = {}
  entryFiles.forEach((filePath) => {
    /* 下述两句代码用于取出 pages 下一级文件夹的名称 */
    var entryPath = path.dirname(filePath)
    var filename = entryPath.substring(entryPath.lastIndexOf('\/') + 1)
    /* 生成对应的键值对 */
    map[filename] = filePath
  })
  return map
}

exports.htmlPlugin = function () {
  let entryHtml = glob.sync(PAGE_PATH + '/*/index.ejs')
  let arr = []
  entryHtml.forEach((filePath) => {
      var entryPath = path.dirname(filePath)
      var filename = entryPath.substring(entryPath.lastIndexOf('\/') + 1)
      let conf = {
        template: filePath,
        filename: filename + `/index.html`,
        chunks: ['manifest', 'vendor', filename],
        inject: true,
        nodeModules: path.resolve(__dirname, '../node_modules'),
        // templateParameters(compilation, assets, options) {
        //     return {
        //       htmlWebpackPlugin: {
        //         files: assets,
        //         options: options
        //       },
        //       process,
        //     }
        //   }
      }
      if (process.env.NODE_ENV === 'production') {
        let productionConfig = {
          minify: {
            removeComments: true,         // 移除注释
            collapseWhitespace: true,     // 删除空白符和换行符
            removeAttributeQuotes: true   // 移除属性引号 
          },
          chunksSortMode: 'dependency'    // 对引入的chunk模块进行排序
        }
        conf = {...conf, ...productionConfig} //合并基础配置和生产环境专属配置
      }
      arr.push(new HtmlWebpackPlugin(conf))
  })
  return arr
}

```



##### 2、修改webpack.renderer.config.js文件

```js
'use strict'

process.env.BABEL_ENV = 'renderer'

const path = require('path')
const { dependencies } = require('../package.json')
const webpack = require('webpack')

const MinifyPlugin = require("babel-minify-webpack-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
// 新增，引入新增muti-page.config.js文件
const {entries, htmlPlugin} = require('./muti-page.config');

/**
 * List of node_modules to include in webpack bundle
 *
 * Required for specific packages like Vue UI libraries
 * that provide pure *.vue files that need compiling
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/webpack-configurations.html#white-listing-externals
 */
let whiteListedModules = ['vue']

let rendererConfig = {
  devtool: '#cheap-module-eval-source-map',
  // entry: {
  //   renderer: path.join(__dirname, '../src/renderer/main.js')
  // },
  // 此处做修改
  entry: entries,
  externals: [
    ...Object.keys(dependencies || {}).filter(d => !whiteListedModules.includes(d))
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.sass$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax']
      },
      {
        test: /\.less$/,
        use: ['vue-style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.html$/,
        use: 'vue-html-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            extractCSS: process.env.NODE_ENV === 'production',
            loaders: {
              sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
              scss: 'vue-style-loader!css-loader!sass-loader',
              less: 'vue-style-loader!css-loader!less-loader'
            }
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'imgs/[name]--[folder].[ext]'
          }
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name]--[folder].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'fonts/[name]--[folder].[ext]'
          }
        }
      }
    ]
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({filename: 'styles.css'}),
    // 注销此处
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: path.resolve(__dirname, '../src/index.ejs'),
    //   minify: {
    //     collapseWhitespace: true,
    //     removeAttributeQuotes: true,
    //     removeComments: true
    //   },
    //   nodeModules: process.env.NODE_ENV !== 'production'
    //     ? path.resolve(__dirname, '../node_modules')
    //     : false
    // }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  // 在此处做修改,添加concat(htmlPlugin())
  ].concat(htmlPlugin()),
  output: {
    // 此处做修改，[name]后边添加index==》[name]/index.js
    filename: '[name]/index.js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron')
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src/renderer'),
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['.js', '.vue', '.json', '.css', '.node']
  },
  target: 'electron-renderer'
}

/**
 * Adjust rendererConfig for development settings
 */
if (process.env.NODE_ENV !== 'production') {
  rendererConfig.plugins.push(
    new webpack.DefinePlugin({
      '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
    })
  )
}

/**
 * Adjust rendererConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  rendererConfig.devtool = ''

  rendererConfig.plugins.push(
    new MinifyPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../static'),
        to: path.join(__dirname, '../dist/electron/static'),
        ignore: ['.*']
      }
    ]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  )
}

module.exports = rendererCo
```

##### 3、main.js文件中修改默认路由

```js
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080/login` : `file://${__dirname}/login/index.html`;
mainWindow.loadURL(winURL)
```

##### 4、各个页面main.js引入vue-electron

```js
 if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
```

##### 5、页面中直接使用electron

```js
this.$electron.ipcRenderer.send('toList')
```



##### 6、main.js例子

```js
import {
    app,
    Menu,
    BrowserWindow,
    ipcMain,
    Tray,
    BrowserView,
    globalShortcut
} from 'electron'
import electronLog from 'electron-log'
import {
    screenshots
} from './shortcutKey'
const path = require('path')
app.commandLine.appendSwitch('ignore-certificate-errors');

if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
let mainWindow;
let roomWindow = null;
let theWin = null;
let callWin = null;

const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080/login` : `file://${__dirname}/login/index.html`;


// const winURL = process.env.NODE_ENV === 'development' ? 'http://localhost:9080/home' : `file://${__dirname}/home/index.html`;
function createWindow() {
    Menu.setApplicationMenu(null)
    mainWindow = new BrowserWindow({
        useContentSize: false,
        width: 1200,
        height: 700,
        center: true,
        frame: false,
        titleBarStyle: 'hidden',
        movable: true,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        }
    })

    mainWindow.loadURL(winURL)

    mainWindow.on('closed', () => {
        mainWindow = null;
    })

    if (process.env.NODE_ENV === "development") {
        mainWindow.webContents.on("did-frame-finish-load", () => {
            mainWindow.webContents.once("devtools-opened", () => {
                mainWindow.focus();
            });
            mainWindow.webContents.openDevTools();
        });
    }
}

function createRoom(url) {
    if (roomWindow) {
        roomWindow.loadURL(url);
        roomWindow.show();
    } else {
        roomWindow = new BrowserWindow({
            height: 768,
            useContentSize: true,
            width: 1366,
            frame: true,
            titleBarStyle: 'hidden',
            movable: true,
            webPreferences: {
                webSecurity: false,
                sandbox: true
            },
        })
        roomWindow.loadURL(url);
        roomWindow.on('closed', () => {
            mainWindow.send('reconnectIM', 'yeah');
            roomWindow = null;
        })
    }
}

// 中转站
ipcMain.on('ToMainWindow', (event, message) => {
    if (mainWindow) {
        mainWindow.webContents.send(message.eventName, message.eventValue);
    }
});

ipcMain.on('ToImWindow', (event, message) => {
    if (callWin) {
        // 加入会议
        if (message.eventName == 'JoinInMeeting') {
            callWin.setMinimumSize(1200, 700);
            callWin.setSize(1200, 700);
            callWin.center();
            callWin.show();

        }
        callWin.webContents.send(message.eventName, message.eventValue);
    }
});
//撤回消息
ipcMain.on('withdrawMessage', (event, message) => {
    if (callWin) {
        callWin.webContents.send('delMessage', message.message);
    }
});

ipcMain.on('openDev', () => {
    mainWindow.webContents.openDevTools();
})

ipcMain.on('openHome', () => {
    const winURL = process.env.NODE_ENV === 'development' ? 'http://localhost:9080/home' : `file://${__dirname}/home/index.html`;
    mainWindow.setMinimumSize(1200, 700);
    mainWindow.setSize(1200, 700);
    mainWindow.center();
    mainWindow.loadURL(winURL);

    const url = process.env.NODE_ENV === 'development' ? 'http://localhost:9080/rtc' : `file://${__dirname}/rtc/index.html`;
    callWin = new BrowserWindow({
        width: 1200,
        height: 700,
        center: true,
        show: false,
        frame: false,
        title: 'imWindow',
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        }
    })
    callWin.loadURL(url);
});

ipcMain.on('joinRoom', (e, url) => {
    createRoom(url);
});

ipcMain.on('rtcPageOK', (e, data) => {
    console.log('@@@@@@', e);
})
ipcMain.on('openCallPage', (e) => {
    if (theWin) return;
    const url = process.env.NODE_ENV === 'development' ? 'http://localhost:9080/rtc' : `file://${__dirname}/rtc/index.html`;
    theWin = new BrowserWindow({
        height: 350,
        useContentSize: true,
        width: 450,
        center: true,
        frame: false,
        titleBarStyle: 'hidden',
        movable: true,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            // sandbox:true
        }
    });
    theWin.loadURL(url);
})

ipcMain.on('close', (event) => {
    // mainWindow.close();
    mainWindow = null;
    app.exit();
});
ipcMain.on('minum', () => {
    // mainWindow.minimize();
    setTray();
});

//视频窗口最小化
ipcMain.on('videoMini', function (e, arg) {
    callWin.minimize();
    e.reply('mini-reply', 'ok');
});
ipcMain.on('videoMax', function (e, arg) {
    if (callWin.isMaximized()) {
        callWin.restore();
    } else {
        callWin.maximize();
    }
});

let appTray = null; // 引用放外部，防止被当垃圾回收

// 隐藏主窗口，并创建托盘，绑定关闭事件
function setTray() {
    // 用一个 Tray 来表示一个图标,这个图标处于正在运行的系统的通知区
    //  ，通常被添加到一个 context menu 上.
    // 系统托盘右键菜单
    let trayMenuTemplate = [{ // 系统托盘图标目录
        label: '退出',
        click: function () {
            app.quit();
        }
    }];
    // 当前目录下的app.ico图标
    let iconPath = path.join(__dirname, '../../static/images/tray.ico');
    appTray = new Tray(iconPath);
    // 图标的上下文菜单
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
    // 隐藏主窗口
    mainWindow.hide();
    // 设置托盘悬浮提示
    appTray.setToolTip('never forget');
    // 设置托盘菜单
    appTray.setContextMenu(contextMenu);
    // 单击托盘小图标显示应用
    appTray.on('click', function () {
        // 显示主程序
        mainWindow.show();
        // 关闭托盘显示
        appTray.destroy();
    });
};
ipcMain.on('restore', () => {
    // mainWindow.minimize();
    mainWindow.show();
    appTray.destroy();
});
ipcMain.on('max', function () {
    if (mainWindow.isMaximized()) {
        mainWindow.restore();
    } else {
        mainWindow.maximize();
    }
})

app.on('ready', () => {
    createWindow();

    screenshots()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

// app.on('uncaughtException', function (err) {
//     console.log(err)
//     electronLog.error(err.stack);
// });
app.onerror = function (message, source, lineno, colno, err) {
    electronLog.error(err.stack || err);
}
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
```







### electron(cli3/cli4)

主进程文件为background.js文件

#### 创建

> npm install @vue/cli -g
>
> vue create xxxx
>
> cd xxxx
>
> vue add electron-builder

#### 多页面入口

##### 1、根目录创建vue.config.js

该文件无需引入，创建即可用，pages为多页面入口

```js
module.exports = {
    outputDir: 'dist', // 打包文件位置
    publicPath: '/', // 公共路径
    // devServer: {
    //     [process.env.IS_ELECRTON?"port":'proxy']:process.env.IS_ELECRTON?8060:'http://172.16.90.30'
    // },
    pages: {
      login: {
        // page 的入口
        // entry: 'src/index/main.js',
        entry: 'src/views/login/main.js',
        // 模板来源
        template: 'src/views/login/index.html',
        // 在 dist/index.html 的输出
        // filename: 'index.html',
        // 当使用 title 选项时，
        // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
        // title: 'Index Page',
        // 在这个页面中包含的块，默认情况下会包含
        // 提取出来的通用 chunk 和 vendor chunk。
        // chunks: ['chunk-vendors', 'chunk-common', 'index']
      },
      list: {
          entry: 'src/views/list/main.js',
          template: 'src/views/list/index.html'
      },
      // 当使用只有入口的字符串格式时，
      // 模板会被推导为 `public/subpage.html`
      // 并且如果找不到的话，就回退到 `public/index.html`。
      // 输出文件名会被推导为 `subpage.html`。
      // subpage: 'src/subpage/main.js'
    },
    devServer: {
      // can be overwritten by process.env.HOST
      host: '0.0.0.0',  
      port: 8080
    },
  }
```

##### 2、background.js文件修改默认打开的路由

```js
...
  let reload = process.env.WEBPACK_DEV_SERVER_URL + 'login' // 新增
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(reload) // 修改
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }
```

##### 3、在各个页面的main.js中引入electron

```js
import electron from 'electron'
if (!process.env.IS_WEB) {
  Vue.use(electron)
}
Vue.prototype.$electron = electron
Vue.config.productionTip = false
```

##### 4、页面中可直接使用electron

```js
this.$electron.ipcRenderer.send('toList')
```

### index.html说明

可以直接用ejs文件替代html

```js
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>newPage</title>
  <% if (htmlWebpackPlugin.options.nodeModules) { %>
    <!-- Add `node_modules/` to global paths so `require` works properly in development -->
    <script>
      require('module').globalPaths.push('<%= htmlWebpackPlugin.options.nodeModules.replace(/\\/g, '\\\\') %>')
    </script>
  <% } %>
</head>
<body>
<div id="app"></div>
<!-- Set `__static` path to static files in production -->

<% if (!process.browser) { %>
  <script>
    if (process.env.NODE_ENV !== 'development') window.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
  </script>
<% } %>



<!-- webpack builds are automatically injected -->
</body>
</html>

```

