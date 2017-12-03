var MongoClient = require('mongodb').MongoClient
var url = "mongodb://manager:123@ds123896.mlab.com:23896/melonskin"
var posts = [ {user: "one", text: "I like Javascript"}, {user: "two", text: "I love python"}, {user: "three", text: "I like Ruby"}, {user: "four", text: "I like Java"}, {user: "five", text: "I love C."}]
var userid = '';

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

var announcement='';
MongoClient.connect(url, function(err,res){
	if(err) console.log(err)
	db = res
	
	// Add functions here
	var data = {message: "Yoyo watsup", date: getDate()}
	db.collection("announcement").toArray(function(err, res) {		
		console.log(res);
	});


});

userid = getCookie("userid");
console.log(userid);
$(document).ready(function(){
  if (userid != '' && userid!=null) {
  	document.getElementById('announcement').style.visibility="visible";
  	document.getElementById('announce_content').innerHTML='hellllldskfnewkfb wekfnbksdnbkwfb kw';
  } else {
  	document.getElementById('announcement').style.display= 'none';
  }
})