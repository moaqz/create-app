export default {
  entries: ["src/index"],
  outDir: "src",
  clean: false,
  rollup: {
    esbuild: {
      minify: true,
    },
  },
};
