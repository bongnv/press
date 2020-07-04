import yargs from "yargs/yargs";
import press from "./press";

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
    (argv) => press(argv),
  );

  parser.command(
    "build",
    "TODO: description",
    (yargs) => {
      yargs.options({
        // TODO: options
      });
    },
    (argv) => press(argv),
  );

  parser.demandCommand(1, "You need at least one command").help();

  return parser;
}

export = cli;
