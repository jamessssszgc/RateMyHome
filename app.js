var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false })
 
app.use(express.static('public'));

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/index.html" );

})

app.post('/', urlencodedParser, function (req, res) {
	var obj = {};
	console.log(req.body);
	res.send(req.body);
});

var server = app.listen(3000, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})