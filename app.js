<<<<<<< HEAD
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();


var urlencodedParser = bodyParser.urlencoded({ extended: false })
 
//app.use(express.static('public'));
=======
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
 
app.use(express.static('public'));
const PORT = process.env.PORT || 3000;


>>>>>>> 3d8a5c31ef518c27c571c12ef4202f937556f6c8

app.get('/', function (req, res) {
	res.redirect('/home');
});

app.get('/home', function (req, res) {
	//es.send('home page');
   	res.sendFile( __dirname + "/home.html" );
})

<<<<<<< HEAD
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
=======
app.post('/comment',(req, res) => {
	
	console.log(req.body);
	res.send(req.body);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});



const db = (function() {
  let database = {
    'CSC309': { 
      id: 'CSC309',
      when: new Date(),
      what: 'Programming on the Web',
      who: 'Gonzalez'
    }
  };

  return { // public interface to the DB layer

    findAll: function () {
      return database
    },
    findOne: function (i) {
      return database[i]
    },
    add: function(r) {
      database[r.id] = r
    },
    remove: function(i) {
      delete database[i]
    }
  };
})();
>>>>>>> 3d8a5c31ef518c27c571c12ef4202f937556f6c8
