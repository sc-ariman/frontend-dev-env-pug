const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/js/app.js"
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "../www/assets/js/bundle/")
  },
  devtool: "#inline-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["env"]
            }
          }
        ]
      },
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      }
    ]
  },
  optimization: {
    splitChunks: {
      name: "vendor",
      chunks: "initial"
    }
    // splitChunks: {
    //   cacheGroups: {
    //     // 今回はvendorだが、任意の名前で問題ない
    //     vendor: {
    //       // node_modules配下のモジュールをバンドル対象とする
    //       test:/node_modules/,
    //       name: 'vendor',
    //       chunks: 'initial',
    //       enforce: true
    //     },
    //     vendorModules: {
    //       // 今回はsrc/js/modules配下にバンドルしたいモジュールが存在するため指定は以下になる
    //       test: /src\/js\/modules/,
    //       name: 'vendor-modules',
    //       chunks: 'initial',
    //       enforce: true
    //     }
    //   }
    // }
  }
};
