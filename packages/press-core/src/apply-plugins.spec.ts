import { applyPlugins } from "./apply-plugins";
import { Execution } from "./execution";
import corePlugin from "./plugins/core";
import devServerPlugin from "./plugins/dev-server";
import staticGenPlugin from "./plugins/static-gen";

jest.mock("./plugins/core");
jest.mock("./plugins/dev-server");
jest.mock("./plugins/static-gen");

test("applyPlugins should apply default plugins", () => {
  const execution = new Execution({ baseDir: "/" });
  applyPlugins([], execution);
  expect(corePlugin).toHaveBeenCalledTimes(1);
  expect(devServerPlugin).toHaveBeenCalledTimes(1);
  expect(staticGenPlugin).toHaveBeenCalledTimes(1);
});
