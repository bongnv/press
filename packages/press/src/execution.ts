import type { Hook } from "tapable";
import { AsyncParallelHook, AsyncSeriesHook } from "tapable";
import WebpackConfig from "webpack-chain";

import type { Config } from "./load-config";
import { Core } from "./plugin-core";

interface Plugin {
  // TODO: we may support async apply
  apply(execution: Execution): void;
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
  config: Config;
  commands: ExecutionCommands;
  hooks: ExecutionHooks;

  clientWebpackConfig: WebpackConfig;
  serverWebpackConfig: WebpackConfig;

  constructor(config: Config) {
    this.config = config;

    // setup hooks
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

    this.clientWebpackConfig = new WebpackConfig();
    this.serverWebpackConfig = new WebpackConfig();
  }

  async execBuild(): Promise<void> {
    this._applyPlugins();
    await this.commands.build.promise(this);
    await this.hooks.prepare.promise(this);
    await this.hooks.configWebpack.promise(this);
    await this.hooks.bundle.promise(this);
    await this.hooks.generate.promise(this);
  }

  private _applyPlugins(plugins: Plugin[] = []) {
    plugins.unshift(new Core());
    for (const plugin of plugins) {
      plugin.apply(this);
    }
  }
}
