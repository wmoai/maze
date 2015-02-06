var Battle = function(user) {
  this.user = user;
  this.enemies = [];
  this.enemies.push({
    name: "スライム",
    hp: 30,
    atk: 9
  });
  this.target = 0;

  var self = this;
  this.enemies.forEach(function(enemy) {
    self.user.socket.emit('log', enemy.name+"が現れた！");
  });
}

Battle.prototype.run = function(module, cb) {
  var self = this;
  module.battle(this, function(end) {
    if (end) {
      self.attacked();
      cb(self.isEnd());
    }
  });
}

Battle.prototype.attack = function() {
  var eindex = 0;
  var enemy = this.enemies[eindex];
  var damage = 20;
  enemy.hp -= damage;
  this.user.socket.emit('log', enemy.name+"に"+damage+"のダメージ！");
  if (enemy.hp <= 0) {
    this.user.socket.emit('log', enemy.name+"を倒した！");
    // delete this.enemies[eindex];
    this.enemies.splice(eindex, 1);
  }
}
Battle.prototype.attacked = function() {
  var self = this;
  this.enemies.forEach(function(enemy) {
    self.user.hp -= enemy.atk;
    self.user.socket.emit('log', enemy.name+"の攻撃！\n"+enemy.atk+"のダメージを受けた！");
  });
}
Battle.prototype.isEnd = function() {
  return (this.enemies.length == 0);
}


module.exports = Battle;
