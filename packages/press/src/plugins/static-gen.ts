import fs from "fs-extra";
import { minify } from "html-minifier";
import path from "path";
import { createBundleRenderer } from "vue-server-renderer";

import type { Execution } from "../execution";
import type { Config } from "../load-config";

const PLUGIN_NAME = "StaticGen";

type Renderer = (url: string) => Promise<string>;

export class StaticGen {
  templateFile: string;

  constructor() {
    this.templateFile = path.resolve(__dirname, "../../vue-app/index.html");
  }

  apply({ commands }: Execution): void {
    commands.build.tap(PLUGIN_NAME, ({ hooks }: Execution) => {
      hooks.generate.tapPromise(
        PLUGIN_NAME,
        async ({ config, urlsToRender }: Execution) => {
          const renderer = await this.createRenderer(config);
          for (const url of urlsToRender) {
            await this.generateSite(config, renderer, url);
          }
        },
      );
    });
  }

  private async generateSite(config: Config, renderer: Renderer, url: string) {
    const filePath = path.join(url, "index.html").slice(1);
    console.info("Rendering", url);
    const html = await renderer(url);
    const htmlFile = path.resolve(config.outputDir, filePath);
    console.info("Writing to", htmlFile);
    await fs.ensureFile(htmlFile);
    await fs.writeFile(htmlFile, html);
  }

  private async createRenderer(config: Config): Promise<Renderer> {
    const serverBundlePath = path.join(
      config.serverPath,
      "vue-ssr-server-bundle.json",
    );

    const clientManifestPath = path.join(
      config.outputDir,
      "vue-ssr-client-manifest.json",
    );

    const template = await fs.readFile(
      path.resolve(this.templateFile),
      "utf-8",
    );

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
      return minify(
        await renderer.renderToString(context),
        config.htmlMinifierOptions,
      );
    };
  }
}
