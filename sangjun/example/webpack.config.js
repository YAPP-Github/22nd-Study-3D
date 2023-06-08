const path = require("path");
const webpack = require("webpack");

module.exports = (env) => {
  console.log(env);
  return {
    entry: "./src/main.ts",
    output: {
      filename: "./main.js",
      path: path.resolve(__dirname, "public"),
    },

    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.ts/,
          use: "ts-loader",
        },
      ],
    },
    devServer: {
      static: {
        directory: path.join(__dirname, "public"),
      },
      compress: true,
      port: 3000,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
  };
};
