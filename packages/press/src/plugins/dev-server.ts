import WebpackDevServer from "webpack-dev-server";
import webpack from "webpack";
import type WebpackConfig from "webpack-chain";

import type { Execution } from "../execution";

const PLUGIN_NAME = "DevServer";

export class DevServer {
  devServer?: WebpackDevServer;

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
    // TODO
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
