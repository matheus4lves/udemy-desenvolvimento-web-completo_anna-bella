const currentTask = process.env.npm_lifecycle_event;
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fse = require("fs-extra");
const postcssPlugins = [
  require("postcss-import"),
  require("postcss-mixins"),
  require("postcss-nested"),
  require("postcss-simple-vars"),
  require("autoprefixer"),
];

class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap("Copy images", function () {
      fse.copySync("./app/assets/images", "./docs/assets/images");
    });
  }
}

let cssConfig = {
  test: /\.css$/i,
  use: [
    "css-loader?url=false",
    {
      loader: "postcss-loader",
      options: { postcssOptions: { plugins: postcssPlugins } },
    },
  ],
};

let pages = fse
  .readdirSync("./app")
  .filter(function (file) {
    return file.endsWith(".html");
  })
  .map(function (page) {
    return new HtmlWebpackPlugin({
      filename: page,
      template: `./app/${page}`,
    });
  });

let config = {
  entry: {
    index: "./app/assets/scripts/index.js",
  },
  plugins: pages,
  module: {
    rules: [
      // {
      //   test: /\.html$/i,
      //   type: "asset/source",
      // },
      cssConfig,
      // {
      //   test: /\.(png|svg|jpg|jpeg|gif)$/i,
      //   type: "asset/resource",
      // },
    ],
  },
};

if (currentTask == "dev") {
  cssConfig.use.unshift("style-loader");
  config.output = {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "app"),
  };
  config.devServer = {
    contentBase: path.join(__dirname, "app"),
    before: function (app, server) {
      server._watch("./app/**/*.html");
    },
    index: "index.html",
    hot: true,
    host: "0.0.0.0",
    port: 3000,
    useLocalIp: true,
    open: {
      app: [
        "/opt/firefox-84.0b4/firefox/firefox",
        "-P web-development",
        "--private-window",
      ],
    },
  };
  config.mode = "development";
  // It yields the best quality SourceMaps for development.
  config.devtool = "eval-source-map";
}

if (currentTask == "build") {
  config.module.rules.push({
    test: /\.js$/,
    exclude: /(node_modules)/,
    use: {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"],
      },
    },
  });
  cssConfig.use.unshift(MiniCssExtractPlugin.loader);
  config.output = {
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "docs"),
  };
  config.mode = "production";
  config.optimization = {
    splitChunks: { chunks: "all" },
    minimize: true,
    minimizer: [`...`, new CssMinimizerWebpackPlugin()],
  };
  config.plugins.push(
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "styles.[chunkhash].css",
    }),
    new RunAfterCompile()
  );
}

module.exports = config;
