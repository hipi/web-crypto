<template>
  <div class="container">
    <Logo />
    <Crypto />
    <Prompt />
  </div>
</template>

<script>
import Logo from "./Logo.vue";

import Crypto from "./Crypto.vue";
import Prompt from "./Prompt.vue";
export default {
  components: {
    Logo,
    Crypto,
    Prompt,
  },
};
</script>

<style scoped lang="scss">
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 10px;
  width: 100%;
}
</style>
