import { loadConfig } from "./load-config";
import { Execution } from "./execution";

export async function build(argv: any): Promise<void> {
  console.log("running build", argv);
  const config = loadConfig();
  const execution = new Execution(config);
  await execution.execBuild();
}

export function dev(argv: any) {
  const config = loadConfig();
  console.log("running dev", argv);
}
