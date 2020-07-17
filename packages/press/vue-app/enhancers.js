module.exports = (options) => {
  const enhancers = options.enhancers || [];
  const importsCodes = enhancers
    .map((enhancer, index) => `import enhancer${index} from "${enhancer}";`)
    .join("\n");

  const enhancersArray = enhancers
    .map((_, index) => `enhancer${index}`)
    .join(",");

  const code = `
  ${importsCodes}
  export default [${enhancersArray}]`;

  return {
    cacheable: true,
    code,
  };
};
