// webpack.config.js
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { DefinePlugin } = require("webpack");

module.exports = {
    // 打包模式
    mode: 'development',

    // Webpack 入口文件, 单个入口 string，多个入口｛｝
    entry: './src/main.js', // 入口文件

    // 指定输出文件目录
    output: {
        // 指定输出文件目录
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, 'dist'), // node语法，__dirname 获取当前文件的路径
    },

    // 不同类型模块的处理规则
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            // 它会应用到普通的 `.js` 文件
            // 以及 `.vue` 文件中的 `<script>` 块
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            // 它会应用到普通的 `.css` 文件
            // 以及 `.vue` 文件中的 `<style>` 块 4.3.0
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                use: ['vue-style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                loader: 'url-loader',
                options: {
                    name: 'img/[name].[hash:10].[ext]', // 文件名字
                    limit: 5 * 1024, // 大小限制 5kb，超出了 用 file-loader 处理
                    esModule: false, // webpack打包后 html 中的 img标签 的 src属性成了[object_Module]
                    // 默认情况下，文件加载器生成使用ES modules语法的JS模块。在某些情况下，使用ES模块是有益的，例如在 module concatenation 和t ree- shaking 的情况下。可以使用以下方法启用CommonJS模块语法
                },
            },
        ]
    },
    plugins: [
        // 请确保引入这个插件来施展魔法
        new VueLoaderPlugin(),
        new DefinePlugin({
            //定义BASE_URL index.html中需要使用
            BASE_URL: '/public/',
        }),
        new HtmlWebpackPlugin({
            title: 'App',
            // favicon: "./public/favicon.ico", // 在此处设置
            template: './public/index.html',
        }),
        new CopyWebpackPlugin(['public'])
    ]
}