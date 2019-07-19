let rootPath = global.projectSrc;
var connection = require(`${rootPath}/db/db`);
var sql = 'select * from music_list';
var getData = function(res) {
  connection().query(sql, (err, result) => {
    if(err){
      console.log('[SELECT ERROR] - ',err.message);
      res.json(err);
      return;
    }
    res.json(result);
  })
}
var connectDB = function(res) {
  connection().connect(err => {
    if(err){
      console.log('connect err--------------', err.message)
      return
    }
    getData(res)
  });
}
var musicList = [
  {name: 'personal sing', url: `${rootPath}/data/music/cn.m4a`}
];
class List {
  constructor() {
    this.name = '/api/music/list';
  }
  getData(res) {
    // connectDB(res)
    res.json(musicList)
  }
}
module.exports = new List();