const path = require("path");

module.exports = {
  entry: {
    main: "./src/main.ts",
    "01-basic": "./src/01-basic.js",
    "02-geometry": "./src/02-geometry.js",
    "03-scene-graph": "./src/03-scene-graph.js",
    "04-material": "./src/04-material.js",
    "05-custom-geometry": "./src/05-custom-geometry.js",
    "06-light": "./src/06-light.js",
    "07-camera": "./src/07-camera.js",
    "08-shadow": "./src/08-shadow.js",
  },
  output: {
    filename: "./[name].js",
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
