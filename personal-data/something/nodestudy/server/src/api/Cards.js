const cardList = [
  {
    id: 1,
    name: '中信'
  },
  {
    id: 2,
    name: '交通'
  },
  {
    id: 3,
    name: '招商'
  }
]
class Cards {
  constructor() {
    this.name = '/api/cards';
  }
  getData(res) {
    res.json(cardList)
		// console.log("TCL: Cards -> rander -> cardList", cardList);
  }
}
module.exports = new Cards()