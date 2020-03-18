const path = require("path");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const config = (env, argv) => {
  const { mode, analyze } = argv;

  const isDevMode = mode === "development";
  const isProdMode = mode === "production";

  const isTestEnv = process.env.NODE_ENV === "test";

  let stats = "none";
  let plugins = [
    new MiniCssExtractPlugin({
      filename: isProdMode
        ? "[name]-styles.[contentHash:8].css"
        : "[name]-styles.css",
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
      favicon: path.resolve(__dirname, "public/favicon.ico"),
    }),
  ];

  if (isProdMode) {
    plugins = plugins.concat(
      new CleanWebpackPlugin(),
      new CompressionPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8,
      }),
      new CompressionPlugin({
        filename: "[path].br[query]",
        algorithm: "brotliCompress",
        test: /\.(js|css|html|svg)$/,
        compressionOptions: { level: 11 },
        threshold: 10240,
        minRatio: 0.8,
      })
    );
  } else if (isDevMode) {
    stats = "minimal";
  }

  if (analyze) {
    stats = "normal";
    plugins = plugins.concat([new BundleAnalyzerPlugin()]);
  }

  return {
    entry: [path.resolve(__dirname, "src/index.js")],
    output: {
      path: path.resolve(__dirname, "build"),
      filename: isDevMode ? "[name].js" : "[name].[chunkHash:8].js",
      publicPath: "/",
    },
    mode,
    stats,
    plugins,
    resolve: {
      alias: isDevMode
        ? {
            "react-dom": "@hot-loader/react-dom",
          }
        : {},
    },
    devServer: {
      contentBase: path.resolve(__dirname, "public"),
      contentBasePublicPath: "/",
      clientLogLevel: "error",
      public: "localhost:3000",
      // inline: false,
      compress: true,
      host: "localhost",
      https: false,
      port: 3000,
      liveReload: false,
      hot: true,
      hotOnly: true,
      transportMode: "ws",
      injectHot: true,
      open: !isTestEnv,
      proxy: {
        "/api": {
          changeOrigin: true,
          target: "http://localhost:3003/",
          secure: false,
        },
      },
      historyApiFallback: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization",
      },
    },
    devtool: isProdMode ? false : "eval-source-map",
    optimization: {
      nodeEnv: isTestEnv ? "test" : mode,
      minimize: isProdMode,
      minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin()],
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            name(module) {
              /*
                Grab the module name after /node_modules/ and optionally check
                for pnpm paths
              */
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.pnpm[\\/]registry.npmjs.org[\\/])?(.*?)([\\/]|$)/
              )[2];

              // Strip potentially unsafe "@" from filename
              return `npm.${packageName.replace("@", "")}`;
            },
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: { hmr: isDevMode },
            },
            { loader: "css-loader" },
          ],
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "fonts/",
              },
            },
          ],
        },
      ],
    },
  };
};

module.exports = config;
