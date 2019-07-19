const profile = {
  id: '123',
  name: 'ceshi',
  nicheng: 'ceshi',
  avatar: '头像',
}
class Personal {
  constructor() {
    this.name = '/api/personal';
  }
  getData(res) {
    res.json(profile)
		// console.log("TCL: Personal -> rander -> profile", profile);
  }
}
module.exports = new Personal()