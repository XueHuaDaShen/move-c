var connection = require(`${global.projectSrc}/db/db`);
var sql = 'select * from activity';
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

class List {
  constructor() {
    this.name = '/api/activity/list';
  }
  getData(res) {
    connectDB(res)
  }
}
module.exports = new List();