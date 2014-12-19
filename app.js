var express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , Session = require('express-session')
  , RedisConnect = require('connect-redis')(Session)
  , cookieParser = require('cookie-parser')
  , server = require('http').createServer(app).listen(3000)
;
var COOKIE_SECRET = "test";
var COOKIE_KEY = "sid";

var session = Session({
  name: COOKIE_KEY ,
  secret: COOKIE_SECRET,
  store: new RedisConnect({
    host:'127.0.0.1',
    port:6379
  })
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session);

var User = require('./model/user');
app.get('/', function(req, res) {
  if (req.session.loginName) {
    res.redirect('/app');
  } else {
    res.render('signin');
  }
});
app.post('/signup', function(req, res) {
  var name = req.body.name;
  var password = req.body.password;
  User.create(name, password, function(error, user) {
    if (error) return next(error);
    res.send(user);
  });
});
app.post('/signin', function(req, res, next) {
  var name = req.body.name;
  var password = req.body.password;
  User.auth(name, password, function(error, user) {
    if (error) return next(error);
    var sess = req.session;
    sess.loginName = name;
    res.redirect('/app');
  });
});
app.get('/app', function(req, res) {
  if (!req.session.loginName) {
    res.redirect('/');
  } else {
    res.render('index');
  }
});


var io = require('socket.io')(server);
io.of('/game').use(function (socket, next) {
  var req = socket.handshake;
  var res = {};
  session(req, res, function(err) {
    next();
  });
});
io.of('/game').on('connection', function(socket) {
  console.log('start game');

  var name = socket.handshake.session.loginName;
  var User = require('./user');

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
