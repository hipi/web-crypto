import { DEC } from "./../config";

const readFile = async (file) => {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      resolve([true, fileReader.result]);
    };
    fileReader.onerror = () => {
      resolve([false, "文件读取失败，可能由于文件过大"]);
    };
    fileReader.readAsArrayBuffer(file);
  });
};

const str2ab = (str) => {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};

const importSecretKey = (password) => {
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
};

// 加密秘钥
const deriveEncryptionSecretKey = async (password) => {
  let getSecretKey = await importSecretKey(password);
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
};

// 解密秘钥
const deriveDecryptionSecretKey = async (password, fileReaderResult) => {
  let getSecretKey = await importSecretKey(password);
  return window.crypto.subtle.deriveKey(
    {
      name: DEC.algoName1,
      salt: new Uint8Array(
        fileReaderResult.slice(
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

export const encryptFile = async (file, password) => {
  const [status, fileReaderResult] = await readFile(file);
  if (!status) {
    return [false, fileReaderResult];
  }
  const derivedKey = await deriveEncryptionSecretKey(password);
  const iv = window.crypto.getRandomValues(new Uint8Array(16));
  const content = new Uint8Array(fileReaderResult);
  return await window.crypto.subtle
    .encrypt(
      {
        iv,
        name: DEC.algoName2,
      },
      derivedKey,
      content
    )
    .then(function (encrypted) {
      const data = {
        nameStr: "Encrypted#" + password + "#" + file.name,
        buffer: [DEC.signature, iv, DEC.salt, new Uint8Array(encrypted)],
        type: "encrypt",
        password,
      };
      return [true, data];
    })
    .catch(function () {
      return [false, "加密失败，请刷新页面再试！"];
    });
};

export const decryptFile = async (file, password) => {
  const [status, fileReaderResult] = await readFile(file);
  if (!status) {
    return [false, fileReaderResult];
  }
  const derivedKey = await deriveDecryptionSecretKey(
    password,
    fileReaderResult
  );
  const iv = new Uint8Array(
    fileReaderResult.slice(DEC.signature.length, DEC.signature.length + 16)
  );
  const content = new Uint8Array(
    fileReaderResult.slice(DEC.signature.length + 32)
  );

  return await window.crypto.subtle
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
      let FILE_NAME = file.name;
      if (FILE_NAME.match(reg)) {
        FILE_NAME = FILE_NAME.replace(FILE_NAME.match(reg)[0], "");
      }

      const data = {
        nameStr: FILE_NAME,
        buffer: [new Uint8Array(decrypted)],
        type: "decrypt",
        password,
      };

      return [true, data];
    })
    .catch(function () {
      return [false, "您的解密密钥是错误的!"];
    });
};
