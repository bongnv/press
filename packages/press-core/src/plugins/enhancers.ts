import path from "path";
import type WebpackConfig from "webpack-chain";

import type { Execution } from "../execution";

const PLUGIN_NAME = "EnhancersPlugin";

interface Params {
  enhancers: string[];
  enhancersLoaderPath: string;
  webpackConfig: WebpackConfig;
}

function configWebpack({
  enhancersLoaderPath,
  enhancers,
  webpackConfig,
}: Params) {
  webpackConfig.module
    .rule("compile-enhancers")
    .test(enhancersLoaderPath)
    .use("val-loader")
    .loader("val-loader")
    .options({
      enhancers: enhancers,
    });
}

export default function ({ hooks }: Execution): void {
  const enhancersLoaderPath = path.resolve(
    __dirname,
    "../../vue-app/enhancers-loader.js",
  );

  hooks.configWebpack.tap(
    PLUGIN_NAME,
    ({ enhancers, clientWebpackConfig, serverWebpackConfig }: Execution) => {
      configWebpack({
        enhancersLoaderPath,
        enhancers,
        webpackConfig: clientWebpackConfig,
      });
      configWebpack({
        enhancersLoaderPath,
        enhancers,
        webpackConfig: serverWebpackConfig,
      });
    },
  );
}
