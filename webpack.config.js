var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
var WriteFilePlugin = require('write-file-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var pages = ['index','rankingList']; //每个页面的name,和pages下每个子模块文件名字一致
var entry = {};
pages.forEach(function(pageName) {
    entry[pageName] = `./src/pages/${pageName}/main.js`;
});
module.exports = {
    entry: entry,
    output: {
        path: path.resolve(__dirname, `./dist/`),
        publicPath: process.env.NODE_ENV === 'production' ? '/front/' : '/', //发布后在线访问的url。dev模式下，使用的是express在当前项目根目录启动
        filename: `[name].js` //'[name].[chunkhash].js', '[name].[hash:8].js'
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            }, {
                test: /\.less$/,
                use: ['style-loader', 'less-loader', 'postcss-loader']
            }, {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {}
                    // other vue-loader options
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz|png)(\?.+)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1000000
                        // name: 'img_hash/[name][hash:8].[ext]'
                    }
                }]
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        overlay: true,
        port: 8090
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map',
    //devserver使用memory-fs，并不直接写文件系统。配合WriteFilePlugin可以强制写入。
    //如果不使用devserver访问，就需要强制写入了。例如fiddler替换
    plugins: [
        //new WriteFilePlugin({
        //    //test: /\.css|\.html|\.js$/,     // Write only files that match the regexp
        //    useHashIndex: true  //Use hash index to write only files that have changed since the last iteration
        //})
    ]
}
pages.forEach(function(pageName) {
    module.exports.plugins.push(
        new HtmlWebpackPlugin({
            title: pageName,
            filename: `${pageName}.html`,
            template: `./src/pages/tpl.html`,
            chunks: [pageName],
            inlineSource: '.(js|css)$' // embed all javascript and css inline。结合HtmlWebpackInlineSourcePlugin才有效果
        })
    );
});
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new CleanWebpackPlugin(['dist']),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new webpack.optimize.UglifyJsPlugin({
            //sourceMap: true,  //开启max_line_len后会有报错，二选一
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true,
                pure_funcs: ['alert'], //去除相应的函数
                passes: 1
            },
            output: {
                max_line_len: 100
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
    ]);
    module.exports.plugins.push(
        new HtmlWebpackInlineSourcePlugin() //内联css、js。配合HtmlWebpackPlugin
    );
} else {
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ])
}