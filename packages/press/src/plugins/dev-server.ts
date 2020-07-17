import HTMLWebpackPlugin from "html-webpack-plugin";
import path from "path";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import type WebpackConfig from "webpack-chain";

import type { Execution } from "../execution";

const PLUGIN_NAME = "DevServer";

export class DevServer {
  devServer?: WebpackDevServer;
  vueAppDir: string;

  constructor() {
    this.vueAppDir = path.join(__dirname, "../../vue-app");
  }

  apply({ commands }: Execution): void {
    commands.dev.tap(PLUGIN_NAME, ({ hooks }: Execution) => {
      hooks.configWebpack.tap(
        PLUGIN_NAME,
        ({ clientWebpackConfig }: Execution) =>
          this.configWebpack(clientWebpackConfig),
      );

      hooks.bundle.tapPromise(
        PLUGIN_NAME,
        ({ clientWebpackConfig }: Execution) =>
          this.startDevServer(clientWebpackConfig),
      );
    });
  }

  private configWebpack(webpackConfig: WebpackConfig) {
    webpackConfig
      .plugin("html-webpack-plugin")
      .use(new HTMLWebpackPlugin({
        template: path.join(this.vueAppDir, "index.dev.html"),
      }))
  }

  private startDevServer(webpackConfig: WebpackConfig) {
    return new Promise((resolve) => {
      const clientCompiler = webpack(webpackConfig.toConfig());
      this.devServer = new WebpackDevServer(
        clientCompiler,
        webpackConfig.toConfig().devServer,
      );
      this.devServer.listen(5000, "localhost", () => {
        console.log("dev server listening on port 5000");
        resolve();
      });
    });
  }
}
