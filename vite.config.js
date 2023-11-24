
export default {
  server: {
    open: true,
    host: '0.0.0.0',
  },
  cssPreprocessOptions: {
    scss: {
      additionalData: '@import "./src/css/waterfall-flow.scss";' // 添加公共样式
    }
  }
}