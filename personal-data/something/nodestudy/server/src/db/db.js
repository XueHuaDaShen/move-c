// 表名，字段
let user = {
  tableName: 'user',
  keys: [
    {key: 'id', type: 'INT NOT NULL AUTO_INCREMENT'},
    {key: 'name', type: 'VARCHAR(20)'},
    {key: 'password', type: 'VARCHAR(20)'},
    {key: 'sex', type: 'VARCHAR(1)'},
    {key: 'level', type: 'INT'}
  ]
}
let activity = {
  tableName: 'activity',
  keys: [
    {key: 'id', type: 'INT NOT NULL AUTO_INCREMENT'},
    {key: 'name', type: 'VARCHAR(20)'},
    {key: 'img', type: 'VARCHAR(65535)'},
    {key: 'message', type: 'VARCHAR(1)'}
  ]
}
/**
 * 返回一个mysql的创建表的表达式
 * @param {*} table 要创建的数据表
 */
var formatCretaeTableExpression = function(table) {
  let name = table.tableName;
  let keys = table.keys.map((item) => {return [item.key, item.type].join(' ')});
  keys.push('PRIMARY KEY(id)')
  return `create table ${name}(${keys.join(",")})`
}
// 抛出连接的数据库
module.exports = function() {
  // let expression = formatCretaeTableExpression(activity);
  // console.log(expression)
  const mysql = require("mysql");
  const db_config = require("./db_config");
  var connection = mysql.createConnection(db_config);
  return connection
}