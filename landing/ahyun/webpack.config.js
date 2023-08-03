const path = require("path");

module.exports = {
  entry: {
    main: "./src/main.ts",
  },
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
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use: ["file-loader"],
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
