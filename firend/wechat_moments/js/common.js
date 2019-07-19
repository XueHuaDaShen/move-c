var BaseUrl="http://192.168.1.15:8080";
BaseUrl="";

//检查参数
var _work_title =localStorage.getItem("_work_title");
var _work_id =localStorage.getItem("_work_id");
var userId =localStorage.getItem("userId");
var pl_title =localStorage.getItem("pl_title");
var _id=localStorage.getItem("pl_id");


function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
function getPageName()
{
    var strUrl=location.href;
    var arrUrl=strUrl.split("/");
    var strPage=arrUrl[arrUrl.length-1];
    return strPage;
}

// 测试登录
function testLogin(){
	var username =  window.prompt("tel:","18811741368");
	do_signup_user(username);
}

// 测试登录
function testLoginOut(){
    localStorage.clear();
    alert('LoginOut ok');
} 

function goDownload(){
	location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.hsd.yixiuge";	
} 

function getSmallImageUrl(url){
	//url="http://a.app.qq.com/o/simple.jsp?pkgname=com.hsd.yixiuge.jpeg";
	var url1=url.substr(url.lastIndexOf('.'));
	var url2=url.substr(0,url.lastIndexOf('.')); 
	return url2+"_small"+url1;
}  

//调试模式
if(null!=GetQueryString("debug")){
	   $("#debug").show();
} 

//点击显示大图
function large(){
	var imgArr=[];
	var startX, moveX, endX, index = 0;

	function sFn(e){
		startX = e.touches[0].clientX;
	}
	function mFn(e){
		endX = e.touches[0].clientX;
	}
	function eFn(){
		var w = $(".box").width();
		moveX = endX - startX;
		if( moveX < -50 ){
			index++;
			index = index > imgArr.length-1 ? imgArr.length-1 : index;
			// console.log(index);
			// alert("向左滑动")
		}else if( moveX > 50 ){
			index--;
			index = index < 0 ? 0 : index;
			//console.log(index)
			// alert("向右滑动")
		}else{
			$(".box").on("click",function(){
				$(this).hide()
			})
		}
		$(".img_ol").css({
			"marginLeft": '-'+index*w+"px",
			"transition": "all .3s"
		})
	}

	$(".up_img ul").on("click", "li", function(){
		$(".box").show();
		document.body.addEventListener('touchmove', function (event) {//大图图片轮播时,禁止上下滚动
			event.preventDefault();
		}, false);
		$(".box").css({"z-index":"100000"});
		imgArr = [];
		$(this).parent().find("li").each(function(){
			var img_url=$(this).find("img").attr("src");
			var url_1=img_url.substr(img_url.lastIndexOf('.'));
			var url_2=img_url.substr(0,img_url.lastIndexOf('_small'));
			var url_3=url_2+url_1;
			imgArr.push(url_3);
		});
		create_ele(this);
	});
	function create_ele(that){
		var w = $(".box").width();
		var img = $(that).find("img").attr("src");
		var str = '<ol class="img_ol">';
		for(var i = 0; i < imgArr.length; i++){
			//console.log(w)
			str += '<li style="left:'+i*w+'px"><span><img src="'+imgArr[i]+'"></span></li>';
		}
		str += '</ol>';
		$(".box").html(str);
		ol_style(img)
	}
	function ol_style(img) {
		var w = $(".box").width();
		var h = $(".box").height();
		index = imgArr.indexOf(img);
		$(".img_ol").css({
			"marginLeft": '-' + index * w + "px",
			"transition": 'none'
		});
		$(".img_ol li").each(function () {
			var imgw = $(this).find("img").width();
			var imgh = $(this).find("img").height();
			if (imgw > imgh) {
				$(this).find("img").css({
					"width": w + "px",
					"height": "auto"
				})
			} else if (imgw < imgh) {
				$(this).find("img").css({
					"height": h + "px",
					"width": "auto"
				})
			}
		});
		$(".img_ol").get(0).addEventListener("touchstart", sFn);
		$(".img_ol").get(0).addEventListener("touchmove", mFn);
		$(".img_ol").get(0).addEventListener("touchend", eFn);
	}
}



//页面存储管理类
var PageStorge = { 
　　　	createNew: function(flag,param){   
　　　 		var ps = {};
	  		ps.getPageName = function getPageName(){
			    var a = location.href;
		        var b = a.split("/");
		        var c = b.slice(b.length-1, b.length).toString(String).split(".");
		        return c.slice(0, 1)[0];
	  		}
			ps.getQueryItem = function getQueryItem(name){
			    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			    var r = window.location.search.substr(1).match(reg);
			    if(r!=null)return  unescape(r[2]); return null;
			} 
			//init
			ps.pageName ="_";
	  
			if(flag){
				ps.pageName =  ps.getPageName();
			}else{
				ps.pageName =  ps.getQueryItem("page");
			}
			if(param){
				ps.pageName = param;
			} 
		   	//加入
		   	ps.set = function(key,value){ 
			   	if(ps.pageName && key && value){ 
				   	localStorage.setItem(ps.pageName+"_"+key,value);
				   	return true;
			   	}
			   	return false;
		   	};
	   		//是否存在
	   		ps.isset = function(key){ 
		   		var r;
		   		if(ps.pageName && key ){ 
			   		r = localStorage.getItem(ps.pageName+"_"+key);
			   		if(r){
				   		return true;  
			   		}else{
				   		return false; 
			   		}
		   		}else{
			   		return false; 
		   		} 
	   		};
		   	//获取
		   	ps.get = function(key){ 
			   	if(ps.pageName && key ){ 
				   	return localStorage.getItem(ps.pageName+"_"+key);
			   	}else{
				   	return false; 
			   	}
		   	};
	   		//删除
	   		ps.del = function(key){ 
		   		var r;
		   		if(ps.pageName && key ){ 
			   		r = localStorage.removeItem(ps.pageName+"_"+key);
			   		if(r){
				   		return true;  
			   		}else{
				   		return false; 
			   		}
		   		}else{
			   		return false; 
		   		} 
	   		};  
	   		//清除
	   		ps.clear = function(){ 
		   		var storage = window.localStorage;  
		   		for (var i=0, len = storage.length; i  <  len; i++){     
			    	var key = storage.key(i);       
			    	var value = storage.getItem(key);     
			    	//console.log(key + "=" + value); 
			    	try{
				    	if( key.indexOf(ps.pageName)>-1){
					   		localStorage.removeItem(key);
				    	}
			    	}catch(e){}
		   		}    
	   		};  
	   		//清除所有
	   		ps.clearAll = function(){ 
		   		localStorage.clear();
	   		};  
	   		return ps; 
　　　	} 
	};



function DoGet(API_URL,DATA,CALLBACK){
	$.ajax({
	    type: "GET",
	    url:  BaseUrl+API_URL,
	    data: DATA,
	    success:CALLBACK
	})
}
function DoPost(API_URL,DATA,CALLBACK){
	$.ajax({
	    type: "POST",
	    url:  BaseUrl+API_URL,
	    data: DATA,
	    success:CALLBACK
	})
}
 
/*
var ps1pub = PageStorge.createNew(true,"_");

ps1pub.set("ps1pub22",123);
ps1pub.set("ps1pub22",123);


var ps1 = PageStorge.createNew(true); 

console.log( ps1.pageName );
console.log( ps1.set("dddd",123));
console.log( ps1.set("dddd",123));
console.log( ps1.get("dddd") );

console.log( ps1.isset("ddwdd"));
//console.log( ps1.del("dddd") );
console.log( ps1.get("dddd") );


var ps2 = PageStorge.createNew(false); 
console.log( ps2.pageName );

ps2.clear(); 
*/






