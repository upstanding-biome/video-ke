/*global App, YTHelper, AppView */
/*global AppPlayerSearch, YT */

var AppPlayer = function(id, config){
  config      = $.extend(AppPlayer.default_config, config);
  var self    = this;
  this.ready  = false;
  this.id     = id;

  var init = function(){
    self.player = new YT.Player(id, $.extend(config.yt, { events: {
                                                          'onReady': on_player_ready,
                                                          'onStateChange': on_state_change
                                                      }}));
    self.search = new AppPlayerSearch(self);
  };

  this.play = function(id){
    if(self.ready){
      this.player.loadVideoById(id);
    }
    else{
      alert('player not ready ...maybe its a bug ...or a feature?');
    }
  };

  this.is_playing = function (){
    return self.player.getPlayerState() === YT.PlayerState.PLAYING;
  };

  this.volume = function(level){
    if(level === null)
      return self.player.getVolume();

    if(level > 0){
      $('#'+id).addClass('active');
    }
    else{
      $('#'+id).removeClass('active');
    }

    self.player.setVolume(level);
  };

  var on_player_ready = function(e){
    self.ready = true;

    if(typeof config.player.on_ready === 'function'){
      config.player.on_ready(e);
    }
  };

  var on_state_change = function(e){
    if(typeof config.player.on_change === 'function'){
      config.player.on_change(e);
    }
  };

  init();
};

AppPlayer.default_config = {
  yt: {
    height: '390',
    width: '640',
    playerVars: { }
  },
  player:{
    on_ready: null,
    on_change: null
  }
};



var AppPlayerSearch = function(player){
  var search_button_selector = '#search-'+player.id+'-button';
  var search_input_selector  = '#search-'+player.id+'-input';
  var search_result_selector = '#search-'+player.id+'-result';
};

var AppVolumeSlider = function(id){
  var volume_slider = $('#'+id).slider();
  var volume_slider_state = $('#'+id+'-state');
  var self = this;

  this.inc_value = function(relative_value){
    self.value(self.value() + relative_value);
  };

  this.publish = function(value){
    volume_slider_state.html(Math.abs(value)+'%');
    App.volume(value);
  };

  //set volume while dragging slider
  volume_slider.on('slide', function(e){
                  self.publish(e.value);
                });
};

jQuery(function($){
  //triggers App.bootstrap and ensures jQuery is loaded
  $('body').append(
      $('<script/>').attr('src', "http://www.youtube.com/player_api"));
});

//triggered after http://www.youtube.com/player_api loaded
function onYouTubePlayerAPIReady(){
  App.bootstrap();
}

/*global AppPlayer, YTHelper, AppVolumeSlider */
var App = {
  bootstrap: function(){
    App.player1 = new AppPlayer('player1', {player: {on_ready: function(){ App.slider.value(-50); }}});
    App.player2 = new AppPlayer('player2', {player: {on_ready: function(){ App.slider.value(-50); }}});
    App.slider  = new AppVolumeSlider('volume-slider');
  },

  is_ready: function(){
    return App.player1.ready && App.player2.ready;
  },

  volume: function(value){
    if(!App.is_ready()){
      return ;
    }

    var volume_player_1, volume_player_2;

    if(value < 0){//means more on player 1
      volume_player_1 = Math.abs(value);
      volume_player_2 = 0;
    }
    else{//more on player 2
      volume_player_1 = 0;
      volume_player_2 = value;
    }

    App.player1.volume(volume_player_1);
    App.player2.volume(volume_player_2);
  },
};
