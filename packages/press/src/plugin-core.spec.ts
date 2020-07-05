import MiniCssExtractPlugin from "mini-css-extract-plugin";

import type { Config } from "./load-config";
import { defaultConfig } from "./load-config";
import { Core } from "./plugin-core";
import { Execution } from "./execution";

jest.mock("mini-css-extract-plugin");

test("Core should apply configWebpack properly", async () => {
  MiniCssExtractPlugin.loader = "mini-css-extract-plugin-loader";

  const config: Config = defaultConfig("/");

  const corePlugin = new Core();
  corePlugin.vueAppDir = "/";
  const execution = new Execution(config);
  corePlugin.apply(execution);
  await execution.hooks.configWebpack.promise(execution);
  expect(execution.clientWebpackConfig.toConfig()).toMatchSnapshot();
  expect(execution.serverWebpackConfig.toConfig()).toMatchSnapshot();
});
