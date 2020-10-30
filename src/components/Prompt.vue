<template>
  <div class="dangerInfo">
    <ul>
      <li>
        文件是基于本地浏览器<span>AES-256-GCM</span>算法进行加密。快速、安全、离线。
      </li>
      <li>
        为防止多文件加密而混淆加密密码,所以加密密码会在下载的文件名
        <span>#</span>
        之间显示,请及时修改文件名。
      </li>
      <li>
        本网站不会存储您的密码,请务必<span>保存好您的密码</span>，一旦丢失，您将无法解密您的文件。
      </li>
      <li>
        文件大小理论不会限制，但如果文件过大，浏览器可能无法读取而无法加密。
      </li>
      <li>
        <span>
          为保证加密安全和唯一性,本网站不能和其他文件相同加密方式的网站混用。
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.dangerInfo {
  margin: 20px 0;
  padding-top: 10px;
  color: #e6a23c;
  border-top: 1px dashed #dcdfe6;
  ul {
    padding-left: 14px;
    list-style: circle;
    li {
      margin: 8px 0;
    }
    span {
      text-decoration: underline;
      font-weight: bold;
      color: #f56c6c;
    }
  }
}
</style>
