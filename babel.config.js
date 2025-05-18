module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    // 按需加载element-plus
    ['import', {
      libraryName: 'element-plus',
      customStyleName: (name) => {
        return `element-plus/theme-chalk/${name}.css`
      },
      // 导入的名字去除el-
      customName: (name) => {
        return `element-plus/lib/components/${name.slice(3)}`
      },
    }],
  ],
}
