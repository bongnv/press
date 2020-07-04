import { loadConfig } from "./loadConfig";
import bundleClient from "./bundleClient";
import generateSites from "./generateSites";
import startDevServer from "./startDevServer";

export function build(argv: any) {
  const config = loadConfig();
  bundleClient(config);
  generateSites(config);
  console.log("running build", argv);
}

export function dev(argv: any) {
  const config = loadConfig();
  bundleClient(config);
  startDevServer(config);
  console.log("running dev", argv);
}
