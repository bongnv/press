import type { Execution, Plugin, PluginOptions, Plugable } from "./execution";
import corePlugin from "./plugins/core";
import devServerPlugin from "./plugins/dev-server";
import enhancersPlugin from "./plugins/enhancers";
import staticGenPlugin from "./plugins/static-gen";

type NormalizedPlugin = [Plugin, PluginOptions];

function normalizePlugin(plugin: Plugable): NormalizedPlugin {
  if (!Array.isArray(plugin)) {
    return normalizePlugin([plugin, undefined]);
  }

  if (plugin.length === 1) {
    return normalizePlugin([plugin[0], undefined]);
  }

  if (typeof plugin[0] === "string") {
    return normalizePlugin([require(plugin[0]), plugin[1]]);
  }

  return plugin as NormalizedPlugin;
}

export function applyPlugins(plugins: Plugable[], execution: Execution): void {
  plugins.unshift(
    corePlugin,
    devServerPlugin,
    enhancersPlugin,
    staticGenPlugin,
  );

  plugins
    .map((plugin: Plugable) => normalizePlugin(plugin))
    .map((plugin: NormalizedPlugin) => plugin[0](execution, plugin[1]));
}
