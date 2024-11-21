const { parse } = require('@vue/compiler-sfc');

function removeJsComments(code) {
  // 移除多行注释
  code = code.replace(/\/\*[\s\S]*?\*\//g, '');
  // 移除单行注释
  code = code.replace(/\/\/.*/g, '');
  return code;
}

function customParser(source) {
  const parsed = parse(source);

  // 移除 template 中的 HTML 注释
  if (parsed.descriptor.template) {
    const originalTemplate = parsed.descriptor.template.content;
    parsed.descriptor.template.content = originalTemplate.replace(/<!--[\s\S]*?-->/g, '');
    console.log('Original Template:', originalTemplate);
    console.log('Parsed Template:', parsed.descriptor.template.content);
  }

  // 移除 script 中的 JavaScript 注释
  if (parsed.descriptor.script) {
    parsed.descriptor.script.content = removeJsComments(parsed.descriptor.script.content);
  }

  // 移除 style 中的 CSS 注释
  if (parsed.descriptor.styles) {
    parsed.descriptor.styles.forEach(style => {
      style.content = style.content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');
    });
  }

  return parsed;
}

module.exports = customParser;
