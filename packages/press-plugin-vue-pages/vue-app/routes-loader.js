const path = require("path");
const glob = require("glob");

function getRoute(file) {
  return "/" + file.slice(0, -4).replace(/index/i, "");
}

module.exports = (options = {}) => {
  return new Promise((resolve, reject) => {
    const baseDir = options.baseDir || process.cwd();
    const globOptions = {
      cwd: baseDir,
    };

    glob("**/*.vue", globOptions, (err, files) => {
      if (err) {
        reject(err);
      }

      const routes = files
        .map((file) => {
          const sourceFile = path.join(baseDir, file);
          const routePath = getRoute(file);
          return `{path:"${routePath}", component: () => import("${sourceFile}")}`
        })
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
