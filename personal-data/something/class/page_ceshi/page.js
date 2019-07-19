;(function($){
	var Page = function(opt){

		var _default = {
			url: "http://123.56.6.6:3030/api/v1/im/custom/list",
			token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjEiLCJ0aW1lIjoiMjAxNy0wNC0xNFQwMjoxNjowMC41MDRaIiwiaWF0IjoxNDkyMTM2MTYwLCJleHAiOjE0OTIyMjI1NjB9.3uMfS3cZ6nS9o-uY-O2LQ8eBwI3JKMB64kgwEKrdiqg',
			listNum: 0,
			totalPageNum: 1,
			total: 10,
			size: 10,
			Data_container: "#container",
			currentpage: ".pageL",
			begin: "#begin",
			end: "#end",
			next: "#next",
			prev: "#prev"
		};

		var that = this;

		this.setting = $.extend({}, _default, opt);
		this.getList(this.setting.listNum, this.setting.size);
		$(this.setting.begin).on("click", function(){
			that.begin(0, that.setting.size)
		});
		$(this.setting.end).on("click", function(){
			that.end(that.setting.totalPageNum-1, that.setting.size)
		});
		$(this.setting.next).on("click", function(){
			that.next(that.setting.listNum, that.setting.size)
		});
		$(this.setting.prev).on("click", function(){
			that.prev(that.setting.listNum, that.setting.size)
		});

	}

	Page.prototype={

		getList: function (pageNum, size){
			var that = this;
			$.ajax({
		        url: this.setting.url,
		        type: 'GET',
		        // data: {
		        //     'pageNum': pageNum,
		        //     "size": size
		        // },
		        success: function(data) {
		        	console.log(pageNum)
		        	var status = data.statusCode;
		            if ( status == 200 ) {
		                // console.log(data.data.totalPageNum);
		                var dataList = data.data.list;
		                var page = data.data.page;
		                that.setting.listNum = pageNum;
		                that.setting.totalPageNum = page.count;
						var pageStart = Math.floor((pageNum) / 5) * 5 + 1;
                        var maxPage = Math.min(page.count, Math.ceil((pageNum+1) / 5) * 5);
                        var str = '';
		                // var str = '<li class="begin"><a href="javascript:void(0);">FIRST</a></li><li class="prev"><a href="javascript:void(0);">&lt;</a></li>';
		                for( var i = pageStart; i <= maxPage; i++ ){
		                	if( i - 1 == pageNum ){
		                		cc = 'active'
		                	}else{
		                		cc = '';
		                	}
		                	str += '<li><a class="'+cc+'" href="javascript:;" data-index="'+(i-1)+'">'+i+'</a></li>';
		                }
		                // str += '<li class="next"><a href="javascript:void(0);">&gt;</a></li><li class="end"><a href="javascript:void(0);">LAST</a></li>';

		                $(that.setting.currentpage).html(str);


		                var html = '';
		                for(var i = 0; i< dataList.length; i++){
		                	html += '<div><span>'+dataList[i].id+'</span><span>'+dataList[i].type+'</span><span>'+dataList[i].username+'</span><span>'+dataList[i].enable+'</span></div>'
		                }
		                $(that.setting.Data_container).html(html);
		                that._style()
		            }
		        },
		        fail: function() {
		            console.log('Ajax Error');
		        }
		    });
		},

		begin: function (listNum, size){
			this.getList(listNum, size);
		},

		end: function (listNum, size){
			this.getList(listNum, size)
		},

		next: function (listNum, size){
			if( !(listNum*1+2 > this.setting.totalPageNum) ){
		        this.getList( listNum*1+1, size)
		    }
		},

		prev: function (listNum, size){
			if( listNum-1 > 0 ){
		        this.getList( listNum-1, size)
		    }
		},
		_style: function (){
			$("#container>div:odd").css({
				"background": '#ccc'
			})
		}
	}

	$.page = function(opt){
		new Page(opt)
	}
})(jQuery)