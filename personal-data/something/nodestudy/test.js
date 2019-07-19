var fs = require('fs');
fs.stat('test.mp4', function(err, stat) {
    if(err){
        console.log(err);
    }else{
        console.log('isFile:' + stat.isFile() );
        console.log('ifDirectory:'+stat.isDirectory);
        console.log(stat)
        if(stat.isFile()){
            console.log(`size:${stat.size}`);
            console.log(`birth time: ${stat.birthtime}`)
            console.log(`modified time: ${stat.mtime}`)
        }
    }
})