const path = require('path');
const fs = require('fs');
const glob = require('glob');
const WebpackBar = require('webpackbar');                  // 显示打包进度
const CopyWebpackPlugin = require('copy-webpack-plugin');  // 复制文件
const customParser = require('./webpack/custom-parser');   // 自定义解析器
const OnBuildPlugin = require('on-build-webpack');         // 添加构建完成回调
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin'); // 显示打包错误
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin'); // 检查类型错误
// 打包分析
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
/**
 * 引入配置文件 webpack/config.js  "node-sass": "^4.14.1"
 * @type {String} outputDir    输出目录 
 * @type {Array}  patterns     复制文件列表
 * @type {Function} formatFiles 格式化文件
 * @type {Function} filterWarnings 过滤警告
 * @type {Function} setTerserOptions 设置 Terser 选项
 * */
const {
  outputDir,
  patterns,
  formatFiles, filterWarnings, setTerserOptions
} = require('./webpack/config');
const assetsDir = 'assets';

// 配置 webpack
module.exports = {
  lintOnSave: undefined,       // 是否在控制台输出 eslint 警告和错误
  publicPath: './',            // 配置根目录
  outputDir: process.env.VUE_APP_OUTPUT_DIR,  // 输出目录
  assetsDir,                   // 设置静态资源输出目录
  runtimeCompiler: true,  // 是否启用运行时编译
  productionSourceMap: false,  // 是否生成 sourceMap 文件
  parallel: undefined,         // 允许并发打包线程数
  css: {    // 配置 css-loader loader
    loaderOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/common.scss" as *;`
      }
    }
  },

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
          compilerOptions: {
            parser: customParser // 使用自定义解析器
          },
        };
      });

    // // 配置静态资源处理
    // config.module
    //   .rule('images')
    //   .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
    //   .use('url-loader')
    //   .loader('url-loader')
    //   .options({
    //     limit: 10000, // 小于10k的图片会被转成base64编码
    //     name: 'assets/imgs/[name].[ext]'
    //   });
    // 移除图片处理规则
    config.module.rules.delete('images');

    // 配置拆分包
    config.optimization.splitChunks({
      cacheGroups: {
        // 工具类文件的输出路径  
        utils: {
          test: /[\\/]src[\\/]utils[\\/].*\/?/ ||
            /[\\/]src[\\/]store[\\/].*\/?/ || /[\\/]src[\\/]router[\\/].*\/?/,
          name: 'utils',
          chunks: 'all',
          enforce: true,
          // filename: 'utils/[name].[contenthash].js'
        },
        // 其他模块的输出路径
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          enforce: true,
          // filename: 'vendors/[name].[contenthash].js'
        },
        // 视图组件的输出路径
        components: {
          test: /[\\/]src[\\/]views[\\/].*\/?/ &&
            /[\\/]src[\\/]App\.vue$/ && /[\\/]src[\\/]components[\\/].*\/?/,
          name: 'components',
          chunks: 'all',
          enforce: true,
          // filename: 'components/[name].[contenthash].js'
        },
      }
    });

    // 配置复制文件
    config.plugin('copy').use(CopyWebpackPlugin, [{ patterns }]);

    // 配置 HtmlWebpackPlugin
    config.plugin('html').tap(args => {
      args[0].title = 'Vue3-Seat-Admin'; // 设置页面标题
      args[0].template = path.resolve(__dirname, 'public/index.html');
      return args;
    });

    // 配置 webpack-visualizer
    config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin, [{
      analyzerMode: 'static', // 生成报告文件
      reportFilename: 'report.html', // 报告文件名
      openAnalyzer: false, // 不自动打开浏览器
    }]);
  },

  // 配置 webpack
  configureWebpack: async (config) => {
    // 配置开发环境
    if (process.env.NODE_ENV === 'development') {
      config.plugins.push(
        new ForkTsCheckerWebpackPlugin(),  // 检查类型错误
        new FriendlyErrorsWebpackPlugin({
          ignore: ['WARNING', 'warning'],  // 忽略警告
          additionalTransformers: [filterWarnings]
        }), // 显示打包错误
      );
    }

    // 配置生产环境 
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new SpeedMeasurePlugin(),  // 配置打包速度分析
        new WebpackBar(),  // 配置打包进度条
        new FriendlyErrorsWebpackPlugin({
          ignore: ['WARNING', 'warning'],  // 忽略警告
          additionalTransformers: [filterWarnings]
        }), // 显示打包错误
      );

      console.log(`Output directory: ${outputDir}`);
      // 添加 on-build-webpack 插件
      config.plugins.push(new OnBuildPlugin(async () => {
        // 生成启动脚本
        const scriptContent = `cd ${outputDir} && nodemon server.js`;
        fs.writeFileSync(path.resolve(__dirname, 'start-production.bat'), scriptContent);

        const outputDirectory = path.resolve(__dirname, outputDir);
        // console.log(`Formatting files in: ${outputDirectory}`);

        // 遍历所有 .js 文件
        const jsFiles = glob.sync(`${outputDirectory}/**/*.js`);
        // console.log(`Found files:`, jsFiles);
        // 遍历所有 .html 文件
        const htmlFiles = glob.sync(`${outputDirectory}/**/*.html`);
        // console.log(`Found files:`, htmlFiles);
        // 遍历所有 .css 文件
        const cssFiles = glob.sync(`${outputDirectory}/**/*.css`);
        // console.log(`Found files:`, cssFiles);

        // 格式化所有文件
        await formatFiles(jsFiles, 'js', 'babel');
        await formatFiles(htmlFiles, 'html', 'html');
        await formatFiles(cssFiles, 'css', 'css');
        // console.log('Files in the output directory have been formatted.');
      }),
      );
      await setTerserOptions(config);
    };
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
    port: 8033,  // Vue 3 开发服务器的端口  
    hot: true,   // 启用热更新
    open: true,  // 自动打开浏览器
    quiet: true  // 如果使用webpack-dev-server，需要设为true，禁止显示devServer的console信息
  },
}
