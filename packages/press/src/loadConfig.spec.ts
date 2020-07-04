import { loadConfig } from "./loadConfig";

test("loadConfig should generate default config", () => {
  const config = loadConfig();
  expect(config).toBeTruthy();
  expect(config).toHaveProperty("baseDir");
});
