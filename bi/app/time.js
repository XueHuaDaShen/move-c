/**
 * Created by user on 2017/7/28.
 */
var is = true;
const completionData = (data)=>{
    if(is){
        for(var i=data.length-1; i>0; i--){
            if( (i-1)>=0 ){
                var time = new Date(data[i].key);
                var time2 = new Date(data[i-1].key);
                if( (time-time2)/1000/60/60/24 > 1 ){
                    var y = time.getFullYear(),
                        m = time.getMonth(),
                        d = time.getDate();
                    var newTime = new Date(y,m,d-1),
                        ny = newTime.getFullYear(),
                        nm = newTime.getMonth()+1,
                        nd = newTime.getDate();
                    nm = nm<10?'0'+nm:nm;
                    nd = nd<10?'0'+nd:nd;
                    var str = ny+"-"+nm+"-"+nd
                    data.splice(i,0,{"key":str,"val":0})
                    is = true;
                    break
                }else{
                    is = false;
                }
            }
        }
        return completionData(data)
    }else{
        return data;
    }
}
export default completionData;
