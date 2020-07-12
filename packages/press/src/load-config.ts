import path from "path";
import type { Options } from "html-minifier";

export interface Config {
  baseDir: string;
  outputDir: string;
  isProd: boolean;
  publicPath: string;
  temporaryPath: string;
  serverPath: string;
  htmlMinifierOptions?: Options;
}

export function defaultConfig(projectDir?: string): Config {
  const baseDir = projectDir || path.resolve(process.cwd());
  const temporaryPath = path.join(baseDir, ".press");
  const serverPath = path.join(temporaryPath, "server");

  return {
    baseDir,
    outputDir: path.join(baseDir, "dist"),
    isProd: process.env.NODE_ENV === "production",
    publicPath: "/",
    temporaryPath,
    serverPath,
  };
}

// loadConfig handles logic for preparing configuration including normalizing them..
export function loadConfig(): Config {
  return defaultConfig();
}
