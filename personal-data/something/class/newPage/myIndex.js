;var myPage;//设置一个全局变量，存放实例化的分页对象;(可以此js一下引入的js内访问，分页的关键)
//因为下面的 分页 被放在里自执行的函数里
(function(){

//调用分页js，初始化
myPage = $.page({
	"url": "http://123.56.6.6:8018/api/v1/man/abnormal/account/list",
	"type": "GET",
	"getDataCallback": myData
});

//请求接口 发送的数据
var params = {
	"size": 10,
	"page": 1
};

//调用请求数据的方法
myPage.getDataList(params);
//设置总页数、当前页  全局变量(仅本函数能访问)
var totalPageNum, page;

//请求成功后的回调相当于success
function myData(data){
	// console.log(data)
	var datalist = data.data.data;
	var pageData = data.data;
	var str = '';
	//获取当前页
	page = pageData.page;
	//存放 需要显示的页面 的数组 例如：1,2,3,4,5;  以及渲染的 页数 字符串
	var pageList = [];
	var pageStr = '';
	//获取总页数
	totalPageNum = pageData.totalPageNum;
	//渲染获取到的数据
	for(var i in datalist){
		str += '<div class="data"><span>'+datalist[i].loginname+'</span><span>'+datalist[i].pid+'</span><span>'+datalist[i].diamond+'</span></div>'
	}
	$(".content").html(str);
	//设置分页的样式
    let pageStart = Math.floor((page - 1) / 5) * 5 + 1;
    let maxPage = Math.min(pageData.totalPageNum, Math.ceil(page / 5) * 5);
    for (let i = pageStart; i <= maxPage; i++) {
        pageList.push(i);
    }
    //渲染分页 的 页数
    for(let i in pageList){
    	if(pageList[i] == page){
    		//在当前页 加选中的样式
    		style = 'on';
    	}else{
    		style = '';
    	}
    	pageStr += '<span class="'+style+'" onclick="fanye(this)">'+pageList[i]+'</span>'
    }
    $(".current").html(pageStr)
}

//当翻页的时候，改变初始 发送的数据里的 page

$(".begin").on("click",function(){
	var currentPage = 1;
	params.page = currentPage;
	myPage.getDataList(params);
})
$(".end").on("click",function(){
	var currentPage = totalPageNum;
	params.page = currentPage;
	myPage.getDataList(params);
})
$(".prev").on("click",function(){
	var currentPage = page-1;
	params.page = currentPage;
	if( currentPage < 1 ){
		return false;
	}
	myPage.getDataList(params);
})
$(".next").on("click",function(){
	var currentPage = page+1;
	params.page = currentPage;
	if( currentPage > totalPageNum ){
		return false;
	}
	myPage.getDataList(params);
})


})()