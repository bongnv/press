import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";

import corePlugin from "./core";
import { Execution } from "../execution";

jest.mock("mini-css-extract-plugin");

test("Core should apply configWebpack properly", async () => {
  MiniCssExtractPlugin.loader = "mini-css-extract-plugin-loader";
  jest.spyOn(path, "resolve").mockImplementationOnce(() => "/vue-app");

  const execution = new Execution({
    baseDir: "/",
  });

  corePlugin(execution);
  await execution.hooks.configWebpack.promise(execution);
  expect(execution.clientWebpackConfig.toConfig()).toMatchSnapshot();
  expect(execution.serverWebpackConfig.toConfig()).toMatchSnapshot();
});
