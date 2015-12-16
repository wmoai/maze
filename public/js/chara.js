var Chara = function() {
  this.hp = 50;
  this.maxHp = 100;
  this.str = 1;
  this.inventory = [
    new Dagger("鉄のダガー", 1),
    new Shield("革手袋", 1),
    new Medicine("傷薬", 30),
    new Medicine("傷薬", 30)
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

