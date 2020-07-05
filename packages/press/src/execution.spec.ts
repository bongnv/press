import type { Config } from "./load-config";
import { Core } from "./plugin-core";
import { Execution } from "./execution";

jest.mock("./plugin-core");

beforeEach(() => {
  const mockCore = <jest.Mock<Core>>(Core as unknown);
  mockCore.mockClear();
});

test("execBuild should run properly", () => {
  const mockCore = <jest.Mock<Core>>(Core as unknown);
  const config: Config = {
    baseDir: "/",
    outputDir: "/dist",
    publicPath: "/",
    isProd: false,
  };

  const execution = new Execution(config);
  const spyBuildPromise = jest.spyOn(execution.commands.build, "promise");

  execution.execBuild();
  expect(mockCore).toHaveBeenCalledTimes(1);
  const mockInstance = mockCore.mock.instances[0];
  expect(mockInstance.apply).toHaveBeenCalledTimes(1);
  expect(spyBuildPromise).toHaveBeenCalledTimes(1);
});
