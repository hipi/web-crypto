<template>
  <div class="result-list">
    <i class="el-icon-check"></i> {{ nameStr }}
    <strong>加密成功</strong>

    <div class="btn-group">
      <a
        class="el-button el-button--primary is-plain"
        style="text-decoration: none"
        :href="blobStr"
        :download="nameStr"
        ><i class="el-icon-download"></i> 已经加密的文件
      </a>

      <el-button @click="showKey" type="primary" icon="el-icon-key" plain
        >解密密钥</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    nameStr: String,
    blobStr: String,
    dKey: String
  },
  methods: {
    showKey() {
      this.$alert(this.dKey, "解密密钥", {
        showConfirmButton: false,
        center: true,
        callback: () => {}
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.result-list {
  word-break: break-all;
  margin: 10px 0;
  padding: 20px;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  .el-icon-check {
    vertical-align: middle;
  }
  .btn-group {
    margin-top: 10px;
  }
}
.el-message-box__wrapper {
  ::v-deep .el-message-box__btns {
    display: none;
  }
}
</style>
