import Vue from "vue";
import Router from "vue-router";

import enhancers from "./enhancers-loader";

Vue.use(Router);

export default () => {
  const routes = [];
  enhancers.forEach((enhancer) => {
    if (enhancer.enhanceRoutes) {
      enhancer.enhanceRoutes(routes);
    }
  });

  const router = new Router({
    mode: "history",
    routes,
  });

  enhancers.forEach((enhancer) => {
    if (enhancer.enhanceRouter) {
      enhancer.enhanceRouter(router);
    }
  })

  return router;
}
