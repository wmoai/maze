let Item = require('./item');

class Chara {
  constructor(name, hp, atk, dff) {
    this.name = name;
    this.hp = hp;
    this.maxHp = hp;
    this.atk = atk;
    this.dff = dff;
    this.inventory = [];
    this.movable = true;
  }
  cure(val) {
    this.hp += val
    this.hp = Math.min(this.hp, this.maxHp);
  }
  getAtk() {
    var val = this.atk;
    var count = 0;
    this.inventory.forEach(function(item) {
      if (count < 2 && item.equipment && item.equiped) {
        val += item.atk;
      }
    });
    return val;
  }
  getDff() {
    var val = this.dff;
    var count = 0;
    this.inventory.forEach(function(item) {
      if (count < 2 && item.equipment && item.equiped) {
        val += item.dff;
      }
    });
    return val;
  }
  attack(target, atk) {
    atk = atk || 0;
    var base = (this.getAtk() + atk) / 2 - target.getDff() / 4;
    base = Math.max(0, base);
    var rnd = Math.floor(Math.random() * 3) - 1;
    var dmg = Math.floor(base * (8+rnd) / 8 + rnd);
    dmg = Math.max(0, dmg);
    target.hp -= dmg;
    target.hp = Math.max(target.hp, 0);
    var msg = [this.name + "の攻撃"];
    if (dmg > 0) {
      msg.push(target.name + "に" + dmg + "のダメージ");
    } else {
      msg.push("ミス！" + target.name + "はダメージを受けない");
    }
    if (target.isDead()) {
      msg.push(target.name + "は死んだ");
    }
    return msg;
  }
  isDead() {
    return (this.hp <= 0);
  }
}


module.exports = Chara;
