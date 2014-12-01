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
