var Cure = function(name) {
  this.name = name;
  this.val = 5;
}
Cure.prototype.field = function(user) {
  user.hp += this.val;
  user.cure('キュアの魔法！', this.val);
}
Cure.prototype.battle = function(battle, cb) {
  // attack
  // rainforce
  // cure
  battle.user.cure('キュアの魔法！', this.val);

  cb(true);
}

module.exports = Cure;
