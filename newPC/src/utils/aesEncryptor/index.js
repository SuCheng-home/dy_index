// AES 加密实例 --- 用于平台公共业务加密
// import crypto from './crypto-js.js'
let crypto = window.CryptoJS
// 字符串转16进制
export function stringToHex(str) {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16).padStart(2, '0');
  }
  return hex;
}

// 16进制转字符串
export function hexToString(hex) {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    const charCode = parseInt(hex.substr(i, 2), 16);
    str += String.fromCharCode(charCode);
  }
  return str;
}

// AesEncryptor 加/解密 构造类
export class AesEncryptor {
  constructor(key, iv, mode, padding) {
    if (!key) throw Error('AesEncryptor Error: missing key')
    this.key = crypto.enc.Utf8.parse(
      hexToString(key)
    )
    this.mode = mode ? hexToString(mode) : 'ECB'
    this.padding = padding ? hexToString(padding) : 'Pkcs7'
    if (iv) {
      this.iv = crypto.enc.Utf8.parse(hexToString(iv))
    }
  }

  // 加密
  encrypt(msg) {
    if (!msg) return ''
    const srcs = crypto.enc.Utf8.parse(msg)
    const encrypted = crypto.AES.encrypt(srcs, this.key, {
      iv: this.iv,
      mode: crypto.mode[this.mode],
      padding: crypto.pad[this.padding]
    });
    return encrypted.ciphertext.toString()
  }

  // 解密
  decrypt(data) {
    if (!data) return ''
    const hexStr = crypto.enc.Hex.parse(data)
    const srcs = crypto.enc.Base64.stringify(hexStr)
    const decrypt = crypto.AES.decrypt(srcs, this.key, {
      iv: this.iv,
      mode: crypto.mode[this.mode],
      padding: crypto.pad[this.padding]
    })
    return crypto.enc.Utf8.stringify(decrypt).toString()
  }
}

// HFhtfRhkwFwSgQqk
const key = stringToHex('H') +
  stringToHex('F') +
  stringToHex('h') +
  stringToHex('t') +
  stringToHex('f') +
  stringToHex('R') +
  stringToHex('h') +
  stringToHex('k') +
  stringToHex('w') +
  stringToHex('F') +
  stringToHex('w') +
  stringToHex('S') +
  stringToHex('g') +
  stringToHex('Q') +
  stringToHex('q') +
  stringToHex('k')
// PDKBFuZfg7wEfKVs
const iv = stringToHex('P') +
  stringToHex('D') +
  stringToHex('K') +
  stringToHex('B') +
  stringToHex('F') +
  stringToHex('u') +
  stringToHex('Z') +
  stringToHex('f') +
  stringToHex('g') +
  stringToHex('7') +
  stringToHex('w') +
  stringToHex('E') +
  stringToHex('f') +
  stringToHex('K') +
  stringToHex('V') +
  stringToHex('s')
// CBC
const mode = stringToHex('C') + stringToHex('B') + stringToHex('C')
// ZeroPadding
const padding = stringToHex('Z') +
  stringToHex('e') +
  stringToHex('r') +
  stringToHex('o') +
  stringToHex('P') +
  stringToHex('a') +
  stringToHex('d') +
  stringToHex('d') +
  stringToHex('i') +
  stringToHex('n') +
  stringToHex('g')

// import AesEncryptor from '@/utils/aesEncryptor'
// AesEncryptor.encrypt(str)
// AesEncryptor.decrypt(str)

export default new AesEncryptor(key, iv, mode, padding)
