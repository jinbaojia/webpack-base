module.exports = function (api) {
  api.cache(true); //加快babel处理

  const presets = [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage", 
        corejs: { version: 2 },  
        targets: {
          // 指定兼容性处理哪些浏览器
          chrome: "58",
          ie: "9",
        },
      },
    ],
  ];

  const plugins = [];

  return {
    presets,
    plugins,
  };
};
