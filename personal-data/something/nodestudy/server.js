var http = require("http");
http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('./dist/index.html')
}).listen(9877, '127.0.0.1', '/dist/index.html');
console.log('Server running at http://127.0.0.1:9877')