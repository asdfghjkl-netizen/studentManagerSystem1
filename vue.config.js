// vue.config.js
module.exports = {
  lintOnSave: undefined,
  publicPath: './',
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined,
  css: undefined,
  // 定义启动服务的端口号
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // pathRewrite: { '^/api': '' },
      },
    },
    port: 8033, // Vue 3 开发服务器的端口  
  },
} 
