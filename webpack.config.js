const PORT = process.env.PORT || 5000;
const entryPath = "weather_app";
const entryFile = "app.js";
const path = require("path");
const Compression = require("compression-webpack-plugin");
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: ["whatwg-fetch", `./${entryPath}/js/${entryFile}`],
  output: {
    filename: "out.js",
    path: path.resolve(__dirname, `${entryPath}/build`)
  },
  devServer: {
    contentBase: path.join(__dirname, `${entryPath}`),
    publicPath: "/build/",
    compress: true,
    port: PORT
  },
  mode: "development",
  devtool: "source-map",
  watch: true,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(jpe?g|gif|png|svg)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          publicPath: "/images/icons",
          outputPath: "/images/icons"
        }
      }
    ]
  },
  plugins: [
    new Compression({
      threshold: 0,
      minRatio: 0.8
    }),
    new Dotenv({
      path: path.resolve(__dirname, './.env'),
      safe: true,
      silent: false
    })
  ],
}

