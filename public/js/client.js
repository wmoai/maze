$(function() {
  var socket = io('/game');

  socket.emit('move', 0);
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

  // tap io
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
    socket.emit('move', 1);
  }
  function left() {
    socket.emit('move', 2);
  }
  function right() {
    socket.emit('move', 3);
  }
  function back() {
    socket.emit('move', 4);
  }

  var drawer = getDrawer();
  socket.on('view', function(data) {
    drawer(data);
  });
  socket.on('log', function(log) {
    var line = $('<div>').html(log);
    $('#console').prepend(line);
  });

});
