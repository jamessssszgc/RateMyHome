const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app = express();
const url = "mongodb://manager:123@ds123896.mlab.com:23896/melonskin"
app.use(bodyParser.urlencoded({extended: true}));
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
 
app.use(express.static('public'));
const PORT = process.env.PORT || 3000;

var db

MongoClient.connect(url, function(err,res){
				if(err) console.log(err)
				console.log("Database created");
				db = res
	
			});


// app.get('/', function (req, res) {
// 	res.redirect('/home');
// });

app.get('/', function (req, res) {
	//es.send('home page');
   	//res.sendFile( __dirname + "/home.html" );
   	res.sendFile( __dirname + "/index.html" );
})


// // Get buiding list
// app.get('/list_building', function (req, res) {
// 	console.log("list_buiding GET request")
// 	res.send('buiding list page');
//     //res.sendFile( __dirname + "/list.html" );
// })

// // Get reviews
// app.get('/reviews', function (req, res) {
// 	console.log("reviews GET request")
// 	res.send('reviews page');
//     //res.sendFile( __dirname + "/reviews.html" );
// })



app.post('/comment',(req, res) => {
	res.send(req.body)
	db.collection("REVIEWS").insertOne(req.body, function(err, result){
					//continue
					if (err) return console.log(err)
					console.log("Database inserted");
				
				});
	
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});




