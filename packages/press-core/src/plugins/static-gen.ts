import fs from "fs-extra";
import { minify } from "html-minifier";
import path from "path";
import { createBundleRenderer } from "vue-server-renderer";

import type { Execution } from "../execution";

const PLUGIN_NAME = "StaticGen";

type Renderer = (url: string) => Promise<string>;

async function generateSite(
  execution: Execution,
  renderer: Renderer,
  url: string,
) {
  const { outputDir } = execution;
  const filePath = path.join(url, "index.html").slice(1);
  console.info("Rendering", url);
  const html = await renderer(url);
  const htmlFile = path.resolve(outputDir, filePath);
  console.info("Writing to", htmlFile);
  await fs.ensureFile(htmlFile);
  await fs.writeFile(htmlFile, html);
}

async function createRenderer(execution: Execution): Promise<Renderer> {
  const { serverPath, outputDir, htmlMinifierOptions } = execution;
  const templateFile = path.resolve(__dirname, "../../vue-app/index.html");

  const serverBundlePath = path.join(serverPath, "vue-ssr-server-bundle.json");

  const clientManifestPath = path.join(
    outputDir,
    "vue-ssr-client-manifest.json",
  );

  const template = await fs.readFile(path.resolve(templateFile), "utf-8");

  const clientManifest = await fs.readJSON(clientManifestPath);

  const renderer = createBundleRenderer(serverBundlePath, {
    template,
    clientManifest,
    runInNewContext: false,
  });

  return async (url: string) => {
    const context = {
      url,
    };
    return minify(await renderer.renderToString(context), htmlMinifierOptions);
  };
}

export default function ({ commands }: Execution): void {
  commands.build.tap(PLUGIN_NAME, ({ hooks }: Execution) => {
    hooks.generate.tapPromise(PLUGIN_NAME, async (execution: Execution) => {
      const renderer = await createRenderer(execution);
      for (const url of execution.urlsToRender) {
        await generateSite(execution, renderer, url);
      }
    });
  });
}
