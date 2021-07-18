const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require("path")

const { DefinePlugin } = require("webpack")

const HtmlWebpackPlugin = require('html-webpack-plugin')

const CopyWebpackPlugin = require('copy-webpack-plugin')

const { CleanWebpackPlugin } = require("clean-webpack-plugin")

// 提取 css 到单个文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 优化 css 文件
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// terser
const TerserPlugin = require("terser-webpack-plugin");

const { VueLoaderPlugin } = require('vue-loader')

module.exports = merge(common, {
    // 打包模式:生产环境
    mode: 'production',
    //去除sourceMap
    devtool: "none",

    //输出的文件名
    output: {
        // 指定输出文件目录
        filename: "js/[name].[hash:8].js",
    },

    module: {
        rules: [
            {
                test: /\.vue$/,
                include: path.resolve(__dirname),
                use: ['vue-loader'],
            },

            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],

            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
        ]
    },

    plugins: [
        // new VueLoaderPlugin(),
        // 创建 HTML 文件
        new HtmlWebpackPlugin({
            title: 'App', // 页面标题
            template: './public/index.html',
            favicon: "./public/favicon.ico",
            //对html代码进行压缩
            minify: {
                removeComments: true, //去注释
                collapseWhitespace: true, //压缩空格
                removeAttributeQuotes: true, //去除属性引用
                // keepClosingSlash: true, // 保持标签闭合
                // removeRedundantAttributes: true, // 去除冗余属性
                // removeScriptTypeAttributes: true, // 去除脚本类型属性
                // removeStyleLinkTypeAttributes: true, // 去除样式链接类型属性
                // useShortDoctype: true // 使用短文档类型
            }
        }),
        // 设置全局变量
        new DefinePlugin({
            BASE_URL: process.env.NODE_ENV
        }),
        // 清理打包文件
        new CleanWebpackPlugin(),
        // 复制普通文件
        new CopyWebpackPlugin(['public']),
        // 把 CSS 提取到单独的文件中
        new MiniCssExtractPlugin({
            filename: "css/[name].[hash:10].css",
            chunkFilename: "[id].css"
        })
    ],

    // 优化
    optimization: {
        // 动态导入模块
        splitChunks: {
            chunks: "all"
        },
        // 压缩
        minimize: true,
        minimizer: [
            // css 压缩
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    discardComments: { remove: true } // 移除注释
                }
            }),
            // Terser
            new TerserPlugin({
                parallel: true, // 使用多进程并行运行来提高构建速度
                terserOptions: {
                    warnings: true, // 不展示 warning
                    compress: {
                        unused: true, // 去除未使用的
                        drop_debugger: true, // 移除 debugger
                        drop_console: true // 去除 console
                    },
                    module: false,
                }
            })
        ]
    },
});