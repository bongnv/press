import yargs from "yargs/yargs";
import { dev, build } from "./press";

function cli(cwd?: string) {
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
    (argv) => dev(argv),
  );

  parser.command(
    "build",
    "TODO: description",
    (yargs) => {
      yargs.options({
        // TODO: options
      });
    },
    (argv) => build(argv),
  );

  parser.demandCommand(1, "You need at least one command").help();

  return parser;
}

export = cli;
