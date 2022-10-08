const path = require("path");

const config = {
  target: "electron-main",
  devtool: "source-map",
  entry: {
    main: "./src/main.ts",
    preload: "./src/mainElectronProcess/preload.ts"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js",".css"]
  },
  node: {
    __dirname: false,
    __filename: false
  },
};

module.exports = (env, argv) => {
  return config;
};