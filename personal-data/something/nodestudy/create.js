const fs = require('fs');
const path = './'
const create = function(content) {

  fs.writeFile(path + "num.txt", content, function(err) {
		if(err) {
			return console.log(err);
		}
    // console.log("The file was saved!");
  });

}
const num = {
	result: [], //最后的结果
	arr: [], // 每一次的数字
	min: 0, // 随机数字的最小值
	max: 10, // 最大值
	len: 5, // 数字的长度
	count: 5000, // 随机的次数
	addNum: function (min, max) {
		return Math.floor(Math.random()*min + Math.random()*max)
	},
	suiji: function () {
		this.arr.push(this.addNum(this.min, this.max))
		if(this.arr.length<this.len){
			return this.suiji()
		}
	},
	getNum: function (val) {
    var time = 0;
		const self = this;
    const count = val || self.count;
		var st = setInterval(()=>{
			if(time === count){
        create(self.result.join(' '))
        // create(self.result.join(''))
				console.log(self.result)
				clearInterval(st)
			}else{
				self.suiji()
				self.result.push(self.arr.join(''))
				self.arr = []
				time++
			}
			// console.log(time)
		},1)
	}
}
num.getNum(1)