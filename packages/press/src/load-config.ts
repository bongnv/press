import path from "path";

export interface Config {
  baseDir: string;
  outputDir: string;
  isProd: boolean;
  publicPath: string;
}

// loadConfig handles logic for preparing configuration including normalizing them..
export function loadConfig(): Config {
  const baseDir = path.resolve(process.cwd());
  return {
    baseDir,
    outputDir: path.join(baseDir, "dist"),
    isProd: process.env.NODE_ENV === "production",
    publicPath: "/",
  };
}
