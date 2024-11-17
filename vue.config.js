const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
/**
 * 引入配置文件 webpack/config.js
 * @type {String} outputDir    输出目录 
 * @type {Array}  patterns     复制文件列表
 * */
const { outputDir, patterns } = require('./webpack/config');

module.exports = {
  lintOnSave: undefined,
  publicPath: './',
  outputDir: process.env.VUE_APP_OUTPUT_DIR,
  assetsDir: 'assets', // 设置静态资源输出目录
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined,
  css: undefined,

  // 配置 webpack-chain 
  chainWebpack: config => {
    // 配置主应用的输出路径
    config.output.path(path.resolve(__dirname, outputDir));
    
    // 配置工具类文件的输出路径
    config.module
      .rule('js').include
      .add(path.resolve(__dirname, 'src/utils'))
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .tap(options => {
        // 修改 babel-loader 选项
        return options;
      });

    // 配置 vue-loader
    config.module
      .rule('vue').test(/\.vue$/)
      .include
      .add(path.resolve(__dirname, 'src/'))
      .end()
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        return {
          ...options,
          // 自定义选项
          // transformAssetUrls: {
          //   video: ['src', 'poster'],
          //   source: 'src',
          //   img: 'src',
          //   image: 'xlink:href'
          // }
        };
      });

    // 配置拆分包
    config.optimization.splitChunks({
      cacheGroups: {
        // 工具类文件的输出路径
        utils: {
          test: /[\\/]src[\\/]utils[\\/]/ &&
            /[\\/]src[\\/]store[\\/]/ &&
            /[\\/]src[\\/]router[\\/]/,
          name: 'utils',
          chunks: 'all',
          enforce: true,
          filename: 'utils/[name].[contenthash].js'
        },
        // 其他模块的输出路径
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          enforce: true,
          filename: 'vendors/[name].[contenthash].js'
        },
        // 视图组件的输出路径
        views: {
          test: /[\\/]src[\\/]views[\\/]/ &&
            /[\\/]src[\\/]App\.vue$/ &&
            /[\\/]src[\\/]components[\\/]/,
          name: 'views',
          chunks: 'all',
          enforce: true,
          filename: 'views/[name].[contenthash].js'
        },
      }
    });

    // 配置静态资源处理
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 10000, // 小于10k的图片会被转成base64编码
        name: 'assets/imgs/[name].[hash:7].[ext]'
      });
    
    // 配置复制文件
    config.plugin('copy').use(CopyWebpackPlugin, [{ patterns }]);

    // 配置 HtmlWebpackPlugin
    config.plugin('html').tap(args => {
      args[0].title = 'Vue3-Seat-Admin'; // 设置页面标题
      args[0].template = path.resolve(__dirname, 'public/index.html');
      return args;
    });
  },
  
  // 配置 webpack
  configureWebpack: config => {
    // 配置生产环境 
    if (process.env.NODE_ENV === 'production') {
      console.log(`Output directory: ${outputDir}`);
      const scriptContent = `cd ${outputDir} && nodemon server.js`;
      // 生成启动脚本
      fs.writeFileSync(path.resolve(__dirname, 'start-production.bat'), scriptContent);
    }
  },
  
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
