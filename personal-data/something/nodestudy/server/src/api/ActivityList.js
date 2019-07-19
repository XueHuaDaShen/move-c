const list = [
  {
    id: 1,
    name: '活动1',
    img: '',
    content: '测试1',
    message: '充值送礼1'
  },
  {
    id: 2,
    name: '活动2',
    img: '',
    content: '测试2',
    message: '充值送礼2'
  },
  {
    id: 3,
    name: '活动3',
    img: '',
    content: '测试3',
    message: '充值送礼3'
  },
]
class ActivityList {
  constructor() {
    this.name = '/api/activityList';
  }
  getData(res) {
		res.json(list)
  }
}
module.exports = new ActivityList()