var Battle = function(game) {
  this.game = game;
  this._engage();

  this.field = [null, null, null];
}
Battle.prototype._engage = function() {
  var tables = [
    [ BigWorm, TalonBat, MudMouse ],
    [ BigWorm, TalonBat, MudMouse , ReceiptLizard ]
  ];
  var enemyCount = Math.floor(Math.random() * 3 + 1);
  this.enemies = [];
  var table = tables[this.game.depth];
  for (var i=0; i<enemyCount; i++) {
    var enemy = new table[Math.floor(Math.random() * table.length)];
    this.enemies.push(enemy);
  }
  var game = this.game;
  this.enemies.forEach(function(enemy) {
    game.addMessage([enemy.name + "があらわれた"]);
  });
}
Battle.prototype.action = function(index, item) {
  if (this.game.player.movable) {
    if (index == undefined) {
      return;
    } else if (item == null) {
      this.attack(index);
    } else {
      // arg [item] given, so use item
    }
  } else {
    this.enemyTurn(index);
  }
}
Battle.prototype.attack = function(index) {
  var player = this.game.player;
  var target = this.enemies[index];
  this.game.addMessage(player.attack(target));
  if (target.isDead()) {
    this.enemies.splice(index, 1);
  }
  if (this.enemies.length == 0) {
    this.game.messages.push(["敵はいなくなった"]);
    this.end = true;
  } else {
    player.movable = false;
  }
}
Battle.prototype.enemyTurn = function(index) {
  var self = this;
  var moved = false;
  var end = true;
  this.enemies.forEach(function(enemy) {
    if (!moved && enemy.movable) {
      self.game.addMessage(enemy.action(self.game));
      enemy.movable = false;
      moved = true;
    }
    end = end && !enemy.movable;
  });
  if (end) {
    self.turnEnd();
  }
}
Battle.prototype.turnEnd = function() {
  this.game.player.movable = true;
  this.enemies.forEach(function(enemy) {
    enemy.movable = true;
  });
}
