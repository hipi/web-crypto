<template>
  <div id="app">
    <h1 class="logo"></h1>
    <p class="slogan">免费的文件加密/解密</p>
    <div class="lead">
      已经完成对<span>{{ count }}</span
      >个文件的加密/解密
    </div>
    <Crypto />
    <div class="dec">
      <p>快速、安全、无服务器，从不上传文件到服务器。</p>
      <p>
        浏览器WebCryptoAPI中的AES-256-GCM算法提供加密。
      </p>
    </div>
  </div>
</template>

<script>
import Crypto from "./components/Crypto.vue";

export default {
  name: "app",
  components: {
    Crypto
  },
  data() {
    return {
      count: 0
    };
  },
  mounted() {
    fetch("https://api.chenyeah.com/v1/getcriptocount", {
      method: "post"
    })
      .then(response => response.json())
      .then(D => {
        if (D.code === 0) {
          this.count = D.count;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  font-size: 1rem;
}
.logo {
  margin: 0;
  color: #409eff;
  font-style: italic;
}
.slogan {
  font-size: 2rem;
  font-weight: 300;
  color: #409eff;
  margin: 1rem 0;
  font-weight: 800;
}
.lead {
  margin: 1.25rem 0;
  font-size: 1.25rem;
  color: #67c23a;
  span {
    color: red;
    margin: 0 10px;
    font-size: 2rem;
  }
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  max-width: 540px;
  margin: 0 auto;
  margin-bottom: 50px;
  padding: 10px;
}
.dec {
  font-size: 14px;
  background: #f8f9fa;
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
  text-align: center;
  color: rgba(0, 0, 0, 0.5);
  p {
    margin: 3px 0;
  }
}
</style>
