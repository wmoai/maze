
module.exports = function(server, session) {

  require('./map').init();
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
      socket.on('mv', function(data) {
        if (socket.user.isDeath()) {
          return;
        }
        socket.user.move(data);
      });

      // pannel
      socket.on('pnl', function(data) {
        if (socket.user.isDeath()) {
          return;
        }
        socket.user.pannel(data);
      });

      // status
      socket.on('stat', function(data) {
        socket.user.status();
      });

    });
  });
}

