import { loadConfig } from "./load-config";

test("loadConfig should generate default config", () => {
  const config = loadConfig();
  expect(config).toBeTruthy();
  expect(config).toHaveProperty("baseDir");
  expect(config.isProd).toEqual(false);
});
