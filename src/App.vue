<template>
  <div id="app">
    <h1 class="logo">Web Crypto</h1>
    <p class="slogan">免费的加密/解密网站</p>
    <div class="lead">
      已经完成对<span>{{ count }}</span
      >个文件的加密/解密
    </div>
    <Crypto />
    <div class="dec">
      <p>
        使用浏览器中包含的WebCryptoAPI的AES-256-GCM算法提供安全的文件加密。
      </p>
      <p>这是快速，安全和无服务器，应用程序从未上传文件到服务器。</p>
      <p>该应用程序可以用少量代码在几秒钟内加密任何大小的任何类型的文件。</p>
      <p>
        要使用该应用程序，您要做的就是浏览文件，键入解密密钥或
        通过我们的安全密钥生成器生成一个。您的加密文件就可以下载了。
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
      .catch(err => console.log(err));
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
  font-size: 3.5rem;
  margin: 20px 0;
}
.slogan {
  font-size: 1.25rem;
  font-weight: 300;
  margin-bottom: 0;
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
  margin-bottom: 128px;
}
.dec {
  font-size: 12px;
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
