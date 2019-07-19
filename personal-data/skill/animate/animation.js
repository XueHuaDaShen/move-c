function Animate( ele, endVal, duration, callback  ){
	this.ele = ele;
	this.startVal = {};  //开始值
	this.endVal = endVal;   //结束值
	this.duration = duration;  //持续时间
	this.startTime = null;
	this.easeOutExpo = function(t, b, c, d) {
        return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
    };
    this.endCallback = callback;
    
	this.startFn();
	
};


Animate.prototype = {
	
	startFn : function(){
		var that = this;
		this.startTime = +new Date();
		this.getStartStyle();
		clearInterval(this.ele.dsq)
		this.ele.dsq = setInterval(function(){
			
			if( !that.step() ){
				that.endCallback()
				clearInterval(that.ele.dsq)
			}
			
		},1000/60)
	},
	
	step : function(){
		var newDate = +new Date();
		//（当前的时间-开始的时间）*（总的路程(结束-开始)/持续时间）
		for( var item in this.endVal ){
//					var val=(newDate-this.startTime)*((this.endVal[item]-this.startVal[item])/this.duration);

			var val = this.easeOutExpo( 
    			newDate-this.startTime,
    			this.startVal[item],
    			this.endVal[item]-this.startVal[item],
    			this.duration
    		)
			
			this.setStyle (item,val );
			
			
		}
		//console.log( newDate-this.startTime>this.duration )
		
		if( newDate-this.startTime>=this.duration ){
			for( var item in this.endVal ){
				this.setStyle (item,this.endVal[item] );
			}
			return false;
		}else{
			return true;
		}
	},
	
	setStyle : function(attr,val){
		if( attr == "scrollTop" ){
			document.body.scrollTop = val;
		}else{
			this.ele.style[attr]=val+'px';
		}
		
	},
	
	getStartStyle : function(){
		for(var k in this.endVal){
			this.startVal[k]= parseFloat( this.getStyle(this.ele,k) )
		}
	},
	
	getStyle : function( ele, attr ){
		if( attr == "scrollTop" ){
			return document.body.scrollTop;
		}
		if(ele.currentStyle){
			return ele.currentStyle[attr]
		}else{
			return getComputedStyle(ele,null)[attr]
		}
		
	}
	
};



//var animate = function( ele,endStyle, duration, endCallback ){
//				this.ele = ele;
//				this.startStyle = {
//					
//				}; //开始时的值
//				this.endStyle = endStyle; //结束时的值
//				this.duration = duration; //动画持续时间
//				this.startTime = null;//开始时的时间
//				this.endCallback = endCallback;
//				this.startFn();
//			}
//			animate.prototype = {
//				//开始方法
//				startFn : function(){
//					var that = this;
//					this.startTime = +new Date();
//					this.getStartStyle();
//					
//					
//					
//					var time = setInterval(function(){
//						var newDate = +new Date();
//						
//						if( newDate - that.startTime >= that.duration ){
//							clearInterval( time );
//							
//							for( var item in that.endStyle ){
//								var val = that.startStyle[item]+that.endStyle[item];
//								that.updata( item,val )
//							}
//							return;
//						}
//						for( var item in that.endStyle ){
//							var val = that.startStyle[item]+that.step( that.endStyle[item] )
//							that.updata( item,val )
//						}
//					},1000/60)
//					
//				},
//				
//				step : function( endVal ){
//					var val = 0;
//					var newDate = +new Date();
//					
//					val = ( newDate-this.startTime ) * (endVal/this.duration)
//					
//					return val;
//				},
//				
//				updata : function( attr,val ){
//					this.ele.style[attr] = val+"px";
//					
//				},
//				
//				endFn : function(){
//					this.endCallback()
//				},
//				
//				getStartStyle : function(){
//					for( var item in this.endStyle ){
//						this.startStyle[item] = this.getStyle( this.ele,item );
//						this.endStyle[item] = this.endStyle[item] - this.startStyle[item];
//					}
//				},
//				
//				getStyle : function( ele, styleAttr ){
//					if(ele.currentStyle){
//						return parseFloat( ele.currentStyle[styleAttr] );
//					}else{
//						return  parseFloat( getComputedStyle(ele,null)[styleAttr] );
//					}
//				}
//				
//			}
//			 
//			 