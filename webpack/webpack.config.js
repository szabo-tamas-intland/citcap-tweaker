const path = require("path");
const fs = require("fs");
const CopyPlugin = require("copy-webpack-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");

const fileNames = fs
  .readdirSync(path.resolve(__dirname, "../src"), { recursive: true })
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
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        type: "asset/resource",
        generator: {
          filename: "[name].min.css",
        },
        use: ["sass-loader"],
      },
    ],
  },
  plugins: [
    new FixStyleOnlyEntriesPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: ".",
          to: ".",
          context: "public",
          globOptions: { ignore: ["**/*.scss"] },
        },
      ],
    }),
  ],
  watch: true,
  watchOptions: {
    poll: 1000,
  },
};
