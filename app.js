var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();


var urlencodedParser = bodyParser.urlencoded({ extended: false })
 
//app.use(express.static('public'));

app.get('/', function (req, res) {
	res.redirect('/home');
});

app.get('/home', function (req, res) {
	//es.send('home page');
   	res.sendFile( __dirname + "/home.html" );
})

// Get buiding list
app.get('/list_building', function (req, res) {
	console.log("list_buiding GET request")
	res.send('buiding list page');
    //res.sendFile( __dirname + "/list.html" );
})

// Get reviews
app.get('/reviews', function (req, res) {
	console.log("reviews GET request")
	res.send('reviews page');
    //res.sendFile( __dirname + "/reviews.html" );
})


// app.post('/', urlencodedParser, function (req, res) {
// 	var obj = {};
// 	console.log(req.body);
// 	res.send(req.body);
// });

var server = app.listen(3000, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log(`Server listening on port ${port}`);
 
})