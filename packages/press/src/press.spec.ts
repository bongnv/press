import { Execution } from "./execution";
import { build } from "./press";

jest.mock("./execution");

beforeEach(() => {
  const mockExecution = <jest.Mock>Execution;
  // Clear all instances and calls to constructor and all methods:
  mockExecution.mockClear();
});

test("build should run properly", async () => {
  const mockExecution = <jest.Mock<Execution>>Execution;
  await build(undefined);
  expect(mockExecution).toHaveBeenCalledTimes(1);
  const mockInstance = mockExecution.mock.instances[0];
  expect(mockInstance.execBuild).toHaveBeenCalledTimes(1);
});
