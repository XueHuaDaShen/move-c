	//var swiper = new Swiper('.swiper-container', {
	    //pagination: '.swiper-pagination',/*分页器容器的css选择器或HTML标签。*/
	    //paginationClickable: true,/*此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换*/
	    //autoplay:1000,/*自动播放时间设定*/
	    //autoplayDisableOnInteraction:false/* 当设置为false时,用户操作之后(swipes,arrow以及pagination 点击)autoplay不会被禁掉*/
		//});

	//var swiper = new Swiper('class选择器',{json数据的参数});

	var swiper = new Swiper('.swiper-container',{
		pagination: '.swiper-pagination' , //显示页面上的分页器
		paginationClickable:true, //可以用手指去切换
		autoplay:1000,/*自动播放时间设定*/
		autoplayDisableOnInteraction:false, //循环播放
		loop:true
	});
	

