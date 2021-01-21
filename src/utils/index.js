export const generateKey = (limit = 4) => {
  const usedChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let keyArray = new Uint8Array(limit); //lenght of the key
  window.crypto.getRandomValues(keyArray); //randomize
  keyArray = keyArray.map((x) => usedChars.charCodeAt(x % usedChars.length));
  return String.fromCharCode.apply(null, keyArray);
};

export const getFileSize = (nBytes) => {
  // 默认1000进制
  let base = 1000;
  if (/macintosh|mac os x/i.test(navigator.userAgent)) {
    // 苹果 文件大小1000进制
    base = 1000;
  } else if (/windows|win32/i.test(navigator.userAgent)) {
    // Win 文件大小1024进制
    base = 1024;
  }
  let fileSize = nBytes + " Bytes";
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
  let modes = 0;
  value = !value ? "" : value.toString();
  if (value.length <= 3 || (value.length <= 4 && /^[0-9]*$/.test(value))) {
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
    //如果用户输入的密码 包含了小写的a到z 大写的A到Z 下划线
    modes++;
  }
  if (/\W/.test(value)) {
    //如果是非数字、字母、下划线
    modes++;
  }
  return modes;
};

export const getDevice = () => {
  const ua = navigator.userAgent;
  return {
    isIOS: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    isAndroid: ua.indexOf("Android") > -1 || ua.indexOf("Linux") > -1,
    isIpP: 736 === window.screen.height && 414 === window.screen.width,
    getKeyBoardHeightDefault: function () {
      if (ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        const screen = window.screen;
        return 812 === screen.height && 375 === screen.width
          ? 377
          : 736 === screen.height && 414 === screen.width
          ? 315
          : 667 === screen.height && 375 === screen.width
          ? 304
          : 568 === screen.height && 320 === screen.width
          ? 220
          : 304;
      }
      return 304;
    },
  };
};
