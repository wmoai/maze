var Battle = function(user) {
  this.user = user;
  this.enemies = [];
  this.enemies.push({
    name: "スライム",
    hp: 30,
    atk: 9,
    image: "/image/c3f19147.jpg"
  });
  this.target = 0;

  var self = this;
  this.enemies.forEach(function(enemy) {
    self.user.socket.emit('log', enemy.name+"が現れた！");
    self.user.socket.emit('image', enemy.image);
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
    this.user.look();
    this.enemies.splice(eindex, 1);
  }
}
Battle.prototype.attacked = function() {
  var self = this;
  this.enemies.forEach(function(enemy) {
    self.user.damage(enemy.name+"の攻撃！", enemy.atk);
  });
}
Battle.prototype.isEnd = function() {
  return (this.enemies.length == 0);
}


module.exports = Battle;
