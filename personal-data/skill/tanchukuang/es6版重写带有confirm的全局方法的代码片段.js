let JZY={
    u:{
        getAllWindowConfirmInvokedGlobalVars(){
            let obj={}
            JZY.u.getAllUserDefinedGlobalVars().forEach((key)=>{
                try{
                    let str=window[key].toString()

                    if(str.replace(/\s/g,'').includes('confirm(')){
                        obj[key]=str
                    }
                }catch(e){

                }
            })
            return obj;

        },
        getAllUserDefinedGlobalVars(){

            var results, currentWindow,
                // create an iframe and append to body to load a clean window object
                iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            // get the current list of properties on window
            currentWindow = Object.getOwnPropertyNames(window);
            // filter the list against the properties that exist in the clean window
            results = currentWindow.filter(function(prop) {
                return !iframe.contentWindow.hasOwnProperty(prop);
            });
            // log an array of properties that are different
            // console.log(results);
            document.body.removeChild(iframe);
            return results

        },
    },
    s:{
        elementUIConfirm(msg,cb){

            // Vue.prototype.$confirm(msg, '提示', {
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            //     type: 'warning'
            // }).then(()=>cb()).catch(()=>{});

            alert('第一个参数弹出提示信息为：'+msg)
            alert('该方法里可以写一个自定义的弹框，点击确定后会继续执行原先的带有window.confirm的全局方法')
            alert('因这段代码是演示用，现在我直接调用cb，接下来的信息由原先的全局函数弹出')
            cb()
        },
        compiledFunctionsMap:{},//被使用的变量，勿删
        beautifyConfirmDialog(){
            let map=JZY.u.getAllWindowConfirmInvokedGlobalVars();
            for(let key in map){
                let exprArr=map[key].split('\n')

                let confirmRowMsgIndex=exprArr
                    .findIndex((item)=>(item.replace(/\s/g,'').includes('confirm(')))

                let confirmRowMsg=exprArr[confirmRowMsgIndex].replace(/\s/g,'');

                let confirmMsg=confirmRowMsg.split('confirm(')[1]
                    .replace(/\)|\(|\(/g,'')
                    .split('{')[0]

                let arrBeforeIndex=exprArr.slice(0,confirmRowMsgIndex),
                    arrAfterIndex=exprArr.slice(confirmRowMsgIndex+1,exprArr.length)

                let newExpr='window.JZY.s.compiledFunctionsMap.'+key+'='+arrBeforeIndex

                    .concat(['function myConfirm(){return true;}'])
                    .concat(['function getConfirmMsg(){return '+confirmMsg+';}'])
                    // .concat([`console.log('msg---:',getConfirmMsg(),arguments);`])
                    .concat(['if(arguments.length>20){return getConfirmMsg();}'])
                    .concat([exprArr[confirmRowMsgIndex]
                        .replace('confirm(','myConfirm(')])
                    .concat([';console.log("dbx test");'])
                    .concat(arrAfterIndex)
                    .join('\n')


                eval(newExpr)
                // eval(key+'(1,2,3,4)')
                // window[key](1,2,3,4)

                // eval(key).apply(window,[1,2,3,4]);


                // eval(key).apply(window,[1,2,3,4,5,6])

                window[key]=function(){


                    try{

                        let args=Array.from(arguments)

                        // eval('function getConfirmMsg(){return '+confirmMsg+';}')
                        // alert(eval('getConfirmMsg()'))
                        let keyFun=eval('window.JZY.s.compiledFunctionsMap.'+key)
                        // console.log('key fun to string--:',keyFun.toString())
                        let msg=keyFun.apply(window,args.concat(new Array(20)))


                        JZY.s.elementUIConfirm(msg,()=>{
                            keyFun.apply(window,args)
                        })

                    }catch(e){
                        console.warn('catch e in 执行编译函数--:',e)
                        window.alert('执行编译版函数【'+key+'】出错，请联系开发者');
                    }



                }


                // window['local'+key](1,2,3,4)

                // console.log('confirmMsg--:',confirmMsg,confirmRowMsg,confirmRowMsgIndex,newExpr,key,window[key],key===window[key])
                // window[key](1,'are you sure',3,4)
            }
        }
    }
}

function groupDelete(attId,attName){
    if(!confirm('您确定要删除【' + attId+ '------'+ attName + '】的附件配置吗？')){
        return false;
    }
    alert('原先的带有confirm的全局方法执行了,confirm中可以任意包含形参变量字符串而不仅仅是纯粹的消息字符串')
}


window.JZY=JZY;
window.groupDelete=groupDelete;
//测试
JZY.s.beautifyConfirmDialog()
groupDelete('我是message',2,3,4)
