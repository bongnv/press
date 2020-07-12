import { ensureFile, readJSON, writeFile } from "fs-extra";
import { mocked } from "ts-jest/utils";
import { createBundleRenderer } from "vue-server-renderer";
import type { BundleRenderer } from "vue-server-renderer";

import { StaticGen } from "./static-gen";
import { Execution } from "../execution";
import type { Config } from "../load-config";
import { defaultConfig } from "../load-config";

jest.mock("fs-extra");
jest.mock("vue-server-renderer");

beforeEach(() => {
  jest.clearAllMocks();
  mocked(readJSON).mockClear();
});

test("Core should apply generate hook properly", async () => {
  const config: Config = defaultConfig();
  const plugin = new StaticGen();
  const execution = new Execution(config);
  execution.urlsToRender = ["/"];
  plugin.apply(execution);

  const mockReadJSON = mocked(<() => Promise<any>>readJSON);
  mockReadJSON.mockResolvedValueOnce({});
  const mockRenderer = jest.fn();
  mocked(createBundleRenderer).mockReturnValueOnce(<BundleRenderer>({
    renderToString: mockRenderer,
  } as unknown));
  mockRenderer.mockResolvedValueOnce("<div />");

  await execution.commands.build.promise(execution);
  await execution.hooks.generate.promise(execution);

  expect(mockReadJSON).toHaveBeenCalledTimes(1);
  expect(mockRenderer).toHaveBeenCalledTimes(1);
  expect(mocked(ensureFile)).toHaveBeenCalledTimes(1);
  expect(mocked(writeFile)).toHaveBeenCalledTimes(1);
});
