import path from "path";
import type { Execution } from "@bongnv/press-core";
import type WebpackConfig from "webpack-chain";

const PLUGIN_NAME = "VuePagesPlugin";

interface Params {
  routesLoaderPath: string;
  execution: Execution;
  webpackConfig: WebpackConfig;
}

function configWebpack({
  routesLoaderPath,
  execution,
  webpackConfig,
}: Params): void {
  const { baseDir } = execution;
  webpackConfig.module
    .rule("compile-vue-pages-routes")
    .test(routesLoaderPath)
    .use("val-loader")
    .loader("val-loader")
    .options({
      baseDir,
    });
}

export default function ({ hooks }: Execution): void {
  const routesLoaderPath = path.resolve(
    __dirname,
    "../vue-app/routes-loader.js",
  );
  hooks.prepare.tap(PLUGIN_NAME, ({ enhancers }: Execution) => {
    enhancers.push(routesLoaderPath);
  });

  hooks.configWebpack.tap(PLUGIN_NAME, (execution: Execution) => {
    configWebpack({
      routesLoaderPath,
      execution,
      webpackConfig: execution.clientWebpackConfig,
    });
    configWebpack({
      routesLoaderPath,
      execution,
      webpackConfig: execution.serverWebpackConfig,
    });
  });
}
