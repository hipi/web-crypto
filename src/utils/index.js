//better function to convert string to array buffer
//as done in the webcrypto documentation
export const str2ab = (str) => {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};

export const generateKey = (limit = 4) => {
  const usedChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let keyArray = new Uint8Array(limit); //lenght of the key
  window.crypto.getRandomValues(keyArray); //randomize
  keyArray = keyArray.map((x) => usedChars.charCodeAt(x % usedChars.length));
  return String.fromCharCode.apply(null, keyArray);
};

export const getFileSize = (nBytes) => {
  // 默认1024进制
  let base = 1024;
  if (/macintosh|mac os x/i.test(navigator.userAgent)) {
    // 苹果 文件大小1000进制
    base = 1000;
  } else if (/windows|win32/i.test(navigator.userAgent)) {
    // Win 文件大小1024进制
    base = 1024;
  }
  let fileSize = 0;
  for (
    let aMultiples = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      nMultiple = 0,
      nApprox = nBytes / base;
    nApprox > 1;
    nApprox /= base, nMultiple++
  ) {
    fileSize = Math.floor(nApprox * 100) / 100 + " " + aMultiples[nMultiple];
  }
  return fileSize;
};

export const checkPassWord = (value) => {
  // 0： 表示第一个级别 1：表示第二个级别 2：表示第三个级别
  // 3： 表示第四个级别
  let modes = 0;
  value = !value ? "" : value.toString();
  if (!value || (value.length <= 4 && /^[0-9]*$/.test(value))) {
    //最初级别
    return modes;
  }
  if (/\d/.test(value)) {
    //如果用户输入的密码 包含了数字
    modes++;
  }
  if (/[A-Za-z]/.test(value)) {
    //如果用户输入的密码 包含了小写的a到z 大写的A到Z 下划线
    modes++;
  }
  if (/\W/.test(value)) {
    //如果是非数字、字母、下划线
    modes++;
  }
  return modes;
};
