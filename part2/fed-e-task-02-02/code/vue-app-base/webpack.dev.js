const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');
const { DefinePlugin } = require("webpack");

module.exports = merge(common, {
    // 指定打包模式 开发环境
    mode: 'development',
    // 指定 source-map
    devtool: 'inline-source-map',
    devServer: {
        port: '5000', // 端口设置
        contentBase: './dist',
    },
    plugins: [
        new DefinePlugin({
            //定义BASE_URL index.html中需要使用
            BASE_URL: '/public/',
        })
    ]
});