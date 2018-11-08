const path = require('path')
const bundlePath = path.resolve(__dirname,'dist');
const webpack = require("webpack");
/*helps build absolute paths from given strings to particular files*/
const { WebpackHelper } = require('./webpackConfigHelpers')


const config = {
  entry :{

    index :  WebpackHelper.viewRootMap([
      'index.js',
    ]),

    login : WebpackHelper.viewRootMap([
      'login.tsx'
    ]),

    user_page : WebpackHelper.viewRootMap([
      'user_page.tsx'
    ])

  },
  devtool: "source-map",
  output: {
    filename: '[name].js',
    path: bundlePath
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/react'],
            plugins: ['@babel/plugin-transform-runtime',
            ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }] ]
          }
        }
      },
      { test: /\.css$/,use: ['style-loader', 'css-loader']},
      { test: /\.tsx?$/, loader: "ts-loader" },
      { test: /\.(png|jpg|gif)$/, use: [
         {
           loader: 'file-loader',
           options: {
             name: '[name].[ext]',
             publicPath: 'static/'
           }
         }
       ]
     },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  resolve: {extensions: ['jpg','.tsx', '.ts', '*', '.js', '.jsx']},
  devServer: {
    contentBase: path.join(__dirname,'public'),
    port: 3000,
    publicPath: "http://localhost:3000/static"
  },
  plugins: [ new webpack.HotModuleReplacementPlugin() ],
  externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    }
};

module.exports = config;
