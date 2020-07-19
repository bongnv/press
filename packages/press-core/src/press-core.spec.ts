import { mocked } from "ts-jest/utils";

import { Execution } from "./execution";
import { build, dev } from "./press-core";
import { applyPlugins } from "./apply-plugins";

jest.mock("./execution");
jest.mock("./apply-plugins");

beforeEach(() => {
  jest.clearAllMocks();
});

test("build should run properly", async () => {
  const mockExecution = mocked(Execution, true);
  mockExecution.mockImplementationOnce(() => {
    const actualModule = jest.requireActual("./execution");
    return new actualModule.Execution({ baseDir: "/" });
  });

  await build({ baseDir: "/" });
  expect(mockExecution).toHaveBeenCalledTimes(1);
  expect(mocked(applyPlugins)).toHaveBeenCalledTimes(1);
});

test("dev should run properly", async () => {
  const mockExecution = mocked(Execution);
  mockExecution.mockImplementationOnce(() => {
    const actualModule = jest.requireActual("./execution");
    return new actualModule.Execution({ baseDir: "/" });
  });

  await dev({ baseDir: "/" });
  expect(mockExecution).toHaveBeenCalledTimes(1);
  expect(mocked(applyPlugins)).toHaveBeenCalledTimes(1);
});
