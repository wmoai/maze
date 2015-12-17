var Battle = function(game) {
  this.game = game;
  this.enemies = [
    new Worm("巨大ミミズ", 12, 6, 0),
    new Worm("巨大ミミズ", 12, 6, 0)
  ]; 
  this.messages = [
    ["敵と遭遇した"]
  ];
}
Battle.prototype.proceed = function() {
  if (this.messages.length > 0) {
    var message = this.messages.shift();
    if (this._end && this.messages.length == 0) {
      this.end = true;
    }
    return message;
  } else if (this.game.player.movable) {
    return this.attack();
  } else {
    return this.enemyTurn();
  }
}
Battle.prototype.attack = function() {
  var player = this.game.player;
  var targetIndex = 0;
  var target = this.enemies[targetIndex];
  this.messages.push(player.attack(target));
  if (target.isDead()) {
    this.enemies.splice(targetIndex, 1);
  }
  if (this.enemies.length == 0) {
    this.messages.push(["敵はいなくなった"]);
    this._end = true;
  }
  player.movable = false;
  return this.proceed();
}
Battle.prototype.enemyTurn = function() {
  var self = this;
  var moved = false;
  this.enemies.forEach(function(enemy) {
    if (!moved && enemy.movable) {
      moved = true;
      self.messages.push(enemy.action(self.game));
      enemy.movable = false;
    }
  });
  if (!moved) {
    self.turnEnd();
  }
  return this.proceed();
}
Battle.prototype.turnEnd = function() {
  this.game.player.movable = true;
  this.enemies.forEach(function(enemy) {
    enemy.movable = true;
  });
}
