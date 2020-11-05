<template>
  <div class="wrapper">
    <header></header>
    <Main></Main>
    <Footer></Footer>
  </div>
</template>

<script>
import Main from "./components/Main.vue";
import Footer from "./components/Footer.vue";
export default {
  name: "App",
  components: {
    Main,
    Footer,
  },
  mounted() {
    console.log(
      "%c ",
      "padding:180px 300px;background:url('https://img04.sogoucdn.com/app/a/100520146/00e63964fd987b497ee2acaa4023c28c') no-repeat"
    );
    console.log("恭喜你发现了这个彩蛋！！！");
  },
};
</script>
<style lang="scss">
.wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
header {
  height: 60px;
}
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 10px;
  width: 100%;
}
</style>
