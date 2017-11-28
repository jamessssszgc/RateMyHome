const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
 
app.use(express.static('public'));
const PORT = process.env.PORT || 3000;



app.get('/', function (req, res) {
   res.sendFile( __dirname + "/index.html" );

})

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