
const activityList = require('./api/activity/list')
const activityCreate = require('./api/activity/create')

// const ActivityList = require('./api/ActivityList')

const musicList = require('./api/music/list')
const musicCreate = require('./api/music/create')

const musicFileCreate = require('./api/music_file_list/create')

const musicImgFileCreate = require('./api/music_img_file_list/create')

const Cards = require('./api/Cards')
const Personal = require('./api/Personal')

// 接口模块集合
const moduleArr = [
  activityList, activityCreate, Cards, Personal, musicList, musicCreate, musicFileCreate, musicImgFileCreate
]

module.exports = function(req, res, data) {
  let url = req.originalUrl;
  if(url){
    let model = moduleArr.filter(item => item.name === url);
    if(!model) throw new Error(`cannot found ${url} config`);
    model[0].getData(res, data)
  }
}