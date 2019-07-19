 
  
	
	function do_request_auth() {  
        $.get("/component_verify_ticket.txt", function(data) {
           pre_auth_code=data; 
           Auth_URL=getParsedAuthUrl();
           alert(Auth_URL);
           goAuth();
        }); 
    }
     
    function do_signup_user(username) {
        var loginUrl= BaseUrl +"/mobile/api/signup_user";

        $.ajax({
            type: "GET",
            url: loginUrl,
            data: {
                account_type:"-1",
                mobile: username,
                valicode:"0000"
            },
            success: function (data) {
                if(data.success){ 
                    $(".sign_up").text(data.entity.showName);  
                    localStorage.setItem("showName", data.entity.showName);
                    localStorage.setItem("userId", data.entity.userId);
                    localStorage.setItem("roleId", data.entity.roleId);
                }else{
                    alert(data.message);
                    $(".sign_up").text(data.message); 
                }
            }
        });
    } 
    
    function do_login(username,passwd) {
        var loginUrl= BaseUrl +"/mobile/api/login";

        $.ajax({
            type: "GET",
            url: loginUrl,
            data: {
                account_type:"0",
                account: username,
                password:passwd
            },
            success: function (data) {
                if(data.success){
                    //alert(data.entity.showName);
                    //alert(data.entity.userId); 
                    $(".sign_up").text(data.entity.showName);  
                    localStorage.setItem("showName", data.entity.showName);
                    localStorage.setItem("userId", data.entity.userId);
                    localStorage.setItem("roleId", data.entity.roleId);
                }else{
                    alert(data.message);
                    $(".sign_up").text(data.message); 
                }
            }
        });
    }
	
	
	
 //处理回调后的登录 start 
	function GetQueryString(name)
	{
		 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		 var r = window.location.search.substr(1).match(reg);
		 if(r!=null)return  unescape(r[2]); return null;
	} 
 
	function do_get_access_key(code) {
        var loginUrl= BaseUrl +"/mobile/api/wechatPublicUserGetAccessToken?code="+code;

        $.ajax({
            type: "GET",
            url: loginUrl,
            data: {},
            success: function (data) {
                if(data.success){ 
				    if(data.entity.errcode){
						console.log(data.entity.errmsg);
						return;
					}
                    //$(".sign_up").text(data.entity.access_token);  
                    localStorage.setItem("showName", data.entity.showName);
                    localStorage.setItem("userId", data.entity.userId);
					do_wechatPublicUserLogin(data.entity.access_token,data.entity.openid,data.entity.unionid);
                }else{
                    console.log(data.message); 
                }
            }
        });
    }
	
	function do_wechatPublicUserLogin(access_token,openid,unionid) {
        var loginUrl= BaseUrl +"/mobile/api/wechatPublicUserLogin?access_token="+access_token+"&openid="+openid+"&unionid="+unionid;
		
        $.ajax({
            type: "GET",
            url: loginUrl,
            data: {},
            success: function (data) {
                if(data.success){ 
                    $(".sign_up").text(data.entity.showName);  
                    localStorage.setItem("showName", data.entity.showName);
                    localStorage.setItem("userId", data.entity.userId);
					localStorage.setItem("roleId",data.entity.roleId)
					
                }else{
                    alert(data.message);
                    $(".sign_up").text(data.message); 
                }
            }
        });
    } 
//处理回调后的登录 end 