	var MongoClient = require('mongodb').MongoClient
    var url = "mongodb://manager:123@ds123896.mlab.com:23896/melonskin"
    var posts = [ {user: "one", text: "I like Javascript"}, {user: "two", text: "I love python"}, {user: "three", text: "I like Ruby"}, {user: "four", text: "I like Java"}, {user: "five", text: "I love C."}]

    function getDate() {
    	var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if(dd<10) {
		    dd = '0'+dd
		} 

		if(mm<10) {
		    mm = '0'+mm
		} 

		today = mm + '/' + dd + '/' + yyyy;
		return today;
    }
    
	//console.log(getDate());
	//document.write(today);


    MongoClient.connect(url, function(err,res){
				if(err) console.log(err)
				console.log("Database created");
				db = res
				
				// Add functions here
				var data = {message: "Yoyo watsup", date: getDate()}
				
				//CREATE COLLECTION!!!
				// db.createCollection( "announcement",
				//    {
				//       validator: { $or:
				//          [
				//             { message: { $type: "string" } },
				//             { date: { $type: "date" } }
				//          ]
				//       }
				//    }
				// );

				// INSERT DATA!!!
				db.collection("announcement").insertOne(data, function(err, res){
					//continue
					console.log("Database inserted");
				});

				//db.collection.update({ "message": "Hey hey hey hey it's an announcement" }, { "$set": { "date": new Date() }})
				//db.collection.update({ "message": "Hey hey hey hey it's an announcement"}, { "$currentDate": { "date": { "$type": date }}})


				// var data = {user: "John", text: "I can decide!"}
				// db.collection("COLLECTION").insertOne(data, function(err, res){
				// 	//continue
				// 	console.log("Database inserted");
				// });
				
				// // db.collection("COLLECTION").find({user:"John"}).nextObject(function(err, res) {		
				// // 	console.log("HELLO:   " + res["text"]);
				// // });

				// PRINT ALL ARRAY!
				db.collection("announcement").find({userID:"Peanut"}).toArray(function(err, res) {		
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

