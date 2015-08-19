"use strict";

////////////////////////////////////////////////////////////////////////////////
// MODELS  //
////////////////////////////////////////////////////////////////////////////////

//defining model for the entire app
var AppModel = Backbone.Model.extend({
  initialize: function() {
    //instatiating both queue collections. 'queueA' and 'queueB' will both be an array of objects
    var queueA = new QueueCollection([]);
    var queueB = new QueueCollection([]);

    //binding a callback to both queues that will set the current song. it will be invoked when the 'playsong' event is fired from 'QueueCollection'
    queueA.on('playsong', function(song) {
      this.set('currentSongA', song);
    }, this);
    queueB.on('playsong', function(song) {
      this.set('currentSongB', song);
    }, this);

    //setting a queue attribute that will have events: add, playsong, and remove
    this.set('queueA', queueA);
    this.set('queueB', queueB);

    //setting a current song attribute
    this.set('currentSongA', new SongModel());
    this.set('currentSongB', new SongModel());
  },

  //dequeue methods for each queue
  dequeueA: function() {
    this.get('queueA').dequeue();
  },
  dequeueB: function() {
    this.get('queueB').dequeue();
  }
});

//defining a model for a song
var SongModel = Backbone.Model.extend({});

////////////////////////////////////////////////////////////////////////////////
//                                                               COLLECTIONS  //
////////////////////////////////////////////////////////////////////////////////

//define a collection class for our song library
var LibraryCollection = Backbone.Collection.extend({
  //model contained within the library
  model: SongModel,

  //where our songs collection exists on the server
  url: 'https://trntbl3000.herokuapp.com/songs'
});

//define a collection class for our queue
var QueueCollection = Backbone.Collection.extend({
  //model contained within the queue
  model: SongModel,

  //define enqueue method, which will be fired from the button in 'LibrarySongView'
  enqueue: function(song) {
    //add song to the queue
    this.add(song);

    //if this is the only song in the queue, send the audio to its corresponding player
    if (this.length === 1) {
      this.trigger('playsong', this.at(0));
    }
  },

  //define dequeue method, which will be fired from 'AppModel'
  dequeue: function() {
    //remove the song
    this.shift();
    if (this.length >= 1) {
      this.trigger('playsong', this.at(0));
    } else {
      this.trigger('playsong');
    }
  }
});

////////////////////////////////////////////////////////////////////////////////
// VIEWS  //
////////////////////////////////////////////////////////////////////////////////

//define view class for the entire app
var AppView = Backbone.View.extend({
  initialize: function(params) {
    //instantiating our turntables and crossfader
    this.playerViewA = new PlayerView($('.playerLeft'));
    this.playerViewB = new PlayerView($('.playerRight'));
    this.sliderView = new SliderView($('#sliderContainer'));

    //listening for a change to our current song in the corresponding turntable, callback will be invoked when the change event is fired
    //'setSong' is defined in 'PlayerView'
    this.model.on('change:currentSongA', function(model) {
      this.playerViewA.setSong(model.get('currentSongA'));
    }, this);

    this.model.on('change:currentSongB', function(model) {
      this.playerViewB.setSong(model.get('currentSongB'));
    }, this);

    //when song ends, the callback function will be invoked and the ended song will be removed. 'dequeueA/B' is defined in 'AppModel'
    this.playerViewA.on('ended', function() {
      this.model.dequeueA();
    }, this);
    this.playerViewB.on('ended', function() {
      this.model.dequeueB();
    }, this);

    //'sliderView' is instantiated in 'AppModel', the callback responds to the 'x-fade' event when the user moves the crossfader
    //the volume control on both audio players are linked together and will respond to crossfader movement
    this.sliderView.on('x-fade', function(value) {
      value = parseFloat(value);
      this.playerViewA.setVolume(value > 0 ? 1 - value : 1);
      this.playerViewB.setVolume(value < 0 ? 1 + value : 1);
    }, this);

  }
});

//define the view class for a song in the library
var LibrarySongView = Backbone.View.extend({
  //create a 'tr' tag name for each song
  tagName: 'tr',

  //initialize will take in a model (song) and both queues, and define them
  initialize: function(model, queueA, queueB) {
    this.model = model;
    this.queueA = queueA;
    this.queueB = queueB;
    this.render();
  },

  //render each song in our library
  render: function() {

    //create a button that, when clicked, will send a song to queueA
    var queueBtnA = $('<input type="button" class="btn btn-default btn-xs" value="QueueA"></input>');
    queueBtnA.click(function() {
      this.queueA.enqueue(this.model.clone());
    }.bind(this));
    //create a cell in our row that we can append our button to
    var tdA = $('<td>');
    tdA.append(queueBtnA);

    var queueBtnB = $('<input type="button" class="btn btn-default btn-xs" value="QueueB"></input>');
    queueBtnB.click(function() {
      this.queueB.enqueue(this.model.clone());
    }.bind(this));
    var tdB = $('<td>');
    tdB.append(queueBtnB);

    //render this view which will consist of two queue buttons with song title in the same row
    this.$el
      .append(tdA)
      .append('<td>' + this.model.get('title') + '</td>')
      .append('<td>' + this.model.get('artist') + '</td>')
      .append('<td>' + this.model.get('genre') + '</td>')
      .append(tdB);

    return this;

  }
});

//define the view class which will be comprised of the entire song library
var LibraryCollectionView = Backbone.View.extend({
  //create a table for the songs
  tagName: 'table',

  // adding .table classname for bootstrap
  className: 'table table-condensed',

  //passing in arguments that we want our render method to have access to
  initialize: function(container, collection, queueA, queueB) {
    this.collection = collection;
    this.collection.on('add', this.render.bind(this));
    this.queueA = queueA;
    this.queueB = queueB;
    container.append(this.$el);
    this.render();
  },

  //render the view
  render: function() {
    this.$el.html('');
    this.$el.append('<input></input>');
    this.$el.append('');

    //iterate through the collection and append each song to the table
    this.collection.each(function(item) {
      var song = new LibrarySongView(item, this.queueA, this.queueB);
      this.$el.append(song.$el);
    }, this);
  }
});

//define the view class for a song in the queue
var QueueSongView = Backbone.View.extend({
  //create a new row for each song
  tagName: 'tr',

  //passing in a song that will appended in the render method
  initialize: function(model) {
    this.model = model;
    this.render();
  },

  //render the view and append the song title to the row
  render: function() {
    return this.$el.append('<td>' + this.model.get('title') + '</td>');
  }
});

//define the view class for the entire queue of songs
var QueueCollectionView = Backbone.View.extend({
  //create a table for the queue
  tagName: 'table',

  // adding .table classname for bootstrap
  className: 'table table-condensed',

  //when a song is added or removed from the collection, render will be invoked to reflect changes
  initialize: function(container, collection) {
    this.collection = collection;
    this.collection.on('add remove', this.render.bind(this));
    container.append(this.$el);
    this.render();
  },

  //render the view
  render: function() {
    //reset the container element for each render
    this.$el.html('');

    //iterate through the collection to append the songs
    this.collection.each(function(item) {
      var song = new QueueSongView(item);
      this.$el.append(song.$el);
    }, this);
  }
});

//create a view class for our turntables, which is instantiated in 'AppView'
var PlayerView = Backbone.View.extend({
  //create a new audio element with controls
  el: '<audio controls preload auto />',

  //callback is invoked when 'ended' is fired (when song is done playing)
  initialize: function(container) {
    this.$el.on('ended', function() {
      this.trigger('ended', this.model);
    }.bind(this));

    //clear song out of player
    container.append(this.$el);
    this.render();
  },

  //'AppView' is listening for 'setSong' to fire
  setSong: function(song) {
    this.model = song;
    if (!this.model) {
      this.el.pause();
    }

    this.render();
  },

  //'AppView' is listening for 'setVolume' to fire
  setVolume: function(value) {
    this.$el.prop("volume", value);
  },

  //render the view for the player and get the song from the server
  render: function() {
    return this.$el.attr('src', this.model ? 'https://trntbl3000.herokuapp.com/' + this.model.get('filename') : '');
  }

});

//define a view class for our crossfader which is instantiated in 'AppView'
var SliderView = Backbone.View.extend({
  //create the slider element and declare a range which will help with 'setVolume' method in 'PlayerView'
  el: '<input id="slider" type="range" min="-1" max="1" step="0.1"></input>',
  initialize: function(container) {
    //append the slider, and invoke the callback on any crossfader movement by the user
    container.append(this.$el);
    this.$el.on('input', function() {
      this.trigger('x-fade', this.$el.val());
    }.bind(this));
  }
});

$(document).ready(function() {

  $('#airHorn').click(function() {
    $("<audio></audio>").attr({
      src: 'sfx/airHorn_1.mp3',
      autoplay: 'autoplay'
    });
  });

  ////////////////////////////////////////////////////////////////////////////////
  //                                                           MODEL INSTANCES  //
  ////////////////////////////////////////////////////////////////////////////////

  //create a model class for our entire app
  var appModel = new AppModel();

  ////////////////////////////////////////////////////////////////////////////////
  //                                                      COLLECTION INSTANCES  //
  ////////////////////////////////////////////////////////////////////////////////

  //library is a collection of the songs in our database
  var library = new LibraryCollection();

  //calling fetch on library makes a GET request and populates our library
  library.fetch();

  ////////////////////////////////////////////////////////////////////////////////
  //                                                            VIEW INSTANCES  //
  ////////////////////////////////////////////////////////////////////////////////

  //instantiating a new view for our library
  var libraryView = new LibraryCollectionView($('#libraryView'), library, appModel.get('queueA'), appModel.get('queueB'));

  //instantiating our queue collections
  var queueViewA = new QueueCollectionView($('#queueViewA'), appModel.get('queueA'));

  var queueViewB = new QueueCollectionView($('#queueViewB'), appModel.get('queueB'));

  //instantiate a view for our entire app
  var appView = new AppView({
    model: appModel
  });
});
