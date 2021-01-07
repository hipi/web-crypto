<template>
  <div class="result">
    <div v-for="(n, i) in list" :key="i">
      <div class="result-list">
        <a class="file-name">
          {{ n.nameStr }}
        </a>
        <strong>{{ resultType[n.type] }}成功</strong>
        <div class="btn-group">
          <template v-if="n.count > 0">
            <a
              class="download-link"
              target="_blank"
              :href="n.blobStr"
              :download="n.nameStr"
            >
              <span>点击下载已经{{ resultType[n.type] }}的文件</span>
            </a>
            <span class="count">
              <em>{{ n.count }}</em>
              s
            </span>
          </template>

          <span v-if="!n.count || n.count < 0" class="download-link error">
            <span>下载链接已失效</span>
          </span>

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
      list: [],
      resultType: {
        1: "加密",
        2: "解密",
      },
    };
  },
  methods: {
    addList(list) {
      const _this = this;
      const newlist = {
        ...list,
        count: 30,
        countFn: setInterval(function () {
          newlist.count--;
          if (newlist.count <= 0) {
            clearInterval(newlist.countFn);
            newlist.blobStr = "";
            _this.destoryBlobUrl(newlist.blobStr);
          }
          _this.$forceUpdate();
        }, 1000),
      };
      this.list.unshift(newlist);
    },
    destoryBlobUrl(src) {
      window.URL.revokeObjectURL(src);
    },
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
      color: #298afc;
      &.error {
        color: #f56c6c;
      }
    }
    .count {
      display: inline-block;
      margin: 0 4px;
      color: #f56c6c;
      em {
        font-style: normal;
      }
    }
    .decryption-key {
      margin-left: 10px;
      span {
        color: #f56c6c;
      }
    }
  }
}
</style>
