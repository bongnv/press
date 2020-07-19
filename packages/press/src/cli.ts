import yargs from "yargs/yargs";
import { Argv } from "yargs";
import { dev, build } from "./press";
import { loadConfig } from "./load-config";

function cli(cwd?: string): Argv {
  const parser = yargs(undefined, cwd);

  parser.alias("h", "help");
  parser.alias("v", "version");

  parser.command(
    "dev",
    "TODO: description",
    (yargs) => {
      yargs.options({
        // TODO: options
      });
    },
    (argv) => dev(loadConfig(argv)),
  );

  parser.command(
    "build",
    "TODO: description",
    (yargs) => {
      yargs.options({
        // TODO: options
      });
    },
    (argv) => build(loadConfig(argv)),
  );

  parser.demandCommand(1, "You need at least one command").help();

  return parser;
}

export = cli;
