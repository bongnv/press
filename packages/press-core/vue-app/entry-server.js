import path from "path";

import { createApp } from "./app";

const pushURL = (router, url) => {
  return new Promise((resolve, reject) => {
    router.push(url, resolve, reject);
  });
};

export default async (context) => {
  const { app, router } = createApp();
  const route = await pushURL(router, context.url);
  if (!route.matched.length) {
    throw { code: 404 };
  }

  context.meta = app.$meta();
  return app;
};
