const express = require('express')
const bodyParser= require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index1.html')
  // Note: __dirname is directory that contains the JavaScript source code. Try logging it and see what you get!
  // Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.
})

app.post('/quotes', (req, res) => {
   console.log(req.body)
})

app.listen(3000, function() {
  console.log('listening on 3000')
})