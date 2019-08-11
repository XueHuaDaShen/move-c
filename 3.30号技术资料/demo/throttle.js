function throttle(fn, timer) {
	let time;
	return function() {
		if (time) return;

		time = setTimeout(() => {
			fn()
			time = null;
		}, timer)
	}
}
