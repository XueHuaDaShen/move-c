const fs = require('fs');
const http = require('http');
const path = require('path');
const url = '192.168.111.207:3002/api/v1/operate/preprocess';
console.log(fs)
console.log(path)
return
var ws;
function createSocket() {
  ws = new WebSocket(url);
  ws.onopen = function(e) {
    console.log('连接成功......')
  }
  ws.onclose = function (e) {
    console.log('连接断开......');
  }
  ws.onerror = function(e) {
    console.log('传输异常......')
  }
  ws.onmessage = function(data) {
    console.log('服务器发送的数据----------', data)
  }
}
createSocket()
         
fs.createReadStream(path.join('./',"test.jpg"))
  .on("open",chunk=>{
  })
  .on("data",chunk=>{
    ws.send(chunk);  //发送数据
  })
  .on("end",()=>{
    // req.end();   //发送结束
  })
// console.log(request)