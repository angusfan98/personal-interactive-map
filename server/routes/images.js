var express = require('express');
var router = express.Router();

// Database options/connection
const MongoClient = require('mongodb').MongoClient;
var connstring = 'mongodb+srv://root:root@personal-interactive-ma.vyxje.mongodb.net/personal-interactive-map?retryWrites=true&w=majority'
const client = new MongoClient(connstring,{useUnifiedTopology: true});

// Default /pins gateway for pulling pin data for a user
// FIXME: Edit all of this
router.post('/',function(req, res) {
  // connect to the db
  client.connect(function(err) {
      if (err) return callback(err);

      // get db variables
      const db = client.db('personal-interactive-map');   
      const collection = db.collection('images');                

      var searchEmail = req.body.email.replace(/[ ,.]/g, ""); // NOTE: email will always be the primary key
      var findUser = {"email":searchEmail};                   // filter query 

      // Look for the user
      collection.findOne(findUser,function(err,existingUser) {
          if (existingUser == null){                      //user does not exist in DB, insert him in with empty pins array
            console.log('new user');
            var addNewUser = {};
            addNewUser['email'] = searchEmail;
            addNewUser['images'] = [];
            collection.insertOne(addNewUser);
            console.log("Added new user");
            res.setHeader('Access-Control-Allow-Origin','*');
            res.send([]);   // NOTE: return an empty array as the result for new users
            res.end();
          }
          else{                                           // user exists already, pull existing pins
            resObj = existingUser['images'];
            console.log(resObj);
            console.log('user exists already');
            res.setHeader('Access-Control-Allow-Origin','*');
            res.send(resObj);
            res.end();
          }
      })
  });
});

router.post('/add',function(req, res) {
  // connect to the db
  client.connect(function(err) {
    if (err) return callback(err);
    // get db variables
    const db = client.db('personal-interactive-map');   
    const collection = db.collection('images');

    var searchEmail = req.body.email.replace(/[ ,.]/g, ""); // NOTE: email will always be the primary key
    var findUser = {"email":searchEmail};                   // filter query        
    var title = req.body.title;
    var caption = req.body.caption;
    var imageString =  req.body.imageString;

    // Look for the user
    collection.findOne(findUser,function(err,existingUser) {
      if (existingUser == null){                      //user does not exist in DB, create and insert it
          console.log('new user');
          var addNewUser = {};
          addNewUser['email'] = searchEmail;
          addNewUser['images'] = [
            {
              title: title,
              caption: caption,
              imageString: imageString
            }
          ];
          collection.insertOne(addNewUser);
          console.log("Added new user");
          res.setHeader('Access-Control-Allow-Origin','*');
          res.send([]);   // NOTE: return an empty array as the result for new users
          res.end();
      }
      else{                                           // user exists already, pull existing pins
          existingImages = existingUser['images'];
          var newImage = {
            title: title,
            caption: caption,
            imageString: imageString
          };
          updatedImages = existingImages.concat(newImage);
          newValues = { $set: { images: updatedImages } };
          collection.updateOne(findUser, newValues, function(err, res) { 
            if (err) throw err;
          });
          res.setHeader('Access-Control-Allow-Origin','*');
          res.end();
      }
    })
  })
});

module.exports = router;