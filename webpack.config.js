"use strict";
const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: [
    "regenerator-runtime/runtime",
    path.resolve(__dirname, "src/index.js"),
  ],
  devtool: "source-map",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "web.js",
    library: "jsC8",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      // NOTE: these rules apply in reverse order
      {
        test: /\.(ts|js)$/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  browsers: ["> 2%", "ie 11"],
                },
                useBuiltIns: "usage",
                corejs: 3, // added corejs option
              },
            ],
          ],
          plugins: [
            "@babel/plugin-transform-runtime",
            "@babel/plugin-proposal-object-rest-spread",
            "@babel/plugin-transform-modules-commonjs",
          ],
        },
      },
      {
        test: /\.ts/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
          compilerOptions: { target: "esnext" },
        },
      },
    ],
  },
  resolve: {
    extensions: [".web.js", ".web.ts", ".js", ".ts", ".json"],
    fallback: {
      querystring: require.resolve("querystring-es3"),
      path: require.resolve("path-browserify"),
      url: require.resolve("url"),
    },
    alias: {
      "./async": path.resolve(__dirname, "lib/async"),
      "./cjs": path.resolve(__dirname, "lib/cjs"),
    },
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({ extractComments: false })],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"), // changed process.env
    }),
  ],
};
