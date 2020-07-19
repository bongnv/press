import HTMLWebpackPlugin from "html-webpack-plugin";
import path from "path";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import type WebpackConfig from "webpack-chain";

import type { Execution } from "../execution";

const PLUGIN_NAME = "DevServer";

function startDevServer(webpackConfig: WebpackConfig): Promise<void> {
  return new Promise((resolve) => {
    const clientCompiler = webpack(webpackConfig.toConfig());
    const devServer = new WebpackDevServer(
      clientCompiler,
      webpackConfig.toConfig().devServer,
    );
    devServer.listen(5000, "localhost", () => {
      console.log("dev server listening on port 5000");
      resolve();
    });
  });
}

function configWebpack(vueAppDir: string, webpackConfig: WebpackConfig): void {
  webpackConfig.plugin("html-webpack-plugin").use(
    new HTMLWebpackPlugin({
      template: path.join(vueAppDir, "index.dev.html"),
    }),
  );
}

export default function ({ commands }: Execution): void {
  const vueAppDir = path.resolve(__dirname, "../../vue-app");

  commands.dev.tap(PLUGIN_NAME, ({ hooks }: Execution) => {
    hooks.configWebpack.tap(PLUGIN_NAME, ({ clientWebpackConfig }: Execution) =>
      configWebpack(vueAppDir, clientWebpackConfig),
    );

    hooks.bundle.tapPromise(PLUGIN_NAME, ({ clientWebpackConfig }: Execution) =>
      startDevServer(clientWebpackConfig),
    );
  });
}
