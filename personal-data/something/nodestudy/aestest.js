
// let aesutil = require("../lib/aesutil");
const fs = require('fs')

let IV = "1234567890123456";
let key  = "abcdabcdabcdabcdabcdabcdabcdabcd";
// let key  = "abcdabcdabcdabcd";


const crypto = require('crypto');

/**
 * AES加密的配置
 * 1.密钥
 * 2.偏移向量
 * 3.算法模式CBC
 * 4.补全值
 */
var AES_conf = {
    jiemi: 'abcdabcdabcdabcdabcdabcdabcdabcd',
    key: '9vvHhv4c1gY8btKbB39TqBiPAVCOmgLdh63f9R8wkVo=', //密钥
    iv: '1234567890123456', //偏移向量
    padding: 'PKCS7Padding' //补全值
}

// 生成 UUID
function getGuid() {
    // xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    })
}

/**
 * AES_128_CBC 加密
 * 128位
 * return base64
 */
function encryption(value) {
    let key = new Buffer(AES_conf.key, 'base64');
    console.log('key--------', key);
    console.log('type----', typeof key)
    let iv = AES_conf.iv;
    // let padding = AES_conf.padding;

    var cipherChunks = [];
    var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    cipher.setAutoPadding(true);
    cipherChunks.push(cipher.update('abcd', 'utf8', 'base64'));
    cipherChunks.push(cipher.final('base64'));
    // return cipherChunks.join('');
    let bizDataEnc = cipherChunks.join('');
    console.log('加密后的数据---------', bizDataEnc)
}

// encryption('{"username":"admin","password":"346fa231b89e36e43c3ece86cc8a9834","random":"12345"}');


/**
 * 解密
 * return utf8
 */
function decryption(data){

    let key = AES_conf.jiemi;
    let iv = AES_conf.iv;
    // let padding = AES_conf.padding;

    var cipherChunks = [];
    var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    decipher.setAutoPadding(true);
    cipherChunks.push(decipher.update(data, 'base64', 'utf8'));
    cipherChunks.push(decipher.final('utf8'));
    return cipherChunks.join('');
}



fs.readFile('QK1.data', function (err, data) {
    if (err) throw err;
    console.log(data)

    let ret = decryption(data)
    console.log(ret);
})

