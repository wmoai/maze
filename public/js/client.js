$(function() {
  var socket = io();
  socket.emit('look');

  $('html').on('keyup', function(e) {
    switch(e.keyCode) {
    case 37:
      left();
      break;
    case 38:
      fwd();
      break;
    case 39:
      right();
      break;
    case 40:
      back();
      break;
    }
  });
  $('#view').on('click', function(e) {
    var offset = $(this).offset();
    var ex = e.pageX - offset.left
      , ey = e.pageY - offset.top
      , width = $(this).width()
      , height = $(this).height();
    if (ex < width/8) {
      left();
    } else if (ex > width/8*7) {
      right();
    } else if (ey < height/3) {
      fwd();
    } else if (ey > height/3*2) {
      back();
    }
  });

  function fwd() {
    socket.emit('fwd');
  }
  function back() {
    socket.emit('back');
  }
  function left() {
    socket.emit('left');
  }
  function right() {
    socket.emit('right');
  }

  var drawer = getDrawer();
  socket.on('view', function(data) {
    drawer(data);
  });

});
