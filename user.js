var map = require('./map');
var redis = require('redis');
var Chara = require('./chara');
client = redis.createClient();

var User = function(socket, name) {
  this.socket = socket;
  this.name = name;
  this.x = 1;
  this.y = 1;
  this.dir = 0;

  this.battle = false;
  this.encount = 100;

  this.chara = new Chara(name, 42, 28, 16, 14);
}
User.prototype.move = function(data) {
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
  if (this.battle) {
    return;
  }
  var npt = this.willWalk();
  if (map.isMovable(npt[0], npt[1])) {
    switch(this.dir) {
      case 0:
        this.y++;
      break;
      case 1:
        this.x++;
      break;
      case 2:
        this.y--;
      break;
      case 3:
        this.x--;
      break;
    }
    // TODO check encount
    this.encount -= 10;
    if (this.encount <= 0) {
      this.socket.emit('log', 'encount !');
      this.encount = 100;
    }
  }
  this.look();
}
User.prototype.back = function() {
  if (this.battle) {
    return;
  }
  this.dir += 2;
  this.dir %= 4;
  this.look();
}
User.prototype.left = function() {
  if (this.battle) {
    return;
  }
  this.dir += 3;
  this.dir %= 4;
  this.look();
}
User.prototype.right = function() {
  if (this.battle) {
    return;
  }
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

