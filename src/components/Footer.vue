<template>
  <footer class="footer">
    <section class="link">
      <div class="dec">
        <span class="title">友情链接:</span>
        <a target="_blank" href="//chenyeah.com"> 羽叶 </a>
        <a target="_blank" href="//dc4.cn"> 网址缩短 </a>
        <a target="_blank" href="//music.elem.fun"> 元素音乐 </a>
      </div>
    </section>
    <section class="copyright">
      <a
        href="https://wws.lanzous.com/i2pFRgvrs1i"
        target="_blank"
        rel="noopener noreferrer"
      >
        加密狗离线版本下载地址
      </a>
      <a
        href="https://support.qq.com/products/283818"
        target="_blank"
        rel="noopener noreferrer"
      >
        意见与建议
      </a>
    </section>
  </footer>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.footer {
  margin-top: auto;
  font-size: 14px;
  width: 100%;
  background-color: #f8f9fa;
  padding: 10px;
  .link {
    max-width: 600px;
    margin: 0 auto;
    width: 100%;

    a {
      text-decoration: none;
      color: #666;
      margin: 0 5px;
      &:hover {
        color: #333;
        text-decoration: underline;
      }
    }
  }
  .copyright {
    max-width: 600px;
    margin: 0 auto;
    width: 100%;

    font-size: 12px;
    line-height: 2;
    color: #999;
    a {
      margin-right: 10px;
      text-decoration: none;
      color: #999;
    }
  }
}
</style>
