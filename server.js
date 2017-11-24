const express = require("express");

const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const morgan = require('morgan');
const cookieParser = require('cookie-parser');


const app = express();
const PORT = process.env.PORT || 3000;


// Generate Apache Common Log format
app.use(morgan('common'));

// Support Routes
app.get('/', function (req, res) {
  // res.send ("Welcome to our Server")
  res.redirect('/home');
});
