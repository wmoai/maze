var Enemy = function(name, hp, atk, dff, action) {
  Chara.call(this, name, hp, atk, dff);
  this.action = action;
}
Enemy.prototype = new Chara();




var Worm = function(name, hp, atk, dff) {
  Enemy.call(this, name, hp, atk, dff, function(game) {
    return this.attack(game.player);
  });
}
Worm.prototype = new Enemy();
