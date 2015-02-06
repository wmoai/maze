$(function() {
  var socket = io('/game');

  socket.on('stat', function(data) {
    var hp = '';
    for (var i=0; i<data.hp; i++) {
      hp += '|';
    }
    $('#hp').html(hp);

    $('#pnls').empty();
    data.pannels.forEach(function(pannel) {
      var elm = $('<input>', {'class':'pnl', 'type':'button'});
      elm.val(pannel);
      $('#pnls').append(elm);
    });
  });

  socket.emit('mv', 0);
  socket.emit('stat');
  var wait = function() {
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
      $(this).off();
      setTimeout(wait, 150);
    });
  }
  wait();

  // TAP interface
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
    socket.emit('mv', 1);
  }
  function left() {
    socket.emit('mv', 2);
  }
  function right() {
    socket.emit('mv', 3);
  }
  function back() {
    socket.emit('mv', 4);
  }

  var drawer = getDrawer();
  socket.on('view', function(data) {
    drawer(data);
  });
  var printLog = function(message) {
    var line = $('<div>').html(message);
    $('#console').prepend(line);
  }
  socket.on('log', function(log) {
    printLog(log.replace(/[\n\r]/g, '<br>'));
  });

  // pannel
  $('#pnls').on('click', '.pnl', function(e) {
    var index = $('#pnls > .pnl').index(this);
    socket.emit('pnl', index);
  });

});

