"use strict";
var Song = require('./models.js').Song;
var User = require('./models.js').User;
var mongoose = require('mongoose');

//========================================================//
//   Connecting to the deployed db (ie mongolab)          //
//   username:  testDummy                                 //
//   password:  testDummy                                 //
//   database name:  heroku_sxb8blzn                      //
//   heroku acct info:                                    //
//    email: cdersky@gmail.com                            //
//    password: Greenfield1234                            //
//========================================================//
mongoose.connect('mongodb://testDummy:testDummy@ds031213.mongolab.com:31213/heroku_sxb8blzn');

//========================================================//
//   Populating the Lib                                   //
//   (this is asyn and uses a promise. see .exec() below) //
//========================================================//
var Library = function(cb) {
  Song.find().exec(cb);
};

exports.Library = Library;
