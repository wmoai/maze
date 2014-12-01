var express = require('express')
  , app = express()
  , server = require('http').createServer(app).listen(3000)
  ;

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render('index');
});

var map = require('./map');
var io = require('socket.io')(server);
var room = io.on('connection', function(socket) {
  console.log('connect');
  socket.pt = {
    x: 1,
    y: 1,
    dir: 0
  };

  function look() {
    var pt = socket.pt;
    socket.emit('view', map.view(pt.x, pt.y, pt.dir));
  }
  socket.on('look', look);
  socket.on('fwd', function() {
    switch(socket.pt.dir) {
    case 0:
      socket.pt.y++;
      break;
    case 1:
      socket.pt.x++;
      break;
    case 2:
      socket.pt.y--;
      break;
    case 3:
      socket.pt.x--;
      break;
    }
    look();
  });
  socket.on('back', function() {
    socket.pt.dir += 2;
    socket.pt.dir %= 4;
    look();
  });
  socket.on('left', function() {
    socket.pt.dir += 3;
    socket.pt.dir %= 4;
    look();
  });
  socket.on('right', function() {
    socket.pt.dir++;
    socket.pt.dir %= 4;
    look();
  });
});
