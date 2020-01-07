<template>
  <div class="result-list">
    <i class="el-icon-check"></i> {{ nameStr }}
    <strong>解密成功</strong>

    <div class="btn-group">
      <a
        class="el-button el-button--primary is-plain"
        style="text-decoration: none"
        :href="blobStr"
        :download="nameStr"
        ><i class="el-icon-download"></i> 已经解密的文件
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    nameStr: String,
    blobStr: String
  }
};
</script>

<style lang="scss" scoped>
.result-list {
  word-break: break-all;
  border-radius: 4px;
  margin: 10px 0;
  padding: 20px;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
  .el-icon-check {
    vertical-align: middle;
  }
  .btn-group {
    margin-top: 10px;
  }
}
</style>
