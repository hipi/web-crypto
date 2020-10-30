<template>
  <div class="result">
    <div v-for="(n, i) in list" :key="i">
      <div class="result-list">
        <a :href="n.blobStr" :download="n.nameStr" class="file-name">
          {{ n.nameStr }}
        </a>
        <strong>{{ resultType[n.type] }}成功</strong>
        <div class="btn-group">
          <a
            class="download-link"
            target="_blank"
            :href="n.blobStr"
            :download="n.nameStr"
          >
            点击下载已经{{ resultType[n.type] }}的文件
          </a>
          <span class="decryption-key" v-if="n.type === 1">
            密钥 :
            <span> {{ n.dKey }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      resultType: {
        1: "加密",
        2: "解密",
      },
    };
  },
  props: {
    list: Array,
  },
};
</script>

<style lang="scss" scoped>
.result {
  margin-top: 20px;
}
.result-list {
  word-break: break-all;
  border-radius: 4px;
  margin: 10px 0;
  padding: 10px;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
  .file-name {
    color: #28a745;
    margin-right: 10px;
  }
  .btn-group {
    margin-top: 10px;
    .download-link {
      user-select: none;
    }
    .decryption-key {
      margin-left: 10px;
      span {
        color: #28a745;
      }
    }
  }
}
</style>
