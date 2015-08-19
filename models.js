var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//========================================================//
//   Sets the structure of the Song db                    //
//========================================================//
var songSchema = new Schema({
  title: String,
  genre: String,
  artist: String,
  trackId: String,
  filename: String
});

//========================================================//
//    Creates Song model                                  //
//========================================================//
var Song = mongoose.model('Song', songSchema);

//========================================================//
//   Sets the structure of the User db                    //
//   This is an example for future groups                 //
//========================================================//
var userSchema = new Schema({
  name: String
});
var User = mongoose.model('User', userSchema);

//========================================================//
//   export to use in the dbconnection file               //
//========================================================//
exports.Song = Song;
exports.User = User;
