const path = require("path");
module.exports = {
  context: __dirname,
  entry: "./app/app.js",
  output: {
    path: path.resolve(__dirname, "app", "assets", "javascripts"),
    filename: "bundle.js"
  },
  resolve: {
    extensions: [".js", "*"]
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        query: {
          presets: ["es2015"]
        }
      }
    ]
  },
  devtool: "source-maps"
};
