// import MD5 from 'MD5'
import Rsa from 'node-rsa'

export default function paramCryptFn (data, isCrypt) {
  // const encrypt = new JSEncrypt();
  // console.log('Rsa----',Rsa)
  // var text = encryptedString(proKey, JSON.stringify(data), RSAAPP.PKCS1Padding, RSAAPP.RawEncoding);
  // var base64Val = window.btoa(text);
  let res = {}
  if (isCrypt === false) {
    res = data
  } else {
    res = setCrypt(data)
  }
  // console.log('res-------',res)
  return res
}

function setCrypt (data) {
  var publicKey = new Rsa('-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDZVdM5g5v8aDdV2ft+N4q+ICp0\n3CyhT4RPgg35SecQd1CU9BtrBXE+N4y7dG7otL7F/1/D/8w869tlAyhJZIYTOL8T\nMrKIsm4vW4Ah60ilWyGRSskrJRLxzd+fdnUIGLL1NhwUyvyKymD+tuKVOi0nyHQI\nVSfXvDEZsfJHVzB9XQIDAQAB\n-----END PUBLIC KEY-----')
  publicKey.setOptions({encryptionScheme: 'pkcs1'})

  var encrypted = publicKey.encrypt(data, 'base64')

  return { param: encrypted }
}
