//node的核心模块
// const path = require('path');

// module.exports = {
   
//     //设置为development时，代码不会进行压缩；设置为production时，代码会进行压缩。
//     mode:'production',
//     // 放置入口文件，明确怎么打包，要打包哪一个文件
//     entry: './src/firework.js',
//     //entry: {
   
//     //    main: './src/index.js'
//     //},
//     // 输出，表明webpack应该怎么输出，输出到哪个地方
//     output: {
   
//         filename: 'bundle.js',
//         // 指打包后的文件要放在哪个文件下
//         // __dirname表示该项目的根目录
//         path: path.resolve(__dirname, 'dist')
//     }
// }


const path = require('path');

module.exports = {
    mode:'development',
    devtool: 'source-map',
  entry: './src/stareat.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        //use: 'ts-loader',
        loader:'ts-loader',
        exclude: /node_modules/,
      },

    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },


};