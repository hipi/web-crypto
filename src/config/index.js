export const DEC = {
  signature: "Encrypted By https://yuye.fun", //add a line in the file that says "Encrypted By https://yuye.fun"
  hash: "SHA-512",
  algoName1: "PBKDF2",
  algoName2: "AES-GCM",
  algoLength: 256,
  itr: 80000,
  salt: window.crypto.getRandomValues(new Uint8Array(16)),
  perms1: ["deriveKey"],
  perms2: ["encrypt", "decrypt"]
};
