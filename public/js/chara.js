var Chara = function(name, hp, atk, dff) {
  this.name = name;
  this.hp = hp;
  this.maxHp = hp;
  this.atk = atk;
  this.dff = dff;
  this.inventory = [];
  this.movable = true;
}
Chara.prototype.cure = function(val) {
  if (val%1 === 0) {
    this.hp += val
    this.hp = Math.min(this.hp, this.maxHp);
  }
}
Chara.prototype.getAtk = function() {
  var val = this.atk;
  var count = 0;
  this.inventory.forEach(function(item) {
    if (count < 2 && item.equipment && item.equiped) {
      val += item.atk;
    }
  });
  return val;
}
Chara.prototype.getDff = function() {
  var val = this.dff;
  var count = 0;
  this.inventory.forEach(function(item) {
    if (count < 2 && item.equipment && item.equiped) {
      val += item.dff;
    }
  });
  return val;
}
Chara.prototype.attack = function(target) {
  var base = this.getAtk() / 2 - target.getDff() / 4;
  var rnd = Math.floor(Math.random() * 3) - 1;
  var dmg = Math.floor(base * (8+rnd) / 8 + rnd);
  target.hp -= dmg;
  target.hp = Math.max(target.hp, 0);
  var msg = [
    this.name + "の攻撃",
    target.name + "に" + dmg + "のダメージ"
  ];
  if (target.isDead()) {
    msg.push(target.name + "は死んだ");
  }
  return msg;
}
Chara.prototype.isDead = function() {
  return (this.hp <= 0);
}



var Player = function() {
  Chara.call(this, "あなた", 20, 10, 0);
  this.inventory = [
    new Dagger("鉄のダガー", 1),
    new Shield("革手袋", 1),
    new Medicine("傷薬", 20),
    new Medicine("傷薬", 20)
  ];
}
Player.prototype = new Chara();

Player.prototype.getHpPercentile = function() {
  return Math.floor(this.hp / this.maxHp * 100);
}

