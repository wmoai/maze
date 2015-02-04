var Sword = function(name, dmg) {
  this.name = name;
  this.dmg = dmg;
}

Sword.prototype.battle = function(user, victim) {
  victime.hp -= 5 + this.dmg;
}
