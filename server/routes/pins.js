var express = require('express');
var router = express.Router();

// Database options/connection
const MongoClient = require('mongodb').MongoClient;
var connstring = 'mongodb+srv://root:root@personal-interactive-ma.vyxje.mongodb.net/personal-interactive-map?retryWrites=true&w=majority'
const client = new MongoClient(connstring,{useUnifiedTopology: true});

// Default /pins gateway for pulling pin data for a user
router.post('/',function(req, res) {
    // connect to the db
    client.connect(function(err) {
        if (err) return callback(err);

        // get db variables
        const db = client.db('personal-interactive-map');   
        const collection = db.collection('pins');                

        var searchEmail = req.body.email.replace(/[ ,.]/g, ""); // NOTE: email will always be the primary key
        var findUser = {"email":searchEmail};                   // filter query 

        // Look for the user
        collection.findOne(findUser,function(err,existingUser) {
            if (existingUser == null){                      //user does not exist in DB, insert him in with empty pins array
                console.log('new user');
                var addNewUser = {};
                addNewUser['email'] = searchEmail;
                addNewUser['pins'] = [];
                collection.insertOne(addNewUser);
                console.log("Added new user");
                res.setHeader('Access-Control-Allow-Origin','*');
                res.send([]);   // NOTE: return an empty array as the result for new users
                res.end();
            }
            else{                                           // user exists already, pull existing pins
                resObj = existingUser['pins'];
                console.log(resObj);
                console.log('user exists already');
                res.setHeader('Access-Control-Allow-Origin','*');
                res.send(resObj);
                res.end();
            }
        })
    });
});

// Add pins route to add pins to a user
router.post('/add',function(req, res) {
    // connect to the db
    client.connect(function(err) {
        if (err) return callback(err);
        
        // get db variables
        const db = client.db('personal-interactive-map');   
        const collection = db.collection('pins');    

        var searchEmail = req.body.email.replace(/[ ,.]/g, ""); // NOTE: email will always be the primary key
        var findUser = {"email":searchEmail};                   // filter query 

        collection.findOne(findUser,function(err,existingUser) {
            if (existingUser == null){                      //user does not exist in DB
                console.log("Route: pins/add could not find the user"); // NOTE: code should never get here :)
                throw err;
            }
            
            var existingPins = existingUser['pins'];
           
            if(req.body.have_visited == 'undefined'){
                req.body.have_visited = 'false'
            }
            if(req.body.interested == 'undefined'){
                req.body.interested = 'false'
            }
            var newPin = {lat: req.body.lat, lng:req.body.lng, address:req.body.address, desc:req.body.desc, have_visited:req.body.have_visited, interested:req.body.interested, titles:req.body.titles};
            updatedPins = existingPins.concat(newPin);
            newValues = { $set: { pins: updatedPins } };
            collection.updateOne(findUser, newValues, function(err, res) { 
                if (err) throw err;
            });
            // res.setHeader('Access-Control-Allow-Origin','*');
            // res.send(resObj);
            res.end();
        })
    });
});

// Delete pins route
router.post('/delete',function(req, res) {
    // connect to the db
    client.connect(function(err) {
        if (err) return callback(err);

        // get db variables
        const db = client.db('personal-interactive-map');   
        const collection = db.collection('pins');    

        var searchEmail = req.body.email.replace(/[ ,.]/g, ""); // NOTE: email will always be the primary key
        var findUser = {"email":searchEmail};                   // filter query 
        var target = req.body.target;
        console.log(target)

        collection.findOne(findUser,function(err, existingUser) {
            if (existingUser == null){                      //user does not exist in DB
                console.log("Route: pins/delete could not find the user"); // NOTE: code should never get here :)
                throw err;
            }
            
            var updatedPins = existingUser['pins'];
            console.log(updatedPins)
            console.log(target)

            updatedPins.splice(parseInt(target), 1);
            console.log(updatedPins)

            var newValues = { $set: { pins: updatedPins } };
            collection.updateOne(findUser, newValues, function(err, res) { 
                if (err) throw err;
            });
            res.setHeader('Access-Control-Allow-Origin','*');
            res.send(resObj);
            res.end();
        })
    });
});

router.post('/update',function(req, res) {
    // connect to the db
    client.connect(function(err) {
        if (err) return callback(err);

        // get db variables
        const db = client.db('personal-interactive-map');   
        const collection = db.collection('pins');    

        var searchEmail = req.body.email.replace(/[ ,.]/g, ""); // NOTE: email will always be the primary key
        var findUser = {"email":searchEmail};                   // filter query 
        var target = req.body.target;
        var desc = req.body.desc;
        var have_visited = req.body.have_visited;
        var interested = req.body.interested;
        var titles = req.body.titles;

        collection.findOne(findUser,function(err, existingUser) {
            if (existingUser == null){                      //user does not exist in DB
                console.log("Route: pins/delete could not find the user"); // NOTE: code should never get here :)
                throw err;
            }
            
            var updatedPins = existingUser['pins'];
            updatedPins[target].desc = desc;
            updatedPins[target].have_visited = have_visited;
            updatedPins[target].interested = interested;
            updatedPins[target].titles = titles;
            console.log(updatedPins)

            var newValues = { $set: { pins: updatedPins } };
            collection.updateOne(findUser, newValues, function(err, res) { 
                if (err) throw err;
            });
            res.setHeader('Access-Control-Allow-Origin','*');
            res.send(resObj);
            res.end();
        })
    });
});

module.exports = router;
