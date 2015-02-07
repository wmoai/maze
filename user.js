var map = require('./map');
var redis = require('redis');
var module = require('./module/');
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
    new module.sword('Short Sword'),
    new module.cure('Cure')
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
User.prototype.damage = function(message,damage) {
  this.hp -= damage;
  this.socket.emit('log', message+' '+damage+'のダメージを受けた！');
  if (this.isDeath()) {
    this.socket.emit('log', '死にました');
  }
  this.status();
}
User.prototype.cure = function(message, cure) {
  this.hp += cure;
  this.socket.emit('log', message+' '+cure+'ポイント回復！');
  this.status();
}
User.prototype.isDeath = function() {
  return (this.hp <= 0);
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
  client.set(this.name, [this.x, this.y, this.dir, this.hp], redis.print);
}

exports.getUser = function(socket, name, cb) {
  var user = new User(socket, name);
  client.get(name, function(err, reply) {
    if (err || !reply) {
    } else {
      var val = reply.split(',');
      user.x = parseInt(val[0]);
      user.y = parseInt(val[1]);
      user.dir = parseInt(val[2]);
      if (val[3]) {
        user.hp = parseInt(val[3]);
        if (user.hp < 1) {
          user.hp = 1;
        }
      }
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
    this.damage('落石だ！', 10);
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


