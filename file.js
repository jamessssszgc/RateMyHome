var MongoClient = require('mongodb').MongoClient
    var url = "mongodb://manager:123@ds123896.mlab.com:23896/melonskin"
    var posts = [ {user: "one", text: "I like Javascript"}, {user: "two", text: "I love python"}, {user: "three", text: "I like Ruby"}, {user: "four", text: "I like Java"}, {user: "five", text: "I love C."}]


    MongoClient.connect(url, function(err,res){
				if(err) console.log(err)
				console.log("Database created");
				db = res
				
				// Add functions here
				var data = {userID: "Peanut", reviews: "IDK"}
				
				// CREATE COLLECTION!!!
				// db.createCollection( "reviews",
				//    {
				//       validator: { $or:
				//          [
				//             { userID: { $type: "string" } },
				//             { reviews: { $type: "string" } }
				//          ]
				//       }
				//    }
				// );

				// INSERT DATA!!!
				// db.collection("reviews").insertOne(data, function(err, res){
				// 	//continue
				// 	console.log("Database inserted");
				// });

				// var data = {user: "John", text: "I can decide!"}
				// db.collection("COLLECTION").insertOne(data, function(err, res){
				// 	//continue
				// 	console.log("Database inserted");
				// });
				
				// // db.collection("COLLECTION").find({user:"John"}).nextObject(function(err, res) {		
				// // 	console.log("HELLO:   " + res["text"]);
				// // });

				// PRINT ALL ARRAY!
				db.collection("reviews").find({userID:"Peanut"}).toArray(function(err, res) {		
					
					console.log(res);
				});

				// var myquery = {text: "I can decide!"};
				// db.collection("COLLECTION").deleteMany(myquery, function(err, obj) {
				// 	if(err) throw err;
				// 	console.log("1 document deleted");
				// });

				// db.collection("COLLECTION").find({user:"John"}).toArray(function(err, res) {		
				// 	console.log(res);
				// });























				//  Create a new collection
				// db.createCollection("GUAPI", { capped : true, size : 5242880, max : 5000 } );
				// db.collection("GUAPI").insertOne(data, function(err, res){
				// 	//continue
				// 	console.log("Database inserted");
				// });
				// db.collection("GUAPI").find({user:"John"}).nextObject(function(err, res) {		
				// 	console.log("HELLO:   " + JSON.stringify(res));
				// });









				
				
    });

