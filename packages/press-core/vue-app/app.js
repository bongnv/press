import Vue from "vue";
import Meta from "vue-meta";

import App from "./App.vue";
import createRouter from "./router";

Vue.use(Meta);

export const createApp = () => {
  const router = createRouter();

  const app = new Vue({
    router,
    render: (h) => h(App),
  });

  return { app, router };
};
