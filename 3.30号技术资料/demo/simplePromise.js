function Promise(fn) {throttleFn
	const self = this;
	self.status = 'pending';
	self.data = undefined;
	self.resolveList = [];
	function resolve(value) {
		self.status = 'resolve';
		self.data = value;
		self.resolveList.forEach(item => item(self.data));
	}
	function reject(err) {
		self.status = 'reject';
		self.data = err;
	}
	fn(resolve, reject);
}
// then 方法的返回值是一个 Promise
Promise.prototype.then = function(resolveFn, rejectFn) {
	const self = this;
	resolveFn = typeof resolveFn === 'function' ? resolveFn : (a) => a;
	if (self.status === 'resolve') {
		return new Promise((resolve) => {
			const x = resolveFn(self.data);
			resolve(x);
		})
	}
	if (self.status === 'pending') {
		return new Promise((resolve) => {
			self.resolveList.push(function() {
				const x = resolveFn(self.data);
				resolve(x);
			});
		})
	}
}
