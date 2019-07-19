;(function($){
	var Page = function(opt){

		var _default = {
			url: "http://123.56.6.6:3030/api/v1/im/custom/list",
			token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjEiLCJ0aW1lIjoiMjAxNy0wNC0xNFQwMjoxNjowMC41MDRaIiwiaWF0IjoxNDkyMTM2MTYwLCJleHAiOjE0OTIyMjI1NjB9.3uMfS3cZ6nS9o-uY-O2LQ8eBwI3JKMB64kgwEKrdiqg',
			listNum: 1,
			totalPageNum: 1,
			total: 10,
			size: 10,
			Data_container: "#container",
			currentpage: ".currentpage",
			begin: "#begin",
			end: "#end",
			next: "#next",
			prev: "#prev"
		};

		var that = this;

		this.setting = $.extend({}, _default, opt);
		this.getList(this.setting.listNum, this.setting.size);
		$(this.setting.begin).on("click", function(){
			that.begin(1, that.setting.size)
		});
		$(this.setting.end).on("click", function(){
			that.end(that.setting.totalPageNum, that.setting.size)
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
		        headers: {
		            token: this.setting.token
		        },
		        data: {
		            'pageNum': pageNum,
		            "size": size
		        },
		        success: function(data) {

		            if (data.returncode == 200) {
		                // console.log(data);
		                // console.log(data.data.totalPageNum);

		                that.setting.listNum = pageNum;
		                that.setting.totalPageNum = data.data.totalPageNum;
		                var str = '<a href="javascript:void(0);">'+pageNum+'/'+that.setting.totalPageNum+' total '+data.data.total+'</a>';
		                										//当前页	//总页数					//总数据
		                $(that.setting.currentpage).html(str);


		                var html = '';
		                for(var i = 0; i< data.data.content.length; i++){
		                	html += '<div><span>'+data.data.content[i].content+'</span><span>'+data.data.content[i].source+'</span><span>'+data.data.content[i].status+'</span><span>'+data.data.content[i].size+'</span></div>'
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
			if( !(listNum*1+1 > this.setting.totalPageNum) ){
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