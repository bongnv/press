import type WebpackConfig from "webpack-chain";
import type { Execution } from "../execution";

import path from "path";
import webpack from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { VueLoaderPlugin } from "vue-loader";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import VueSSRClientPlugin from "vue-server-renderer/client-plugin";
import VueServerBundlePlugin from "vue-server-renderer/server-plugin";
import nodeExternals from "webpack-node-externals";

const PLUGIN_NAME = "CorePlugin";

interface Context {
  vueAppDir: string;
  execution: Execution;
}

function applyBaseConfig(
  { vueAppDir, execution }: Context,
  webpackConfig: WebpackConfig,
) {
  const { isProd, enhancers } = execution;
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

  webpackConfig.module
    .rule("compile-enhancers")
    .test(path.join(vueAppDir, "enhancers.js"))
    .use("val-loader")
    .loader("val-loader")
    .options({
      enhancers: enhancers,
    });

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

  webpackConfig.plugin("define").use(
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": isProd ? '"production"' : '"development"',
    }),
  );
}

function applyClientConfig(ctx: Context) {
  const { isProd, outputDir, publicPath } = ctx.execution;
  const webpackConfig = ctx.execution.clientWebpackConfig;

  applyBaseConfig(ctx, webpackConfig);

  webpackConfig.entry("app").add(path.join(ctx.vueAppDir, "entry-client.js"));

  webpackConfig.output
    .path(outputDir)
    .publicPath(publicPath)
    .filename(isProd ? "[name].[contenthash].js" : "[name].js")
    .chunkFilename(isProd ? "[name].[contenthash].js" : "[name].js");

  webpackConfig.plugin("vue-ssr-client").use(new VueSSRClientPlugin());
  webpackConfig.plugin("define-vue-end").use(
    new webpack.DefinePlugin({
      "process.env.VUE_ENV": "client",
    }),
  );
}

function applyServerConfig(ctx: Context) {
  const { serverPath } = ctx.execution;
  const webpackConfig = ctx.execution.serverWebpackConfig;

  applyBaseConfig(ctx, webpackConfig);

  webpackConfig
    .target("node")
    .entry("app")
    .add(path.join(ctx.vueAppDir, "entry-server.js"))
    .end();

  webpackConfig.output.libraryTarget("commonjs2").path(serverPath);

  webpackConfig.plugin("vue-server-bundle").use(new VueServerBundlePlugin());
  webpackConfig.optimization.minimize(false);
  webpackConfig.externals(
    nodeExternals({
      // do not externalize CSS files in case we need to import it from a dep
      whitelist: /\.css$/,
    }),
  );

  webpackConfig.plugin("define-vue-end").use(
    new webpack.DefinePlugin({
      "process.env.VUE_ENV": "server",
    }),
  );
}

function runWebpack(config: webpack.Configuration): Promise<webpack.Stats> {
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

export default function ({ commands, hooks }: Execution): void {
  const vueAppDir = path.resolve(__dirname, "../../vue-app");

  hooks.configWebpack.tap(PLUGIN_NAME, (execution: Execution) => {
    applyClientConfig({
      vueAppDir,
      execution,
    });
    applyServerConfig({
      vueAppDir,
      execution,
    });
  });

  commands.build.tap(PLUGIN_NAME, ({ hooks }: Execution) => {
    hooks.bundle.tapPromise(
      PLUGIN_NAME,
      ({ clientWebpackConfig, serverWebpackConfig }: Execution) =>
        Promise.all([
          runWebpack(clientWebpackConfig.toConfig()),
          runWebpack(serverWebpackConfig.toConfig()),
        ]),
    );
  });
}
