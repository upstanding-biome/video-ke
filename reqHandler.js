// "use strict";

// var MongoClient = require('mongodb').MongoClient;
// var assert = require('assert');
// var mongo = require('mongodb');
// var Grid = require('gridfs-stream');
// var fs = require('fs');

// //========================================================//
// //   Use this to add many mp3s at once                    //
// //========================================================//
// // var Song = require('./models.js').Song;
// // var songsList = require('./songsList.js');
// // var insert = function() {
// //   // Connection URL
// //   var url = 'mongodb://ds031213.mongolab.com:31213/heroku_sxb8blzn';
// //   MongoClient.connect(url, function(err, db) {
// //     assert.equal(null, err);
// //     console.log("Connected correctly to server FROM REQ HANDLER");
// //     db.authenticate('testDummy', 'testDummy', function(err, res) {

// //       //var gfs = Grid(db, mongo);
// //       var currRecord = songsList.shift();

// //       // var uploadMP3 = function() {
// //       //   var writestream = gfs.createWriteStream({
// //       //     filename: currRecord.title
// //       //   });
// //       //   fs.createReadStream('audio_files/' + currRecord.filename).pipe(writestream);
// //       //   writestream.on('close', function(file) {
// //       //     console.log('file._id :', file._id);
// //       //     makeSongRecord(file._id);
// //       //   });
// //       // };

// //       var makeSongRecord = function(id) {
// //         var titanicTS = new Song({
// //           filename: currRecord.filename,
// //           title: currRecord.title,
// //           artist: currRecord.artist,
// //           genre: currRecord.genre

// //           // trackId: id
// //         });
// //         titanicTS.save(function(err) {
// //           if (err) console.log(err);
// //           console.log('Wrote Record:', currRecord.title);
// //           currRecord = songsList.shift();
// //           if (currRecord) {
// //             makeSongRecord();
// //           } else {
// //             console.log('completed uploads!!!');
// //           }
// //         });
// //       };

// //       makeSongRecord();
// //     });
// //   });
// // };

// //insert();

// //======================================================================//
// //  Function to retrieve songs from database                            //
// //  see get rewuest for 'track' route  in app.js (around line 56)       //
// //======================================================================//
// var retrieve = function(id, response) {
//   // // sets connection to remote mongolab db
//   // var url = 'mongodb://ds031213.mongolab.com:31213/heroku_sxb8blzn';

//   // //connection is created
//   // MongoClient.connect(url, function(err, db) {
//   //   // assert is a promise for async functions, see required dependecy above
//   //   assert.equal(null, err);

//   //   //mongolab db is authenticated with the username and password arguments provided
//   //   db.authenticate('testDummy', 'testDummy', function(err, res) {
//   //     // GridFS is a tool to stream files that are larger than 16MB to/from your Mongo db
//   //     // for info on Gridfs see: https://www.npmjs.com/package/gridfs-stream
//   //     // uses an existing mongodb-native db instance
//   //     var gfs = Grid(db, mongo);

//   //     //read from mongodb using the track id
//   //     response.set('Content-Type', 'audio/mpeg');
//   //     var readstream = gfs.createReadStream({
//   //       _id: id
//   //     });

//   //     readstream.pipe(response);
//   //   });
//   // });

// };

// //========================================================//
// //   Use to retrieve tracks from the db                   //
// //========================================================//
// exports.retrieve = retrieve;

// //reference: http://excellencenodejsblog.com/gridfs-using-mongoose-nodejs/
