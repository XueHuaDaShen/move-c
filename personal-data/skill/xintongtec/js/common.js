$(function () {
    	
        var winWidth;

        if (window.innerWidth)
            winWidth = window.innerWidth;
        else if ((document.body) && (document.body.clientWidth))
            winWidth = document.body.clientWidth;
        if (winWidth > 1020) {
            $("#owl-demo").css("height", document.body.clientWidth / (1920 / 747));
            $(".zhylimg").css("height", document.body.clientWidth / (1920 / 668));
        }
        browserRedirect();
        
        
         //导航
        $("[id^=dh_]").mouseover(function () {
	        var count = this.id.split("dh_")[1];
	        $("[id^=xiala_]").removeClass("current");
	        $("#xiala_" + count).addClass("current");
	    });   
//	    console.log('hello');
        $("#xiala_1").css("left", $('#dh_1').offset().left + 0.1 * 1000 / 7 + 5);
        console.log('hello');
        $("#xiala_2").css("left", $('#dh_2').offset().left + 0.1 * 1000 / 7 + 5);
        $("#xiala_3").css("left", $('#dh_3').offset().left + 0.1 * 1000 / 7 + 5);
        $("#xiala_4").css("left", $('#dh_4').offset().left + 0.1 * 1000 / 7 + 5);
        $("#xiala_5").css("left", $('#dh_5').offset().left + 0.1 * 1000 / 7 + 5);

        $("[id^=xiala_]").css("width","100px");
        $(".xialabody").css("width", "100px");
        $(".xialatop").css("width", "100px");
        $("[id^=xiala_] a").css("width", "100px");
        $(window).resize(function () {
            $("#xiala_1").css("left", $('#dh_1').offset().left + 0.1 * 1000 / 7 + 5);
            $("#xiala_2").css("left", $('#dh_2').offset().left + 0.1 * 1000 / 7 + 5);
            $("#xiala_3").css("left", $('#dh_3').offset().left + 0.1 * 1000 / 7 + 5);
            $("#xiala_4").css("left", $('#dh_4').offset().left + 0.1 * 1000 / 7 + 5);
            $("#xiala_5").css("left", $('#dh_5').offset().left + 0.1 * 1000 / 7 + 5);

            //alert(document.body.clientWidth)
            //$(".owl-item").css("width", "100%");
            //$(".item img").css("width", "100%");
            //$(".demo img").css("height", $('.owl-demo').css("height"));
        })
        
     
    })
    function browserRedirect() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            $('#carousel-example-generic').css("width", "1000px")
            $("#owl-demo").css("height", 1030 / (1920 / 747));
            $("#owl-demo").css("width", "1030px");
            $(".zhylimg").css("height", 1030 / (1920 / 668));
            $(".zhylimg").css("width", "1030px");
            $('.carousel-inner').css('width','1030px');
            $('.carousel-inner img').css('width','1030px');
            $('#carousel-example-generic').css('width','1030px');
        }
    }
    
 	window.onscroll = function () {
            var t = document.documentElement.scrollTop || document.body.scrollTop;
            if (t >= 50) {
                $(".DivTop").css("top", "0px");
            } else {
                $(".DivTop").css("top", "50px");
            }
            if (t >= 415) {
                $(".daoh").css("position", "fixed");
                $(".daoh").css("top", "50px");
                $(".daoh").css("padding-right", "200px");
            }
            else {
                $(".daoh").css("position", "absolute");
                $(".daoh").css("top", "0px");
                $(".daoh").css("padding-right", "100px");
            }
        };
        


 $(function browserRedirect() {
            var sUserAgent = navigator.userAgent.toLowerCase();
            var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
            var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
            var bIsMidp = sUserAgent.match(/midp/i) == "midp";
            var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
            var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
            var bIsAndroid = sUserAgent.match(/android/i) == "android";
            var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
            var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

            if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
                $('.changtu').css("width", "1030px");
                $('.newss').css("width", "700px");
                $('.zhw').css("width", "700px");
                $('#DivFooter').css("width", "1030px");
                $('#contentDiv').css('padding-left', '120px');
            }
        })