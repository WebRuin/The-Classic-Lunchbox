const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devMode = process.env.NODE_ENV !== "production";
const SRC_DIR = __dirname + "/src";
const DIST_DIR = __dirname + "/dist";

// let isDevelopment = devMode ? true : false;

module.exports = {
  entry: {
    app: path.resolve(__dirname, "app.js"),
    index: path.resolve(SRC_DIR, "index.html")
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  },
  output: {
    publicPath: "/",
    path: __dirname + "/dist",
    filename: "./src/[name].bundle.js"
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
            options: {
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
    extensions: ["*", ".js"]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      inject: "head",
      filename: path.resolve(DIST_DIR, "index.html"),
      template: path.resolve(SRC_DIR, "index.html")
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? "[name].css" : "[name].[hash].css",
      chunkFilename: devMode ? "[id].css" : "[id].[hash].css"
    })
  ],
  devServer: {
    contentBase: DIST_DIR,
    hot: true,
    port: 4400
  }
};
