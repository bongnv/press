import Vue from "vue";

import { createApp } from "./app";

const { app, router } = createApp();

router.onReady(() => {
  app.$mount("#app");
});
