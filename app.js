const express = require('express');
var path = require('path');
var logger = require('morgan');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const cookieParser = require('cookie-parser');
const request = require('request')
const methodOverride = require("method-override");

var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var routes = require('./routes/index');
var users = require('./routes/users');

const app = express();
app.use(methodOverride("_method"));
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
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));app.use('/', routes);
app.use('/', routes);

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect(url);

// Generate Apache Common Log format
// app.use(morgan('common'));


app.get('/', function (req, res) {
	res.redirect('/home')
});

app.get('/home', function (req, res) {
  // console.log('success');

    db.collection("announcement").find().toArray(function(err, data) {
      if (err) console.log(err);
      res.render('index',{announcement:data});
  })
  
})



app.get('/detail/:id?', function(req,res){
	var itemID = req.params.id
	getPlaceDetail(itemID)
	.then(result =>{
		var name = result.vicinity
		var address = result.formatted_address
		var postal = result.address_components[7].long_name
    var website = result.website

    var photo
    if (typeof result.photos !== 'undefined' && result.photos) {
      photo = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=" + result.photos[0].photo_reference+"&key=AIzaSyBIoXZqb6UZnfYX9_KalDVjxFnjS8VeSRQ"
    }
    else { photo = "/blackball.jpg"}

    db.collection('REVIEWS').find({
      $and:[
        {"reviews":{$exists:true, $ne:""}},
        {"placeid":req.params.id}
        ]}).toArray((err, data) => {
      if (err) return console.log(err)
      var rate = [0,0,0,0,0]
      var method = ''
      for (var i = 0; i < data.length; i++ ){
        if (data[i].rate == "1") rate[0]++
        if (data[i].rate == "2") rate[1]++
        if (data[i].rate == "3") rate[2]++
        if (data[i].rate == "4") rate[3]++
        if (data[i].rate == "4") rate[4]++
        if (data[i].userID == req.cookies.userid) method= req.cookies.userid+'/?_method=PUT'
      }
      if (method == '') method = 'comment'

      var sum = rate.reduce((a, b) => a + b, 0);
      var avg = (rate[0]+rate[1]*2+rate[2]*3+rate[3]*4+rate[4]*5)/sum
      var bar = [(rate[0]/sum)*100,(rate[1]/sum)*100,(rate[2]/sum)*100,(rate[3]/sum)*100,(rate[4]/sum)*100]

      res.render("third_view",{photo:photo,placeid:itemID,name:name, address:address, postal:postal,website:website,REVIEWS:data,rate:rate,avg:avg,bar:bar,method:method})
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
  console.log(req.body)
  console.log(req.body.rate)
	db.collection("REVIEWS").insertOne({ userID: req.cookies.userid, reviews: req.body.reviews,rate:req.body.rate, placeid:req.params.id}, function(err, result){
					//continue
					if (err) return console.log(err)
					console.log("Database inserted");
					res.redirect('/detail/'+req.params.id);
				});
});



app.delete('/detail/:placeid/:userid',(req,res) =>{
  console.log(req.params.placeid)
  console.log(req.params.userid)
  db.collection("REVIEWS").remove(
  {userID:req.params.userid,placeid:req.params.placeid}
    )
  res.redirect('/detail/'+req.params.placeid)
});



app.put('/detail/:placeid/:userid',(req,res) =>{
  console.log("updat"+req.params.placeid)
  console.log(req.params.userid)
  db.collection("REVIEWS").update(
  {$and:[{userID:req.params.userid,placeid:req.params.placeid}]},
  { userID:req.params.userid,
    placeid:req.params.placeid,
    rate: req.body.rate,
    reviews: req.body.reviews
  },
  {upsert: true}
  )
  res.redirect('/detail/'+req.params.placeid)
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
        console.log(fullData)
        if (fullData.results) {
          //console.log(fullData.results[0].geometry.location)
        }
        resolve(fullData.results[0].geometry.location);
      }

    });

  })
}




