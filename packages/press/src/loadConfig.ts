import path from "path";

export interface Config {
  baseDir: string;
}

export function loadConfig(): Config {
  return {
    baseDir: path.resolve(process.cwd()),
  };
}
