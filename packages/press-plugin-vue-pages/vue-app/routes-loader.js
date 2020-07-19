const path = require("path");
const glob = require("glob");

module.exports = (options) => {
  return new Promise((resolve, reject) => {
    const baseDir = options.baseDir || process.cwd();
    const options = {
      cwd: baseDir,
    };

    glob("**/*.vue", options, (err, files) => {
      if (err) {
        reject(err);
      }

      const routes = files
        .map((file) => `{path:"${getRoute(file)}", component: () => import("${file}")}`)
        .join(",");

      const code = `
      const generatedRoutes = [${routes}];

      export default {
        enhanceRoutes: (routes) => routes.push(...generatedRoutes),
      }`;

      resolve({
        cacheable: true,
        code,
      });
    });
  })
};
