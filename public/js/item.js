var Item = function(name, atk, dff, equipment, remaining, effect) {
  this.name = name;
  this.atk = atk;
  this.dff = dff;
  this.equipment = equipment;
  this.remaining = remaining;
  this.effect = effect;

  this.equiped = false;
}
Item.prototype.use = function(game, chara, enemy) {
  if (!this.equipment) {
    this.remaining--;
  }
  if (this.effect) {
    this.effect(game, chara, enemy);
  }
}
Item.prototype.isExpended = function() {
  if (!this.equipment && this.remaining <= 0) {
    return true;
  }
  return false;
}

var Equipment = function(name, atk, dff) {
  Item.call(this, name, atk, dff, true, 0, function(game, chara) {
    var exists = false;
    var count = 0;
    var self = this;
    chara.inventory.forEach(function(item) {
      if (self == item) {
        exists = true;
      }
      if (item.equiped) {
        count++;
      }
    });
    if (exists && (count < 2 || this.equiped)) {
      this.equiped = !this.equiped;
      if (this.equiped) {
        game.console(this.name + "を装備した");
      } else {
        game.console(this.name + "を外した");
      }

    }
  });
}
Equipment.prototype = new Item();

var Dagger = function(name, sharpness) {
  Equipment.call(this, name, 1+sharpness, 1);
}
Dagger.prototype = new Equipment();

var Shield = function(name, hardness) {
  Equipment.call(this, name, 1, 1+hardness);
}
Shield.prototype = new Equipment();

var Medicine = function(name, efficacy) {
  Item.call(this, name, 0, 0, false, 1, function(game, chara) {
    chara.cure(efficacy);
    game.console("傷を手当てした");
  });
}
Medicine.prototype = new Item();

