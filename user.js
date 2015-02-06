var map = require('./map');
var redis = require('redis');
var Module = require('./module/module');
var Battle = require('./battle');
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
  this.pannels = [
    new Module('Sword')
  ];
}
User.prototype.status = function() {
  var pannlesName = [];
  this.pannels.forEach(function(pannel) {
    pannlesName.push(pannel.name);
  });
  this.socket.emit('stat', {
    hp: this.hp,
    pannels: pannlesName
  });
}
User.prototype.damage = function(damage) {
    this.hp -= damage;
    this.socket.emit('log', damage+'のダメージ');
    this.status();
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

    var self = this;
    this.event(function(happened) {
      if (!happened) {
        // encount
        if (self.encount > 0) {
          self.encount -= 10;
          if (self.encount <= 0) {
            self.battle = new Battle(self);
            self.encount = 150;
          }
        }
      }
      self.look();
    });
  }
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

User.prototype.event = function(cb) {
  if (this.x == 10 && this.y == 15) {
    // message sample
    // 1.message
    this.socket.emit('log', 'ガラクタが置いてある');
    return cb(true);
  }
  if (this.x == 2 && this.y == 1) {
    // damage sample
    // 1.message
    // 2.damage
    this.socket.emit('log', '落石だ！');
    this.damage(10);
    return cb(true);
  }
  if (this.x == 10 && this.y == 6) {
    // move sample
    // 1.message
    // 2.next point
    this.x = 2;
    this.y = 3;
    this.socket.emit('log', 'テレポーターだ！');
    return cb(true);
  }
  cb(false);
}

User.prototype.pannel = function(index) {
  var self = this;
  var module = this.pannels[index];
  if (this.battle) {
    this.battle.run(module, function(end) {
      if (end) {
        self.socket.emit('log', '闘いに勝った');
        self.battle = null;
      }
    });
  } else {
    module.field(this);
  }
  this.status();
}


