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

export const generateKey = (limit = 12) => {
  const usedChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let keyArray = new Uint8Array(limit); //lenght of the key
  window.crypto.getRandomValues(keyArray); //randomize
  keyArray = keyArray.map((x) => usedChars.charCodeAt(x % usedChars.length));
  return String.fromCharCode.apply(null, keyArray);
};

export const checkPassWord = (value) => {
  // 0： 表示第一个级别 1：表示第二个级别 2：表示第三个级别
  // 3： 表示第四个级别 4：表示第五个级别
  let modes = 0;
  value = !value ? "" : value.toString();
  if (!value || value.length < 6) {
    //最初级别
    return modes;
  }
  if (/\d/.test(value)) {
    //如果用户输入的密码 包含了数字
    modes++;
  }
  if (/[a-z]/.test(value)) {
    //如果用户输入的密码 包含了小写的a到z
    modes++;
  }
  if (/[A-Z]/.test(value)) {
    //如果用户输入的密码 包含了大写的A到Z
    modes++;
  }
  if (/\W/.test(value)) {
    //如果是非数字、字母、下划线
    modes++;
  }
  return modes;
};
