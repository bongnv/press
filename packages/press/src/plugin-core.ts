import type WebpackConfig from "webpack-chain";
import type { Execution } from "./execution";
import type { Config } from "./load-config";

import path from "path";
import webpack from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { VueLoaderPlugin } from "vue-loader";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import VueSSRClientPlugin from "vue-server-renderer/client-plugin";

const PLUGIN_NAME = "PressCore";

export class Core {
  vueAppDir: string;
  constructor() {
    this.vueAppDir = path.resolve(__dirname, "../vue-app");
  }

  apply({ commands, hooks }: Execution) {
    hooks.configWebpack.tap(
      PLUGIN_NAME,
      ({ config, clientWebpackConfig }: Execution) => {
        this.applyBaseConfig(config.isProd, clientWebpackConfig);
        this.applyClientConfig(config, clientWebpackConfig);
      },
    );

    commands.build.tap(PLUGIN_NAME, ({ hooks }: Execution) => {
      hooks.bundle.tapPromise(
        PLUGIN_NAME,
        ({ clientWebpackConfig }: Execution) =>
          this.runWebpack(clientWebpackConfig.toConfig()),
      );
    });
  }

  private applyBaseConfig(isProd: boolean, webpackConfig: WebpackConfig) {
    webpackConfig.mode(isProd ? "production" : "development");

    webpackConfig.module
      .rule("compile-vue")
      .test(/\.vue$/)
      .use("vue-loader")
      .loader("vue-loader");

    webpackConfig.module
      .rule("compile-css")
      .test(/\.css$/)
      .use("mini-css-extract")
      .loader(MiniCssExtractPlugin.loader)
      .end()
      .use("css-loader")
      .loader("css-loader")
      .options({
        importLoaders: 1,
      })
      .end()
      .use("postcss-loader")
      .loader("postcss-loader")
      .end();

    webpackConfig.plugin("vue-loader").use(new VueLoaderPlugin());

    webpackConfig.plugin("mini-css-extract").use(
      new MiniCssExtractPlugin({
        filename: path.join(
          "_assets",
          isProd ? "[name].[contenthash].css" : "[name].css",
        ),
      }),
    );

    webpackConfig
      .plugin("clean")
      .use(new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }));

    webpackConfig.node.set("setImmediate", false);

    webpackConfig.plugin("define-mode").use(
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": isProd ? '"production"' : '"development"',
      }),
    );
  }

  private applyClientConfig(config: Config, webpackConfig: WebpackConfig) {
    const { isProd } = config;

    webpackConfig.entry("app").add(path.join(this.vueAppDir, "entry-client.js"));

    webpackConfig.output
      .path(config.outputDir)
      .publicPath(config.publicPath)
      .filename(isProd ? "[name].[contenthash].js" : "[name].js")
      .chunkFilename(isProd ? "[name].[contenthash].js" : "[name].js");

    webpackConfig.plugin("vue-ssr-client").use(new VueSSRClientPlugin());

    webpackConfig.plugin("define-vue").use(
      new webpack.DefinePlugin({
        "process.env.VUE_ENV": '"client"',
      }),
    );
  }

  private runWebpack(config: webpack.Configuration): Promise<webpack.Stats> {
    return new Promise((resolve, reject) => {
      webpack(config, (err, stats) => {
        if (err) {
          console.error("error with webpack", err);
          return reject(err);
        }

        if (stats.hasErrors()) {
          console.error(stats.toString());
          return reject(new Error("Failed to compile with errors"));
        }

        console.log(stats.toString());
        resolve();
      });
    });
  }
}