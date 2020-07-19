import path from "path";
import { Execution } from "@bongnv/press-core";

import vuePagesPlugin from "./index";

test("Enhancers should apply configWebpack properly", async () => {
  jest
    .spyOn(path, "resolve")
    .mockImplementationOnce((_, localPath) => path.join("/", localPath));

  const execution = new Execution({
    baseDir: "/",
  });

  vuePagesPlugin(execution);
  await execution.hooks.configWebpack.promise(execution);
  expect(execution.clientWebpackConfig.toConfig()).toMatchSnapshot();
  expect(execution.serverWebpackConfig.toConfig()).toMatchSnapshot();
});
