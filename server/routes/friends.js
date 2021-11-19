var express = require('express');
var router = express.Router();

// Database options/connection
const MongoClient = require('mongodb').MongoClient;
var connstring = 'mongodb+srv://root:root@personal-interactive-ma.vyxje.mongodb.net/personal-interactive-map?retryWrites=true&w=majority'
const client = new MongoClient(connstring,{useUnifiedTopology: true});

router.post('/',function(req, res) {
  // connect to the db
  client.connect(function(err) {
    if (err) return callback(err);
    // get db variables
    const db = client.db('personal-interactive-map');   
    const collection = db.collection('friends');

    var searchEmail = req.body.email.replace(/[ ,.]/g, ""); // NOTE: email will always be the primary key
    var findUser = {"email":searchEmail};                   // filter query        
    
    // Look for the user
    collection.findOne(findUser,function(err,existingUser) {
      if (existingUser == null){                      //user does not exist in DB, insert him in with empty pins array
          console.log('new user');
          var addNewUser = {};
          addNewUser['email'] = searchEmail;
          addNewUser['friends'] = [];
          collection.insertOne(addNewUser);
          console.log("Added new user to friends");
          res.setHeader('Access-Control-Allow-Origin','*');
          res.send([]);   // NOTE: return an empty array as the result for new users
          res.end();
      }
      else{                                           // user exists already, pull existing pins
          resObj = existingUser['friends'];
          console.log(resObj);
          console.log('user exists already');
          res.setHeader('Access-Control-Allow-Origin','*');
          res.send(resObj);
          res.end();
      }
    })
  })
});

router.post('/add',function(req, res) {
  // connect to the db
  client.connect(function(err) {
    if (err) return callback(err);
    // get db variables
    const db = client.db('personal-interactive-map');   
    const friendsCollection = db.collection('friends');

    var searchEmail = req.body.email.replace(/[ ,.]/g, ""); // NOTE: email will always be the primary key
    var findUser = {"email":searchEmail};                   // filter query        
    var name = req.body.name;
    var friendEmail = req.body.friendEmail.replace(/[ ,.]/g, "");
    var searchFriendEmail = {"email":friendEmail}
    console.log(friendEmail)

    // Check if the friendEmail exists in the pins DB
    const pinsCollection = db.collection('pins');
    pinsCollection.findOne(searchFriendEmail, function(err,existingUser) {
      if (existingUser == null) {
        // DO NOTHING FRIEND DOESNT EXIST
      }
      else {
        console.log("i got called OMEGALUL")

        friendsCollection.findOne(findUser,function(err,existingUser) {
          if (existingUser == null){                      //user does not exist in DB
            console.log("Route: friends/add could not find the user"); // NOTE: code should never get here :)
            throw err;
          }
          
          var existingFriends = existingUser['friends'];
          var newFriend = {name: name, email: friendEmail};
          var updatedFriends = existingFriends.concat(newFriend);
          newValues = { $set: { friends: updatedFriends } };
          friendsCollection.updateOne(findUser, newValues, function(err, res) { 
              if (err) throw err;
          });
          res.end();
        });
      }
    });
  })
});

module.exports = router;