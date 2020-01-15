//better function to convert string to array buffer
//as done in the webcrypto documentation
export const str2ab = str => {
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
  keyArray = keyArray.map(x => usedChars.charCodeAt(x % usedChars.length));
  return String.fromCharCode.apply(null, keyArray);
};
