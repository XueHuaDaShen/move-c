$(function(){
	$("#totop").bind("click",function(){
		if(!$(this).hasClass("totop")){
			$("html,body").animate({scrollTop:0},500);
		}
	})
	$(".bottomfloatlist").mouseover(function(){
		$(this).siblings().find(".ewmimg").hide();
		$(this).find(".ewmimg").show();
	})
	$(".bottomfloat").mouseout(function(){
	    $(".ewmimg").hide();
	});
//	主页tab切换
//金融领域
	$("[id^=zhyllist_]").mouseover(function(){
		var count = this.id.split("zhyllist_")[1];
		$("[id^=zhyllist_]").removeClass("current");
		$(this).addClass("current");
		$("#zhyljt").css("left",(count-1)*200);
		
		$("[id^=zhylimg_]").removeClass("current");
		$("#zhylimg_"+count).addClass("current");
	})
	//互联网领域
	$("[id^=ptlist_]").mouseover(function(){
		var count = this.id.split("ptlist_")[1];
		$("[id^=ptlist_]").removeClass("current");
		$(this).addClass("current");
		$("#ptjt").css("left",(count-1)*200);
		
		$("[id^=ptimg_]").removeClass("current");
		$("#ptimg_"+count).addClass("current");
	})

	
	
//	新闻中心页
		$("[id^=xwlist_]").mouseover(function(){
		$(this).find("img").attr("src","../picture/jiantou3.png");
	})
	
	    $("[id^=xwlist_]").mouseout(function(){
		$(this).find("img").attr("src","../picture/touming.png");
	})
	
	
	$("[id^=dxlist_]").mouseover(function(){
		$(this).find("img").attr("src","../picture/jiantou3.png");
	})
	
	$("[id^=dxlist_]").mouseout(function(){
		$(this).find("img").attr("src","../picture/touming.png");
	})


//	$("[id^=taiguo]").mouseover(function () {
//	    $(this).find("img").attr("src", "picture/taiguohou.png");
//	})
//
//	$("[id^=taiguo]").mouseout(function () {
//	    $(this).find("img").attr("src", "picture/taiguo.png");
//	})
//  $("[id^=sanqingshan]").mouseover(function () {
//	    $(this).find("img").attr("src", "picture/sanqingshanhou.png");
//	})
//
//	$("[id^=sanqingshan]").mouseout(function () {
//	    $(this).find("img").attr("src", "picture/sanqingshanqian.png");
//	})
//	$("[id^=xinshadao]").mouseover(function () {
//	    $(this).find("img").attr("src", "picture/xinshadaohou.png");
//	})
//
//	$("[id^=xinshadao]").mouseout(function () {
//	    $(this).find("img").attr("src", "picture/xinshadaoqian.png");
//	})
//	$("[id^=qiaoqian]").mouseout(function () {
//	    $(this).find("img").attr("src", "picture/qiaoqianqian.png");
//	})
//	$("[id^=qiaoqian]").mouseover(function () {
//	    $(this).find("img").attr("src", "picture/qiaoqianhou.png");
//	})
//列表页侧导航
	$(".ulLeftMenu li").mouseover(function(){
		if(!$(this).find("a").hasClass('default')){
		    $(this).find("img").attr("src", "../picture/xiaosanjiao.png");
		    $(this).find("a").addClass('current');
		    
		}
	})
	
	$(".ulLeftMenu li").mouseout(function(){
		if(!$(this).find("a").hasClass('default')){
			$(this).find("img").attr("src","../picture/touming.png");
			$(this).find("a").removeClass('current');
		}
	})
	
	$("[id^=teamlist_]").mouseover(function(){
		var count = this.id.split("teamlist_")[1];
		$("[id^=teamlist_]").removeClass("current");
		$(this).addClass("current");
	})
	$(".team_div").mouseout(function(){
		$("[id^=teamlist_]").removeClass("current");
		$("#teamlist_2").addClass("current");
	})
	
	$("[id^=dh_]").mouseover(function(){
		  var count = this.id.split("dh_")[1];
		  $("[id^=xiala_]").removeClass("current");
		  $("#xiala_"+count).addClass("current");
	});
	
	$(".DivSousuo").mouseover(function(){
		  $("[id^=xiala_]").removeClass("current");
	});
	$(".owl-carousel").mouseover(function(){
		  $("[id^=xiala_]").removeClass("current");
	});
	$("#DivYuanCheng").mouseover(function(){
		  $("[id^=xiala_]").removeClass("current");
	});
	$(".bodyall").mouseover(function(){
		  $("[id^=xiala_]").removeClass("current");
	});
	$("#DivZhiHui").mouseover(function(){
		  $("[id^=xiala_]").removeClass("current");
	});
	$("#DivZiXun").mouseover(function(){
		  $("[id^=xiala_]").removeClass("current");
	});
	$("#DivFooter").mouseover(function(){
		  $("[id^=xiala_]").removeClass("current");
	});
	$("#hezuoPicDiv").mouseover(function(){
		  $("[id^=xiala_]").removeClass("current");
	});
	$("#contentDiv").mouseover(function(){
		  $("[id^=xiala_]").removeClass("current");
	});
	$("#hezuoPicDiv").mouseover(function () {
	    $("[id^=xiala_]").removeClass("current");
	});
})
function playsp(){
	$(".videoplay").fadeOut("slow");
	$("#myvideo")[0].play();
}