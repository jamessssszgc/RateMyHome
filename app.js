const express = require('express');
var path = require('path');
var logger = require('morgan');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const cookieParser = require('cookie-parser');
const request = require('request')
const methodOverride = require("method-override");

//database
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var routes = require('./routes/index');
var users = require('./routes/users');

const app = express();
app.use(methodOverride("_method"));
const url = "mongodb://manager:123@ds123896.mlab.com:23896/melonskin"
var db
MongoClient.connect(url, function(err, res) {
    if (err) console.log(err)
    console.log("Database created");
    db = res
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('views', __dirname + "/views")
app.use(express.static('public'));
const PORT = process.env.PORT || 3000;
app.set("view engine", "ejs");




app.use(cookieParser("my very well kept secret"))

function myLogger(req, res, next) {
    console.log("Raw Cookies: ", req.headers.cookie)
    console.log("Cookie Parser: ", req.cookies)
    if (req.body) {
        console.log('LOG:', req.method, req.url, req.body)
    }
    next()
}

var sessions = {
    "uniqueSessionID001": {
        name: "username",
        password: "pwd",
        cart: "$100"
    }
}


app.use(myLogger)
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
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


app.get('/', function(req, res) {
    res.redirect('/home')
});


//home page
app.get('/home', function(req, res) {
    db.collection("announcement").find().sort({
        "date": -1
    }).limit(1).toArray(function(err, data) {
        if (err) console.log(err);
        //console.log(data.date)
        if (data.length){
        	res.render('index', {
            date: data[0].date,
            message:data[0].message
        });
        }
        
    })


    db.collection("announcement").find().nextObject(function(err, data) {   
      if (data != undefined && data != null) {
          db.collection("announcement").find().sort({
            "date": -1
        }).limit(1).toArray(function(err, data) {
            if (err) {
              console.log(err);
            }
            
            res.render('index', {
            date: data[0].date,
            message:data[0].message
        });
        })
      } else {
          res.render('index',{date:"", message:""})
      }
    });

})


//admin get the latest message
app.get('/api/messages', function(req, res) {
    db.collection("announcement").find().nextObject(function(err, data) {   
      if (data != undefined && data != null) {
          db.collection("announcement").find().sort({
            "date": -1
        }).limit(1).toArray(function(err, data) {
            if (err) {
              console.log(err);
            }
            console.log(data[0].date)
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                date: data[0].date,
                message: data[0].message
            }))
        })
      } else {
          res.status(200).send("No announcement!");
      }
    });
})

//admin post a new message
app.post('/api/messages', function(req, res) {
    console.log(req.body.message)
    db.collection("announcement").insertOne({
        date: new Date(),
        message: req.body.message
    }, function(err, result) {
        if (err) return console.log(err)
        res.send("You successfully posted a new message to all users")
    })
})


//admin delete a message by message id
app.delete('/api/messages/:mid', function(req, res) {
    db.collection("announcement").remove({
        _id: ObjectId(req.params.mid)
    }, function(err, result) {
        if (err) return console.log(err)
        res.send("You successfully delete one message")
    })


})


//third page - details of a specific place
app.get('/detail/:id?', function(req, res) {
    var itemID = req.params.id
    getPlaceDetail(itemID)
        .then(result => {
            var name = result.vicinity
            var address = result.formatted_address
            var postal = result.address_components[7].long_name
            var website = result.website

            var photo
            if (typeof result.photos !== 'undefined' && result.photos) {
                photo = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=" + result.photos[0].photo_reference + "&key=AIzaSyBIoXZqb6UZnfYX9_KalDVjxFnjS8VeSRQ"
            } else {
                photo = "/blackball.jpg"
            }

            db.collection('REVIEWS').find({
                $and: [{
                        "reviews": {
                            $exists: true,
                            $ne: ""
                        }
                    },
                    {
                        "placeid": req.params.id
                    }
                ]
            }).toArray((err, data) => {
                if (err) return console.log(err)
                var rate = [0, 0, 0, 0, 0]
                var method = ''
                for (var i = 0; i < data.length; i++) {
                    if (data[i].rate == "1") rate[0]++
                    if (data[i].rate == "2") rate[1]++
                    if (data[i].rate == "3") rate[2]++
                    if (data[i].rate == "4") rate[3]++
                    if (data[i].rate == "4") rate[4]++
                    if (data[i].userID == req.cookies.userid) method = req.cookies.userid + '/?_method=PUT'
                }
                if (method == '') method = 'comment'

                var sum = rate.reduce((a, b) => a + b, 0);
                var avg = (rate[0] + rate[1] * 2 + rate[2] * 3 + rate[3] * 4 + rate[4] * 5) / sum
                var bar = [0,0,0,0,0]
                bar = [(rate[0] / sum) * 100, (rate[1] / sum) * 100, (rate[2] / sum) * 100, (rate[3] / sum) * 100, (rate[4] / sum) * 100]
                setTimeout(function() {
                	console.log(rate)
                    res.render("third_view", {
                        photo: photo,
                        placeid: itemID,
                        name: name,
                        address: address,
                        postal: postal,
                        website: website,
                        REVIEWS: data,
                        rate: rate,
                        avg: avg,
                        bar: bar,
                        method: method
                    })
                }, 2000)

            })

        })
})


//search result
app.get('/search', function(req, res) {
    res.render("second_view")
})


//search post
app.post('/search', function(req, res) {
    console.log(req.body.place)
    getLatLng(req.body.place)
        .then(result => {
            res.cookie('lat', result.lat)
            res.cookie('lng', result.lng)
            res.redirect('/search')
        })

})


//insert comment on a specific place
app.post('/detail/:id/comment', (req, res) => {
    console.log(req.body)
    console.log(req.body.rate)
    db.collection("REVIEWS").insertOne({
        userID: req.cookies.userid,
        reviews: req.body.reviews,
        rate: req.body.rate,
        placeid: req.params.id
    }, function(err, result) {
        if (err) return console.log(err)
        console.log("Database inserted");
    	//wait for database
        setTimeout(function() {
            res.redirect('/detail/' + req.params.id);
        }, 500)

    });
});


//delete comment that this user posted
app.delete('/detail/:placeid/:userid', (req, res) => {
    console.log(req.params.placeid)
    console.log(req.params.userid)
    db.collection("REVIEWS").remove({
        userID: req.params.userid,
        placeid: req.params.placeid
    }, function(err, result) {
        setTimeout(function() {
            res.redirect('/detail/' + req.params.placeid)
        }, 500)
    })


});


//update comment that this user posted
app.put('/detail/:placeid/:userid', (req, res) => {
    db.collection("REVIEWS").update({
        $and: [{
            userID: req.params.userid,
            placeid: req.params.placeid
        }]
    }, {
        userID: req.params.userid,
        placeid: req.params.placeid,
        rate: req.body.rate,
        reviews: req.body.reviews
    }, {
        upsert: true
    })
    setTimeout(function() {
        res.redirect('/detail/' + req.params.placeid)
    }, 500)

});



app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});




//google map api
function getPlaceDetail(itemID) {

    return new Promise((resolve, reject) => {

        var query = "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + itemID + "&key=AIzaSyBIoXZqb6UZnfYX9_KalDVjxFnjS8VeSRQ"
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

        var query = "https://maps.googleapis.com/maps/api/geocode/json?address=" + item + "&key=AIzaSyBIoXZqb6UZnfYX9_KalDVjxFnjS8VeSRQ"
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