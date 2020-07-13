import { mocked } from "ts-jest/utils";
import WebpackDevServer from "webpack-dev-server";

import { DevServer } from "./dev-server";
import { Execution } from "../execution";
import { defaultConfig } from "../load-config";

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

  const plugin = new DevServer();
  const config = defaultConfig();
  const execution = new Execution(config);
  plugin.apply(execution);
  await execution.commands.dev.promise(execution);
  await execution.hooks.bundle.promise(execution);

  expect(mockWebpackDevServer).toHaveBeenCalledTimes(1);
  expect(mockListen).toHaveBeenCalledTimes(1);
});
