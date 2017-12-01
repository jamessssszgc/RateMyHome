const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const request = require('request')

const app = express();
const url = "mongodb://manager:123@ds123896.mlab.com:23896/melonskin"
var db
MongoClient.connect(url, function(err,res){
	if(err) console.log(err)
	console.log("Database created");
	db = res
});

app.use(bodyParser.urlencoded({extended: true}));
app.set('views',__dirname+"/views")
app.use(express.static('public'));
const PORT = process.env.PORT || 3000;
app.set("view engine", "ejs");




app.use(cookieParser("my very well kept secret"))

function myLogger(req, res, next) {
   console.log("Raw Cookies: ",req.headers.cookie)
  console.log("Cookie Parser: ",req.cookies)
  //console.log("Signed Cookies: ",req.signedCookies)
  if (req.body) {
    console.log('LOG:',req.method,req.url,req.body)
  }
  // res.append('Set-Cookie', 'lastPage='+req.url);
  next()
}

var sessions = {
  "uniqueSessionID001": {name: "username", password: "pwd", cart: "$100"}
}


app.use(myLogger)

// Generate Apache Common Log format
// app.use(morgan('common'));


app.get('/', function (req, res) {
	res.redirect('/home');
});

app.get('/home', function (req, res) {
  console.log('success');
  res.render('index')


})






app.get('/detail/:id?', function(req,res){
	var itemID = req.params.id
	console.log("------"+itemID)
	getPlaceDetail(itemID)
	.then(result =>{
    console.log(result)
		var name = result.vicinity
		var address = result.formatted_address
		var postal = result.address_components[7].long_name
		var website = result.website
    var photo = result.photos[0].photo_reference
    //count the number rate = 1
   //count the number rate = 2
   //count the number rate = 3
   //count the number rate = 4
   //count the number rate = 5
    db.collection('REVIEWS').find({"reviews":{$exists:true, $ne:""}}).toArray((err, data) => {
      if (err) return console.log(err)
      // renders index.ejs
      console.log(data)
      res.render("third_view",{photo:photo,placeid:itemID,name:name, address:address, postal:postal,website:website,REVIEWS:data})
    })
		
	})
})






app.get('/search',function(req, res){
	res.render("second_view")
})



app.post('/search', function(req,res){
	console.log(req.body.place)
	getLatLng(req.body.place)
	.then(result => {
		res.cookie('lat',result.lat)
		res.cookie('lng',result.lng)
		res.redirect('/search')
	})
	
})



//insert comment 
app.post('/detail/:id/comment',(req, res) => {
	
	db.collection("REVIEWS").insertOne(req.body, function(err, result){
					//continue
					if (err) return console.log(err)
					console.log("Database inserted");
					res.redirect('/')
				});

	
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});





//google map api
function getPlaceDetail(itemID) {

  return new Promise((resolve, reject) => {

    var query = "https://maps.googleapis.com/maps/api/place/details/json?placeid="+itemID+"&key=AIzaSyBIoXZqb6UZnfYX9_KalDVjxFnjS8VeSRQ"
    request.get(query, function(error, response, body) {
      if (error) {
        reject(error);
      }
      if (response.statusCode === 200) {
      	//console.log(body)
        let fullData = JSON.parse(body);
        if (fullData.result) {
          console.log(fullData.result)
        }
        resolve(fullData.result);
      }

    });

  })
}


function getLatLng(item) {

  return new Promise((resolve, reject) => {

    var query = "https://maps.googleapis.com/maps/api/geocode/json?address="+item+"&key=AIzaSyBIoXZqb6UZnfYX9_KalDVjxFnjS8VeSRQ"
    request.get(query, function(error, response, body) {
      if (error) {
        reject(error);
      }
      if (response.statusCode === 200) {
      	
        let fullData = JSON.parse(body);
        //console.log(fullData)
        if (fullData.results) {
          console.log(fullData.results[0].geometry.location)
        }
        resolve(fullData.results[0].geometry.location);
      }

    });

  })
}




