const path = require("path");
const fs = require("fs");
const CopyPlugin = require("copy-webpack-plugin");

const fileNames = fs
  .readdirSync(path.resolve(__dirname, "../src"))
  .reduce((acc, v) => ({ ...acc, [v]: `./src/${v}` }), {});

module.exports = {
  mode: "production",
  entry: fileNames,
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "[name].js",
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: ".", to: ".", context: "public" }],
    }),
  ],
};
