const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: './src/js/index.js',
    output:{
        path: path.resolve(__dirname,'dist'),
        filename:'js/bundle.js'//will be specified/injected to index.html of dist folder automatically
    },
    devServer:{
        contentBase:'./dist' //the folder we need to ship on server
        //can also specift port
    },
    plugins:[
        new HtmlWebpackPlugin({
            filename:'index.html',
            template:'./src/index.html'
        })
    ],
    module:{
        rules:[
            {
                test:/\.js$/,
                exclude:/node_modules/,
                use:{
                    loader:'babel-loader'
                }
            }
        ]
    }
};