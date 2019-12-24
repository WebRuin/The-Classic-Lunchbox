module.exports = {
  entry: "./public/app.js",
  output: {
    path: __dirname + "/public/dist",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"]
      }
    ]
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  }
};
