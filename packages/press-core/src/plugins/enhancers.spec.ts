import path from "path";

import enhancersPlugin from "./enhancers";
import { Execution } from "../execution";

test("Enhancers should apply configWebpack properly", async () => {
  jest
    .spyOn(path, "resolve")
    .mockImplementationOnce((_, localPath) => path.join("/", localPath));

  const execution = new Execution({
    baseDir: "/",
  });

  enhancersPlugin(execution);
  await execution.hooks.configWebpack.promise(execution);
  expect(execution.clientWebpackConfig.toConfig()).toMatchSnapshot();
  expect(execution.serverWebpackConfig.toConfig()).toMatchSnapshot();
});
