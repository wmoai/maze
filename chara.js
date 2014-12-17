var Chara = function(name, hp, atk, dff, agl) {
  this.name = name;
  this.hp = hp;
  this.atk = atk;
  this.dff =dff;
  this.agl = agl;
}
Chara.prototype.attacked = function(atk) {
  var damage = atk - this.dff;
  if (damage < 0) {
    damage = 0;
  }
  this.hp -= damage;
}
Chara.prototype.alive = function() {
  return this.hp > 0;
}

module.exports = Chara;
