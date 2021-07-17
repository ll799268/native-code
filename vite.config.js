
export default {
  server: {
    open: '/index.html',
    host: '0.0.0.0',
  },
  cssPreprocessOptions: {
    scss: {
      additionalData: '@import "./src/css/waterfallFlow.scss";' // 添加公共样式
    }
  }
}