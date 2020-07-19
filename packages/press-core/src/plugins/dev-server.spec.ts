import path from "path";
import { mocked } from "ts-jest/utils";
import WebpackDevServer from "webpack-dev-server";

import { Execution } from "../execution";
import devServerPlugin from "./dev-server";

jest.mock("webpack-dev-server");

beforeEach(() => {
  jest.clearAllMocks();
});

test("DevServer should apply bundle hooks properly", async () => {
  const mockWebpackDevServer = mocked(WebpackDevServer);
  const mockListen = jest.fn();
  mockWebpackDevServer.mockImplementationOnce(
    () =>
      (({
        listen: mockListen,
      } as unknown) as WebpackDevServer),
  );
  mockListen.mockImplementationOnce(
    (port: number, host: string, callback: () => void) => {
      callback();
    },
  );

  const execution = new Execution({ baseDir: "/" });
  devServerPlugin(execution);
  await execution.commands.dev.promise(execution);
  await execution.hooks.bundle.promise(execution);

  expect(mockWebpackDevServer).toHaveBeenCalledTimes(1);
  expect(mockListen).toHaveBeenCalledTimes(1);
});

test("DevServer should apply configWebpack hooks properly", async () => {
  jest.spyOn(path, "resolve").mockImplementationOnce(() => "/vue-app");
  const execution = new Execution({ baseDir: "/" });
  devServerPlugin(execution);
  await execution.commands.dev.promise(execution);
  await execution.hooks.configWebpack.promise(execution);
  expect(execution.clientWebpackConfig.toConfig()).toMatchSnapshot();
});
