import path from "path";
import type WebpackConfig from "webpack-chain";

import type { Execution } from "../execution";

const PLUGIN_NAME = "EnhancersPlugin";

interface Params {
  enhancers: string[];
  vueAppDir: string;
  webpackConfig: WebpackConfig;
}

function configWebpack({ vueAppDir, enhancers, webpackConfig }: Params) {
  webpackConfig.module
    .rule("compile-enhancers")
    .test(path.join(vueAppDir, "enhancers.js"))
    .use("val-loader")
    .loader("val-loader")
    .options({
      enhancers: enhancers,
    });
}

export default function ({ hooks }: Execution) {
  const vueAppDir = path.resolve(__dirname, "../../enhancers");

  hooks.configWebpack.tap(
    PLUGIN_NAME,
    ({ enhancers, clientWebpackConfig, serverWebpackConfig }: Execution) => {
      configWebpack({
        vueAppDir,
        enhancers,
        webpackConfig: clientWebpackConfig,
      });
      configWebpack({
        vueAppDir,
        enhancers,
        webpackConfig: serverWebpackConfig
      });
    },
  );
}
