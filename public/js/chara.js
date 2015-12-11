var Chara = function() {
  this.hp = 50;
  this.maxHp = 100;
  this.str = 1;
  this.inventory = [
    new Dagger("iron dagger", 1),
    new Shield("glove", 1),
    new Medicine(),
    new Medicine(),
    new Medicine()
  ];
}
Chara.prototype.getHpPercentile = function() {
  return Math.floor(this.hp / this.maxHp * 100);
}
Chara.prototype.cure = function(val) {
  if (val%1 === 0) {
    this.hp += val
    this.hp = Math.min(this.hp, this.maxHp);
  }
}

