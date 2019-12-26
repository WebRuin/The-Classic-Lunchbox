const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devMode = process.env.NODE_ENV !== "production";
const SRC_DIR = __dirname + "/src";
const DIST_DIR = __dirname + "/dist";

let isDevelopment = devMode ? true : false;

console.log(isDevelopment);

module.exports = {
  entry: "./app.js",
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  },
  output: {
    path: "/dist",
    publicPath: "/",
    filename: "bundle.js"
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        enforce: "pre",
        exclude: /node_modules/,
        loaders: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            // importLoaders: 1,
            options: {
              modules: {
                localIdentName: "[name]__[local]___[hash:base64:5]"
              },
              sourceMap: true
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(html)$/,
        exclude: /node_modules/,
        use: {
          loader: "html-loader",
          options: { minimize: true }
        }
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: SRC_DIR + "/index.html",
      filename: DIST_DIR + "/index.html"
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? "[name].css" : "[name].[hash].css",
      chunkFilename: devMode ? "[id].css" : "[id].[hash].css"
    })
  ],
  devServer: {
    contentBase: DIST_DIR,
    hot: true,
    port: 4444
  }
};
