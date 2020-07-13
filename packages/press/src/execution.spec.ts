import { mocked } from "ts-jest/utils";

import { Execution } from "./execution";
import type { Config } from "./load-config";
import { defaultConfig } from "./load-config";
import { Core } from "./plugins/core";
import { DevServer } from "./plugins/dev-server";
import { StaticGen } from "./plugins/static-gen";

jest.mock("./plugins/core");
jest.mock("./plugins/static-gen");
jest.mock("./plugins/dev-server");

beforeEach(() => {
  jest.clearAllMocks();
});

test("execBuild should run properly", () => {
  const mockCore = mocked(Core);
  const mockStaticGen = mocked(StaticGen);

  const config: Config = defaultConfig();
  const execution = new Execution(config);

  execution.execBuild();
  expect(mockCore).toHaveBeenCalledTimes(1);
  const mockInstance = mockCore.mock.instances[0];
  expect(mockInstance.apply).toHaveBeenCalledTimes(1);
  expect(mockStaticGen).toHaveBeenCalledTimes(1);
  expect(mockStaticGen.mock.instances[0].apply).toHaveBeenCalledTimes(1);
});

test("execDev should run properly", () => {
  const mockCore = mocked(Core);
  const mockDevServer = mocked(DevServer);

  const config: Config = defaultConfig();
  const execution = new Execution(config);

  execution.execDev();
  expect(mockCore).toHaveBeenCalledTimes(1);
  const mockInstance = mockCore.mock.instances[0];
  expect(mockInstance.apply).toHaveBeenCalledTimes(1);
  expect(mockDevServer).toHaveBeenCalledTimes(1);
  expect(mockDevServer.mock.instances[0].apply).toHaveBeenCalledTimes(1);
});
