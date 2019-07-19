(function($){

var Page = function(opt){
	var defaultData = {
		url: "",
		type: ""
	};

	this.setting = $.extend({}, defaultData, opt);
}

Page.prototype = {
	getData: null,
	getDataList: function(params){
		var that = this;
		$.ajax({
			"url": this.setting.url,
			"type": this.setting.type,
			"data": params,
            "headers": {
                "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYTNiNTcyMTBmMzY2MTFlNjg3ODA2OTAwODA3NmRhNjAiLCJhY2Nlc3NfdG9rZW4iOiI4MDQ1YzQxMmUwZTY4ODRkNWFiMTM1MzFiY2M5OWZiZDkxNjU3OTU0IiwicmVmcmVzaF90b2tlbiI6ImVlNjNiMDIwOTdkMWJjNDk0OGZiYzFjMDdiNTU0ZmNkNDkzODU3NTYiLCJpYXQiOjE1MDI2OTQ3NTIsImV4cCI6MTUwNTI4Njc1Mn0.Ley5yBT8FzDaVyBXEZgZx4ucX_Qb7V4sUdOW3tMNT8I"
            },
			"success": function(data){
				that.setting.getDataCallback(data);
			}
		})
	}
}



$.page = function(opt){
	return new Page(opt)
}
})(jQuery)