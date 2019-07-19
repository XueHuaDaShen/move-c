var express = require('express');
var fs = require("fs");
var app = express();
var path = require('path');
// query 返回数据
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended:true,
  parameterLimit: 10000,
  limit: 1024 * 1024 * 10
}));
app.use(bodyParser.json({
  extended: false,
  parameterLimit: 10000,
  limit: 1024 * 1024 * 10
}));
// 设置全局 根路径
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
global.projectSrc = resolve('server/src').replace(/\\/g, '/');

// 启动数据库
var db = require("./src/db/db");
// 匹配接口模块
var requestModule = require('./src/fetchModule');

//设置跨域访问
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
db();
//写个接口123
app.get('*',function(req,res){
  // console.log(res)
  requestModule(req, res)
});
app.post('*', function(req, res){
  let keys = Object.keys(req.body)
  console.log('------------------------------------------------------------------------------------------------------------------------')
  console.log(keys)
  // fs.stat(req.body.musicImg, (err, stat) => {
  //   if(err){
  //     console.log(err);
  //   }else{
  //     console.log('isFile:' + stat.isFile() );
  //     console.log('ifDirectory:'+stat.isDirectory);
  //     console.log(stat)
  //     if(stat.isFile()){
  //       console.log(`size:${stat.size}`);
  //       console.log(`birth time: ${stat.birthtime}`)
  //       console.log(`modified time: ${stat.mtime}`)
  //     }
  //   }
  // })
  console.log('------------------------------------------------------------------------------------------------------------------------')
  return
  requestModule(req, res, req.body)
})
//配置服务端口
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
})