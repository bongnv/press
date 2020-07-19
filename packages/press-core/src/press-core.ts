import { Config, Execution } from "./execution";
import { applyPlugins } from "./apply-plugins";

function registerHooksExecution({ commands }: Execution): void {
  commands.build.tapPromise("HooksExecution", async (execution: Execution) => {
    const { hooks } = execution;
    await hooks.prepare.promise(execution);
    await hooks.configWebpack.promise(execution);
    await hooks.bundle.promise(execution);
    await hooks.generate.promise(execution);
  });

  commands.dev.tapPromise("HooksExecution", async (execution: Execution) => {
    const { hooks } = execution;
    await hooks.prepare.promise(execution);
    await hooks.configWebpack.promise(execution);
    await hooks.bundle.promise(execution);
  });
}

function prepareExecution(config: Config, execution: Execution): void {
  applyPlugins(config.plugins || [], execution);
  registerHooksExecution(execution);
}

export async function build(config: Config): Promise<void> {
  console.log("running build", config);
  const execution = new Execution(config);
  prepareExecution(config, execution);
  await execution.commands.build.promise(execution);
}

export async function dev(config: Config): Promise<void> {
  console.log("running dev", config);
  const execution = new Execution(config);
  prepareExecution(config, execution);
  await execution.commands.dev.promise(execution);
}

export type { Config } from "./execution";
