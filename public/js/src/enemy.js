let Chara = require('./chara');

class Enemy extends Chara {
  constructor(name, hp, atk, dff, action) {
    super(name, hp, atk, dff);
    this.action = action;
  }
}

class Naive extends Enemy {
  constructor(name, hp, atk, dff) {
    super(name, hp, atk, dff, function(game) {
      return this.attack(game.player);
    });
  }
}

class MudMouse extends Naive {
  constructor() {
    super("泥鼠", 15, 6, 0);
  }
}


class Whim extends Enemy {
  constructor(name, hp, atk, dff, stop) {
    super(name, hp, atk, dff, function(game) {
      if (Math.random() * 100 < stop) {
        return [this.name + "は様子を見ている"];
      }
      return this.attack(game.player);
    });
  }
}

class BigWorm extends Whim {
  constructor() {
    super("大ミミズ", 12, 6, 0, 30);
  }
}
class TalonBat extends Whim {
  constructor() {
    super("鉤爪コウモリ", 11, 7, 2, 20);
  }
}
class ReceiptLizard extends Whim {
  constructor() {
    super("レシートリザード", 20, 15, 3, 50);
  }
}

exports.bigWorm = BigWorm;
exports.talonBat = TalonBat;
exports.mudMouse = MudMouse;
exports.receiptLizard = ReceiptLizard;
