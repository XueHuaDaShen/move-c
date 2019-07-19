var connection = require(`${global.projectSrc}/db/db`);
var getData = function(res, data) {
  let keys = Object.keys(data);
  // console.log('------------------------------------------------------------------------------------------------------------------------')
  // console.log(data)
  // console.log('------------------------------------------------------------------------------------------------------------------------')
  // return
  let fill = [];
  for(let i in keys){
    fill.push('?')
  }
  let values = keys.map(key => data[key]);
  var sql = `INSERT INTO music_img_file_list(id,${keys.join(',')}) VALUES(0,${fill.join(',')})`;
  connection().query(sql, values, (err, result) => {
    if(err){
      console.log('[Create ERROR] - ',err.message);
      res.json(err);
      return;
    }
    res.json({
      returncode: 200,
      data: result
    });
  })
}
var connectDB = function(res, data) {
  connection().connect(err => {
    if(err){
      console.log('connect err--------------', err.message)
      return
    }
    getData(res, data)
  });
}

class Create {
  constructor() {
    this.name = '/api/music_img_file_list/create';
  }
  getData(res, data) {
    connectDB(res, data)
  }
}
module.exports = new Create();