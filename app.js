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
var User = require('./user');

var io = require('socket.io')(server);
var room = io.on('connection', function(socket) {
  console.log('connect');
  socket.user = new User;

  function look() {
    var user = socket.user;
    socket.emit('view', map.view(user.x, user.y, user.dir));
  }
  socket.on('look', look);
  socket.on('fwd', function() {
    var npt = socket.user.willWalk();
    if (map.isMovable(npt[0], npt[1])) {
      socket.user.walk();
    }
    look();
  });
  socket.on('back', function() {
    socket.user.back();
    look();
  });
  socket.on('left', function() {
    socket.user.left();
    look();
  });
  socket.on('right', function() {
    socket.user.right();
    look();
  });
});
