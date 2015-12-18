var Battle = function(game) {
  this.game = game;
  this._engage();
}
Battle.prototype._engage = function() {
  var tables = [
    [ BigWorm, TalonBat, MudMouse , ReceiptLizard],
    [ BigWorm, TalonBat, MudMouse ]
  ]
  var enemyCount = Math.floor(Math.random() * 3 + 1);
  this.enemies = [];
  var table = tables[this.game.depth];
  for (var i=0; i<enemyCount; i++) {
    var enemy = new table[Math.floor(Math.random() * table.length)];
    this.enemies.push(enemy);
  }
  var msg = [];
  this.enemies.forEach(function(enemy) {
    msg.push(enemy.name + "があらわれた");
  });
  this.messages = [msg];
}
Battle.prototype.proceed = function(index) {
  if (this.messages.length > 0) {
    var message = this.messages.shift();
    if (this._end && this.messages.length == 0) {
      this.end = true;
      this.game.player.movable = true;
    }
    return message;
  } else if (this.game.player.movable) {
    if (index != undefined) {
      return this.attack(index);
    }
  } else {
    return this.enemyTurn(index);
  }
}
Battle.prototype.attack = function(index) {
  var player = this.game.player;
  var target = this.enemies[index];
  this.messages.push(player.attack(target));
  if (target.isDead()) {
    this.enemies.splice(index, 1);
  }
  if (this.enemies.length == 0) {
    this.messages.push(["敵はいなくなった"]);
    this._end = true;
  }
  player.movable = false;
  return this.proceed(index);
}
Battle.prototype.enemyTurn = function(index) {
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
  return this.proceed(index);
}
Battle.prototype.turnEnd = function() {
  this.game.player.movable = true;
  this.enemies.forEach(function(enemy) {
    enemy.movable = true;
  });
}
