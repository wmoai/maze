let Chara = require('./chara');
let Item = require('./item');

class Player extends Chara {
  constructor() {
    super("あなた", 20, 10, 0);
    this.inventory = [
      new Item.dagger("鉄のダガー", 2),
      new Item.shield("革手袋", 2),
      new Item.medicine("傷薬", 20),
      new Item.medicine("傷薬", 20)
    ];
  }

  getHpPercentile() {
    return Math.floor(this.hp / this.maxHp * 100);
  }
}

module.exports = Player;

