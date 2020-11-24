<template>
  <div class="crypto">
    <Spin :spinning="loading">
      <label class="file-upload">
        <input
          @change="uploadFile"
          ref="customFile"
          type="file"
          :class="[isDragOver ? 'over' : '', 'custom-file-input']"
          @dragenter="isDragOver = true"
          @dragleave="isDragOver = false"
          @drop="isDragOver = false"
        />
        <div class="file-placeholder">
          <span class="file-name">{{ fileInfo }}</span>
          <span class="file-size" v-show="fileSize">{{ fileSize }}</span>
          <span class="file-select">选择文件</span>
        </div>
      </label>
      <div class="key">
        <input
          v-model.trim="dKey"
          type="text"
          placeholder="请输入解密密码"
          class="key-input"
          spellcheck="false"
        />
        <button title="自动生成密码" @click="refreshKey" class="key-btn">
          <img class="key-refresh" src="./../assets/refresh.svg" alt="" />
        </button>
      </div>
      <div class="key-check">
        <div>密码强度：{{ percentageText }}</div>
        <Process :percent="percentage" :strokeWidth="10" />
      </div>
      <div class="operate">
        <button @click="encryptFile" class="primary">加密</button>
        <button @click="decryptFile" class="success">解密</button>
        <button @click="resetForm" v-if="resetShow" class="danger">重置</button>
      </div>
    </Spin>
    <div class="result">
      <Result :list="resultList" />
    </div>
  </div>
</template>

<script>
import { str2ab, generateKey, checkPassWord } from "./../utils";
import { DEC } from "./../config";
import Result from "./Result.vue";
import Process from "./Process.vue";
import Spin from "./Spin.vue";
export default {
  components: { Process, Result, Spin },
  data() {
    return {
      isDragOver: false,
      isHaveFile: false,
      file: null,
      fileInfo: "点击选择或拖入文件进行加密/解密",
      fileSize: null,
      dKey: "",
      percentage: 0,
      percentageText: "",
      resultList: [],
      loading: false,
    };
  },
  computed: {
    resetShow() {
      return this.isHaveFile || this.dKey;
    },
  },
  methods: {
    addEnterClass() {
      this.isDragOver = true;
    },
    uploadFile(e) {
      const file = e.target.files[0];
      if (!file) {
        this.file = "";
        this.isHaveFile = false;
        this.fileInfo = "选择文件进行加密/解密";
        this.fileSize = "";
        return false;
      }
      this.file = file;
      this.isHaveFile = true;
      this.fileInfo = file.name;
      let nBytes = file.size;
      let fileSize = "";
      for (
        let aMultiples = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
          nMultiple = 0,
          nApprox = nBytes / 1024;
        nApprox > 1;
        nApprox /= 1024, nMultiple++
      ) {
        fileSize = nApprox.toFixed(2) + " " + aMultiples[nMultiple];
      }
      this.fileSize = fileSize || "";

      // 判断文件名是否是解密的
      let reg = /Encrypted#[^ \f\n\r\t\v#]*#/;
      if (this.fileInfo.match(reg)) {
        this.dKey = this.fileInfo
          .match(reg)[0]
          .replace("Encrypted#", "")
          .replace("#", "");
      } else {
        this.dKey = "";
      }
    },
    keyCheckMeter(val) {
      val = val.replace(/#/g, "");
      this.dKey = val;
      let strength = {
        1: "糟糕",
        2: "还行",
        3: "一般",
        4: "挺强",
        5: "很强",
      };
      if (val) {
        const score = checkPassWord(val) + 1;
        this.percentage = score * 25;
        this.percentageText = strength[score];
      } else {
        this.percentage = 0;
        this.percentageText = "";
      }
    },
    refreshKey() {
      const dKey = generateKey();
      this.dKey = dKey;
    },
    resetForm() {
      this.dKey = "";
      this.$refs.customFile.value = "";
      this.isHaveFile = false;
      this.file = null;
      this.fileInfo = "选择文件进行加密/解密";
      this.fileSize = "";
      this.percentage = 0;
      this.percentageText = "";
    },
    importSecretKey(password) {
      let rawPassword = str2ab(password);
      return window.crypto.subtle.importKey(
        "raw",
        rawPassword,
        {
          name: DEC.algoName1,
        },
        false,
        DEC.perms1
      );
    },
    async deriveEncryptionSecretKey() {
      let getSecretKey = await this.importSecretKey(this.dKey);
      return window.crypto.subtle.deriveKey(
        {
          name: DEC.algoName1,
          salt: DEC.salt,
          iterations: DEC.itr,
          hash: {
            name: DEC.hash,
          },
        },
        getSecretKey,
        {
          name: DEC.algoName2,
          length: DEC.algoLength,
        },
        false,
        DEC.perms2
      );
    },
    processFinished(nameStr, data, type, dKey) {
      const blob = new Blob(data, {
        type: "application/octet-stream",
      });
      const blobStr = URL.createObjectURL(blob);
      this.resultList.unshift({ nameStr, type, dKey, blobStr });
    },
    async encryptFile() {
      const that = this;

      if (!that.file || !that.dKey) {
        alert("请上传文件或输入密码");
      } else {
        const derivedKey = await that.deriveEncryptionSecretKey();
        const fr = new FileReader();
        fr.onloadstart = async () => {
          that.loading = true;
        };
        fr.onload = async () => {
          const iv = window.crypto.getRandomValues(new Uint8Array(16));
          const content = new Uint8Array(fr.result);
          await window.crypto.subtle
            .encrypt(
              {
                iv,
                name: DEC.algoName2,
              },
              derivedKey,
              content
            )
            .then(function (encrypted) {
              that.processFinished(
                "Encrypted#" + that.dKey + "#" + that.file.name,
                [DEC.signature, iv, DEC.salt, new Uint8Array(encrypted)],
                1,
                that.dKey
              );
              that.loading = false;
              that.resetForm();
            })
            .catch(function () {
              alert("加密失败，请稍后再试！");
            });
        };
        fr.onerror = () => {
          alert("文件读取失败，可能由于文件过大");
        };
        fr.readAsArrayBuffer(this.file);
      }
    },
    async decryptFile() {
      const that = this;
      if (!that.file || !that.dKey) {
        alert("请上传文件或输入密码");
      } else {
        const fr = new FileReader();
        fr.onloadstart = () => {
          that.loading = true;
        };

        fr.onload = async () => {
          const deriveDecryptionSecretKey = async () => {
            let getSecretKey = await that.importSecretKey(that.dKey);

            return window.crypto.subtle.deriveKey(
              {
                name: DEC.algoName1,
                salt: new Uint8Array(
                  fr.result.slice(
                    DEC.signature.length + 16,
                    DEC.signature.length + 32
                  )
                ),
                iterations: DEC.itr,
                hash: {
                  name: DEC.hash,
                },
              },
              getSecretKey,
              {
                name: DEC.algoName2,
                length: DEC.algoLength,
              },
              false,
              DEC.perms2
            );
          };

          const derivedKey = await deriveDecryptionSecretKey();

          const iv = new Uint8Array(
            fr.result.slice(DEC.signature.length, DEC.signature.length + 16)
          );
          const content = new Uint8Array(
            fr.result.slice(DEC.signature.length + 32)
          );
          await window.crypto.subtle
            .decrypt(
              {
                iv,
                name: DEC.algoName2,
              },
              derivedKey,
              content
            )
            .then(function (decrypted) {
              // 判断文件名是否是解密的
              let reg = /Encrypted#[^ \f\n\r\t\v#]*#/;
              let FILE_NAME = that.file.name;
              if (FILE_NAME.match(reg)) {
                FILE_NAME = FILE_NAME.replace(FILE_NAME.match(reg)[0], "");
              }
              that.processFinished(
                FILE_NAME,
                [new Uint8Array(decrypted)],
                2,
                that.dKey
              );
              that.loading = false;
              that.resetForm();
            })
            .catch(function () {
              alert("您的解密密钥是错误的!");
              that.loading = false;
            });
        };
        fr.onerror = () => {
          alert("文件读取失败，可能由于文件过大");
        };
        fr.readAsArrayBuffer(that.file);
      }
    },
  },
  watch: {
    dKey: "keyCheckMeter",
  },
  mounted() {},
};
</script>

<style scoped lang="scss">
.file-upload {
  position: relative;
  display: block;
  .custom-file-input {
    position: absolute;
    z-index: 9999;
    height: 100%;
    width: 100%;
    opacity: 0;
    cursor: pointer;
    &.over + .file-placeholder {
      background: #e9ecef;
      .file-select {
        background: #e9ecef;
      }
    }
  }
  .file-placeholder {
    color: #606266;
    font-size: 16px;
    cursor: pointer;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    height: 42px;
    line-height: 42px;
    display: flex;
    .file-name {
      flex: 1;
      padding: 0 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .file-size {
      padding: 0 10px;
      color: #28a745;
    }
    .file-select {
      padding: 0 10px;
      line-height: 40px;
      line-height: 40px;
      color: #495057;
      background-color: #f5f7fa;
      border-left: 1px solid #dcdfe6;
    }
  }
}
.key {
  margin-top: 20px;
  display: flex;
  .key-input {
    flex: 1;
    font-size: 16px;
    height: 42px;
    border: 1px solid #dcdfe6;
    border-radius: 2px 0 0 2px;
    &::-webkit-input-placeholder {
      color: #606266;
    }
    padding: 0 10px;
  }
  .key-btn {
    width: 85px;
    padding: 0 10px;
    color: #495057;
    height: 42px;
    background-color: #f5f7fa;
    border: 1px solid #dcdfe6;
    border-left: none;
    border-radius: 0 2px 2px 0;
    cursor: pointer;
    &:hover {
      background-color: #f4f4f4;
    }
    .key-refresh {
      width: 20px;
    }
  }
}

.key-check {
  margin-top: 20px;
}
.operate {
  margin-top: 20px;
  button {
    width: 100px;
    height: 40px;
    border-radius: 2px;
    border: 1px solid;
    outline: none;
    cursor: pointer;
    & + button {
      margin-left: 10px;
    }
    &.primary {
      color: #409eff;
      background: #ecf5ff;
      border-color: #b3d8ff;
    }
    &.success {
      color: #67c23a;
      background: #f0f9eb;
      border-color: #c2e7b0;
    }
    &.danger {
      color: #f56c6c;
      background: #fef0f0;
      border-color: #fbc4c4;
    }
  }
}
</style>
