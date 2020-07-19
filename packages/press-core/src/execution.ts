import path from "path";
import type { Hook } from "tapable";
import { AsyncParallelHook, AsyncSeriesHook } from "tapable";
import WebpackConfig from "webpack-chain";
import { Options } from "html-minifier";

export type PluginOptions = undefined | Record<string, any>;
export type Plugin = (execution: Execution, options: PluginOptions) => void;
type PluginNoOptions = string | Plugin;
export type Plugable =
  | [PluginNoOptions, PluginOptions]
  | [PluginNoOptions]
  | PluginNoOptions;

export interface Config {
  baseDir?: string;
  plugins?: Plugable[];
}

interface ExecutionHooks {
  prepare: Hook;
  configWebpack: Hook;
  bundle: Hook;
  generate: Hook;
}

interface ExecutionCommands {
  dev: Hook;
  build: Hook;
}

export class Execution {
  baseDir: string;
  outputDir: string;
  isProd: boolean;
  publicPath: string;
  temporaryPath: string;
  serverPath: string;
  htmlMinifierOptions?: Options;
  enhancers: string[];

  commands: ExecutionCommands;
  hooks: ExecutionHooks;

  clientWebpackConfig: WebpackConfig;
  serverWebpackConfig: WebpackConfig;

  urlsToRender: string[];

  constructor(config: Config) {
    this.baseDir = config.baseDir || process.cwd();
    this.outputDir = path.join(this.baseDir, "dist");
    this.isProd = process.env.NODE_ENv === "production";
    this.publicPath = "/";
    this.temporaryPath = path.join(this.baseDir, ".press");
    this.serverPath = path.join(this.temporaryPath, "server");

    const params = ["execution"];

    this.commands = {
      dev: new AsyncSeriesHook(params),
      build: new AsyncSeriesHook(params),
    };

    this.hooks = {
      prepare: new AsyncParallelHook(params),
      configWebpack: new AsyncSeriesHook(params),
      bundle: new AsyncParallelHook(params),
      generate: new AsyncParallelHook(params),
    };

    this.enhancers = [];
    this.clientWebpackConfig = new WebpackConfig();
    this.serverWebpackConfig = new WebpackConfig();
    this.urlsToRender = [];
  }
}
