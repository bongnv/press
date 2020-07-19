import type { Config } from "@bongnv/press-core";
import vuePagesPlugin from "@bongnv/press-plugin-vue-pages";

export function loadConfig(argv: any): Config {
  return {
    baseDir: "/",
    plugins: [vuePagesPlugin],
  };
}
