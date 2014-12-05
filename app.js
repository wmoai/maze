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

var User = require('./user');

var io = require('socket.io')(server);
var room = io.on('connection', function(socket) {
  console.log('connect');
  socket.user = new User(socket);

  socket.on('look', function() {
    socket.user.look();
  });
  socket.on('fwd', function() {
    socket.user.walk();
  });
  socket.on('back', function() {
    socket.user.back();
  });
  socket.on('left', function() {
    socket.user.left();
  });
  socket.on('right', function() {
    socket.user.right();
  });
});
