import type { Config } from "./load-config";
import { defaultConfig } from "./load-config";
import { Core } from "./plugins/core";
import { Execution } from "./execution";

jest.mock("./plugins/core");

beforeEach(() => {
  const mockCore = <jest.Mock<Core>>(Core as unknown);
  mockCore.mockClear();
});

test("execBuild should run properly", () => {
  const mockCore = <jest.Mock<Core>>(Core as unknown);
  const config: Config = defaultConfig();

  const execution = new Execution(config);
  const spyBuildPromise = jest.spyOn(execution.commands.build, "promise");

  execution.execBuild();
  expect(mockCore).toHaveBeenCalledTimes(1);
  const mockInstance = mockCore.mock.instances[0];
  expect(mockInstance.apply).toHaveBeenCalledTimes(1);
  expect(spyBuildPromise).toHaveBeenCalledTimes(1);
});
