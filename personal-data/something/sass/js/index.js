window.onload=function(){
    var page = document.getElementsByClassName('page')[0];
    var current = page.getElementsByClassName('current');
    for(var i=0; i<current.length; i++){
        (function(i){
            current[i].onclick=function(){
                var name = this.className;
                if( name.indexOf('active') < 0 ){
                    clearActive();
                    this.className = name + ' active'
                }
            }
        })(i)
    }
    function clearActive(){
        for(var i=0; i<current.length; i++){
            current[i].className = 'current';
        }
    }
}