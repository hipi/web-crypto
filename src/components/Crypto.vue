<template>
  <div class="crypto">
    <div class="custom-file">
      <label>
        <input
          @change="uploadFile"
          ref="customFile"
          type="file"
          :class="[isDragOver ? 'over' : '', 'custom-file-input']"
          @dragenter="
            () => {
              isDragOver = true;
            }
          "
          @dragleave="
            () => {
              isDragOver = false;
            }
          "
          @drop="
            () => {
              isDragOver = false;
            }
          "
        />
        <div class="file-placeholder">
          <span class="file-name">{{ fileInfo }}</span>
          <span class="file-size" v-show="fileSize">{{ fileSize }}</span>
        </div>
      </label>
    </div>
    <el-input class="input-key" placeholder="输入解密所需的密码" v-model="dKey">
      <el-tooltip
        slot="append"
        effect="dark"
        content="自动生成一个安全密钥"
        placement="left"
      >
        <el-button @click="refreshKey" icon="el-icon-refresh"></el-button>
      </el-tooltip>
    </el-input>
    <div class="key-check">
      <p>密码强度：{{ percentageText }}</p>
      <el-progress
        :percentage="percentage"
        :stroke-width="20"
        :show-text="false"
        status="warning"
        stroke-linecap="square"
      ></el-progress>
    </div>
    <div class="operate">
      <el-button @click="encryptFile" type="primary" plain>加密</el-button>
      <el-button @click="decryptFile" type="success" plain>解密</el-button>
      <el-button @click="resetForm" plain v-if="resetShow" type="danger"
        >重置</el-button
      >
    </div>
    <div class="dangerInfo">
      <div>
         快速、安全、无服务器，完全本地加解密。
      </div>
      <div>
        请务必<span>保存好您的密码</span>，一旦丢失，您将无法解密您的文件。
      </div>
      <div>
        文件大小理论不限制，但文件过大，浏览器可能无法读取。
      </div>
    </div>
    <div class="result">
      <div v-for="(n, i) in resultList" :key="i">
        <resultEncryption
          v-if="n.type === 1"
          :dKey="n.dKey"
          :nameStr="n.nameStr"
          :blobStr="n.blobStr"
        />
        <resultDecryption
          v-show="n.type === 2"
          :nameStr="n.nameStr"
          :blobStr="n.blobStr"
        />
      </div>
    </div>
  </div>
</template>

<script>
import zxcvbn from "zxcvbn";
import resultEncryption from "./result-encryption";
import resultDecryption from "./result-decryption";
import { str2ab, generateKey } from "@/utils";
import { DEC } from "@/config";
export default {
  name: "Crypto",
  components: { resultEncryption, resultDecryption },
  data() {
    return {
      isDragOver: false,
      isHaveFile: false,
      file: null,
      fileInfo: "选择文件进行加密/解密",
      fileSize: null,
      dKey: "",
      percentage: 0,
      percentageText: "",
      resultList: [],
      loading: null
    };
  },
  computed: {
    resetShow() {
      return this.isHaveFile || this.dKey;
    }
  },
  methods: {
    addEnterClass() {
      this.isDragOver = true;
    },
    dragleave() {},
    uploadFile(e) {
      const file = e.target.files[0];
      if (!file) {
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
      }
    },
    keyCheckMeter(val) {
      val = val.replace(/#/g, "");
      this.dKey = val;
      let result = zxcvbn(val);
      this.percentage = result.score * 25;
      let strength = {
        0: "非常糟糕",
        1: "糟糕",
        2: "一般",
        3: "强",
        4: "非常强"
      };
      this.percentageText = strength[result.score];
    },
    refreshKey() {
      const dKey = generateKey();
      this.dKey = dKey;
    },
    resetForm() {
      this.dKey = "";
      this.$refs.customFile.value = "";
      this.file = null;
      this.fileInfo = "选择文件进行加密/解密";
      this.fileSize = "";

      this.percentageText = "";
    },
    importSecretKey(password) {
      let rawPassword = str2ab(password); // convert the password entered in the input to an array buffer
      return window.crypto.subtle.importKey(
        "raw", //raw
        rawPassword, // array buffer password
        {
          name: DEC.algoName1
        }, //the algorithm you are using
        false, //whether the derived key is extractable
        DEC.perms1 //limited to the option deriveKey
      );
    },
    async deriveEncryptionSecretKey() {
      //derive the secret key from a master key.
      let getSecretKey = await this.importSecretKey(this.dKey);
      return window.crypto.subtle.deriveKey(
        {
          name: DEC.algoName1,
          salt: DEC.salt,
          iterations: DEC.itr,
          hash: {
            name: DEC.hash
          }
        },
        getSecretKey, //your key from importKey
        {
          //the key type you want to create based on the derived bits
          name: DEC.algoName2,
          length: DEC.algoLength
        },
        false, //whether the derived key is extractable
        DEC.perms2 //limited to the options encrypt and decrypt
      );
    },
    processFinished(nameStr, data, type, dKey) {
      const blob = new Blob(data, {
        type: "application/octet-stream"
      }); // meaning download this file
      const blobStr = URL.createObjectURL(blob); //create a url for blob
      this.resultList.unshift({ nameStr, type, dKey, blobStr });
    },
    async encryptFile() {
      const that = this;
      //check if file and password inputs are entered
      if (!that.file || !that.dKey) {
        that.$message.error("请上传文件或输入密码");
      } else {
        const derivedKey = await that.deriveEncryptionSecretKey(); //requiring the key

        const fr = new FileReader(); //request a file read

        fr.onloadstart = async () => {
          // loading
          that.loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
        };

        fr.onload = async () => {
          //load
          const iv = window.crypto.getRandomValues(new Uint8Array(16)); //generate a random iv
          const content = new Uint8Array(fr.result); //encoded file content
          // encrypt the file
          await window.crypto.subtle
            .encrypt(
              {
                iv,
                name: DEC.algoName2
              },
              derivedKey,
              content
            )
            .then(function(encrypted) {
              //returns an ArrayBuffer containing the encrypted data
              that.processFinished(
                "Encrypted#" + that.dKey + "#" + that.file.name,
                [DEC.signature, iv, DEC.salt, new Uint8Array(encrypted)],
                1,
                that.dKey
              );
              //create the new file buy adding and iv and content
              //console.log("file has been successuflly encrypted");
              that.loading.close();
              that.resetForm(); // reset file and key inputs when done
              that.addCount("encrypt");
            })
            .catch(function() {
              that.$message.error("加密失败，请稍后再试！");
            });
        };

        fr.onerror = () => {
          that.$message.error("文件读取失败，可能由于文件过大");
        };
        //read the file as buffer
        fr.readAsArrayBuffer(this.file);
      }
    },
    async decryptFile() {
      const that = this;

      if (!that.file || !that.dKey) {
        that.$message.error("请上传文件或输入密码");
      } else {
        const fr = new FileReader(); //request a file read

        fr.onloadstart = () => {
          // loading
          that.loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
        };

        fr.onload = async () => {
          //load

          const deriveDecryptionSecretKey = async () => {
            //derive the secret key from a master key.

            let getSecretKey = await that.importSecretKey(that.dKey);

            return window.crypto.subtle.deriveKey(
              {
                name: DEC.algoName1,
                salt: new Uint8Array(
                  fr.result.slice(
                    DEC.signature.length + 16,
                    DEC.signature.length + 32
                  )
                ), //get salt from encrypted file.
                iterations: DEC.itr,
                hash: {
                  name: DEC.hash
                }
              },
              getSecretKey, //your key from importKey
              {
                //the key type you want to create based on the derived bits
                name: DEC.algoName2,
                length: DEC.algoLength
              },
              false, //whether the derived key is extractable
              DEC.perms2 //limited to the options encrypt and decrypt
            );
          };

          //console.log(fr.result);
          const derivedKey = await deriveDecryptionSecretKey(); //requiring the key

          const iv = new Uint8Array(
            fr.result.slice(DEC.signature.length, DEC.signature.length + 16)
          ); //take out encryption iv

          const content = new Uint8Array(
            fr.result.slice(DEC.signature.length + 32)
          ); //take out encrypted content

          await window.crypto.subtle
            .decrypt(
              {
                iv,
                name: DEC.algoName2
              },
              derivedKey,
              content
            )
            .then(function(decrypted) {
              //returns an ArrayBuffer containing the decrypted data
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
              //create new file from the decrypted content
              //console.log("file has been successuflly decrypted");
              that.loading.close();
              that.resetForm(); // reset file and key inputs when done
              that.addCount("decrypt");
            })
            .catch(function() {
              that.$message.error("您的解密密钥是错误的!");
              that.loading.close();
            });
        };

        fr.onerror = () => {
          that.$message.error("文件读取失败，可能由于文件过大");
        };

        fr.readAsArrayBuffer(that.file); //read the file as buffer
      }
    },
    addCount(type) {
      fetch("https://api.chenyeah.com/v1/addcriptocount", {
        method: "post",
        body: `type=${type}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
        .then(response => response.json())
        .then(D => {
          D.code === 0 ? (this.$parent.count = D.count) : "";
          console.log(D);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {},
  watch: {
    dKey: "keyCheckMeter"
  }
};
</script>

<style scoped lang="scss">
.custom-file {
  position: relative;
  margin-bottom: 20px;
  .custom-file-input {
    font-size: 1rem;
    position: absolute;
    z-index: 9999;
    cursor: pointer;
    height: 42px;
    opacity: 0;
    width: 100%;
    &.over + .file-placeholder {
      background: #e9ecef;
    }
  }
  .file-placeholder {
    color: #606266;
    font-size: 1rem;
    text-align: left;

    cursor: pointer;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    position: relative;
    &::after {
      content: "选择文件";
      position: absolute;
      display: block;
      top: 0;
      right: 0;
      bottom: 0;
      height: 40px;
      padding: 0 15px;
      line-height: 40px;
      color: #495057;
      background-color: #f5f7fa;
      border-left: 1px solid #dcdfe6;
      border-radius: 0 4px 4px 0;
    }
    &:hover {
      border-color: #c0c4cc;
    }
    .file-name {
      overflow: hidden;
      display: inline-block;
      width: calc(100% - 164px);
      white-space: nowrap;
      word-wrap: break-word;
      text-overflow: ellipsis;
    }
    .file-size {
      position: absolute;
      color: #28a745;
    }
  }
}
.input-key {
  ::v-deep .el-input__inner {
    font-size: 1rem;
  }
  ::v-deep .el-input__inner::-webkit-input-placeholder {
    color: #606266;
  }
  ::v-deep .el-icon-refresh {
    font-size: 1.5rem;
  }
}
.key-check {
  p {
    text-align: left;
  }
  .el-progress {
    margin-top: 10px;
    ::v-deep .el-progress-bar__innerText {
      color: #606266;
    }
  }
}
.operate {
  margin-top: 20px;
}
.dangerInfo {
  margin: 20px 0;
  color: red;
  font-size: 12px;
  div {
    margin: 4px 0;
    span {
      text-decoration: underline;
    }
  }
}
.result {
  margin-top: 40px;
}
</style>
