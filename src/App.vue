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
