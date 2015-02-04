var map = require('./map');
var redis = require('redis');
client = redis.createClient();

var User = function(socket, name) {
  this.socket = socket;
  this.name = name;
  this.x = 1;
  this.y = 1;
  this.dir = 0;

  this.battle = false;
  this.encount = 100;

  this.hp = 82;
  this.pannels = ['sward', 'heal', 'run'];
}
User.prototype.status = function() {
  this.socket.emit('stat', {
    hp: this.hp,
    pannels: this.pannels
  });
}
User.prototype.move = function(data) {
  if (this.battle) {
    return;
  }
  switch (data) {
    case 0:
      this.look();
    break;
    case 1:
      this.walk();
    break;
    case 2:
      this.left();
    break;
    case 3:
      this.right();
    break;
    case 4:
      this.back();
    break;
  }
}
User.prototype.willWalk = function() {
  var nx = this.x
    , ny = this.y;
  switch(this.dir) {
    case 0:
      ny++;
    break;
    case 1:
      nx++;
    break;
    case 2:
      ny--;
    break;
    case 3:
      nx--;
    break;
  }
  return [nx, ny];
}
User.prototype.walk = function() {
  var npt = this.willWalk();
  if (map.isMovable(npt[0], npt[1])) {
    this.x = npt[0];
    this.y = npt[1];
    var event = map.event(this.x, this.y);
    if (event) {
      this.socket.emit('log', event());
    }

    // dec encount
    if (this.encount > 0) {
      this.encount -= 10;
    }
  }
  this.look();
}
User.prototype.back = function() {
  this.dir += 2;
  this.dir %= 4;
  this.look();
}
User.prototype.left = function() {
  this.dir += 3;
  this.dir %= 4;
  this.look();
}
User.prototype.right = function() {
  this.dir++;
  this.dir %= 4;
  this.look();
}
User.prototype.look = function() {
  this.socket.emit('view', map.view(this.x, this.y, this.dir));
}
User.prototype.save = function() {
  client.set(this.name, [this.x, this.y, this.dir], redis.print);
}

exports.getUser = function(socket, name, cb) {
  var user = new User(socket, name);
  client.get(name, function(err, reply) {
    if (err || !reply) {
    } else {
      var point = reply.split(',');
      user.x = parseInt(point[0]);
      user.y = parseInt(point[1]);
      user.dir = parseInt(point[2]);
    }
    cb(user);
  });
}


