const CryptoJS = require('crypto-js');


function encrypt (msg, key, iv) {
    return  CryptoJS.AES.encrypt(msg,  key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
}


function decrypt (cipherText, key, iv) {
    return  CryptoJS.AES.decrypt({ ciphertext: cipherText }, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC

    });
}


// var key =    CryptoJS.enc.Base64.parse('ZGIyMTM5NTYxYzlmZTA2OA==');
var key =    CryptoJS.enc.Base64.parse('9vvHhv4c1gY8btKbB39TqBiPAVCOmgLdh63f9R8wkVo=');
// var iv =    CryptoJS.enc.Base64.parse('ZGIyMTM5NTYxYzlmZTA2OA==');
var iv = CryptoJS.enc.Utf8.parse("1234567890123456");

var encrypted = encrypt('abcd', key, iv);
var cipherText = encrypted.ciphertext.toString();

//java 使用 34439a96e68b129093105b67de81c0fc
var byteArray = CryptoJS.enc.Hex.parse(cipherText);
var base64Str = CryptoJS.enc.Base64.stringify(byteArray);
console.log(base64Str);


