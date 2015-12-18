var Enemy = function(name, hp, atk, dff, action) {
  Chara.call(this, name, hp, atk, dff);
  this.action = action;
}
Enemy.prototype = new Chara();


var Naive = function(name, hp, atk, dff) {
  Enemy.call(this, name, hp, atk, dff, function(game) {
    return this.attack(game.player);
  });
}
Naive.prototype = new Enemy();

var MudMouse = function() {
  Naive.call(this, "泥鼠", 15, 6, 0);
}
MudMouse.prototype = new Naive();



var Whim = function(name, hp, atk, dff, stop) {
  Enemy.call(this, name, hp, atk, dff, function(game) {
    if (Math.random() * 100 < stop) {
      return [this.name + "は様子を見ている"];
    }
    return this.attack(game.player);
  });
}
Whim.prototype = new Enemy();

var BigWorm = function() {
  Whim.call(this, "大ミミズ", 12, 6, 0, 30);
}
BigWorm.prototype = new Whim();
var TalonBat = function() {
  Whim.call(this, "鉤爪コウモリ", 11, 7, 2, 20);
}
TalonBat.prototype = new Whim();
var ReceiptLizard = function() {
  Whim.call(this, "レシートリザード", 20, 15, 3, 50);
}
ReceiptLizard.prototype = new Whim;


