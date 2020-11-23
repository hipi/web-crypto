<template>
  <div class="wrapper">
    <Main></Main>
  </div>
</template>

<script>
import Main from "./components/Main.vue";
export default {
  name: "App",
  components: {
    Main,
  },
  mounted() {
    console.log(
      "%c ",
      "padding:110px 300px;background:url('https://cdn.jsdelivr.net/gh/cyea/distribute@master/gif/pkq.gif') no-repeat"
    );
    console.log("恭喜你发现了这个彩蛋！！！");
  },
};
</script>
<style lang="scss">
.container {
}
</style>
