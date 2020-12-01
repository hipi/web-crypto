function aaa() {
  console.log(1111111111);
}
export default {
  configureBuild: function () {
    console.log(2222);
  },
  plugins: [
    {
      rollupInputOptions: {
        pluginsOptimizer: [aaa()],
      },
    },
  ],
};
