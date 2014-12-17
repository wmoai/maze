var express = require('express')
  , app = express()
  , cookieParser = require('cookie-parser')
  , parseCookie = cookieParser('cat')
  , server = require('http').createServer(app).listen(3000)
;

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(parseCookie);

app.get('/', function(req, res) {
  res.cookie('test', 2);
  res.render('index');
});

var User = require('./user');

var io = require('socket.io')(server);
io.use(function (socket, next) {
  var req = socket.handshake;
  var res = {};
  parseCookie(req, res, function(err) {
    console.log(req.cookies);
  });
});
io.of('/game').on('connection', function(socket) {
  console.log('start game');

  socket.on('login', function(name) {
    if (socket.logined) {
      return;
    }
    socket.logined = true;

    socket.emit('start');
    User.getUser(socket, name, function(user) {
      socket.user = user;
      socket.on('disconnect', function() {
        socket.user.save();
      });

      // move
      socket.on('move', function(data) {
        socket.user.move(data);
      });
      // battle
      socket.on('battle', function(data) {

      });

    });
  });
});
