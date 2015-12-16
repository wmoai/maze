var Battle = function(game) {
  this.game = game;
  this.enemies = []; 
}
Battle.prototype.attack = function() {
  var chara = this.game.chara;
  var atk = chara.str
  chara.inventory.forEach(function(item) {
    if (item.equiped) {
      atk += item.atk;
    }
  });
}
