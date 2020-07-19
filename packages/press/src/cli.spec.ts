import { mocked } from "ts-jest/utils";
import cli from "./cli";
import { dev, build } from "./press";

jest.mock("./press");

beforeEach(() => {
  jest.clearAllMocks();
});

test("dev command should call dev function", () => {
  cli().parse("dev");
  expect(mocked(dev)).toHaveBeenCalledTimes(1);
});

test("build command should call build function", () => {
  cli().parse("build");
  expect(mocked(build)).toHaveBeenCalledTimes(1);
});

test("none command should call no function", () => {
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  //@ts-ignore
  const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
    // do nothing
  });

  cli().parse("");
  expect(mockExit).toHaveBeenCalledWith(1);

  mockExit.mockRestore();
});
