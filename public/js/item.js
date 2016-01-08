var Item = function(name, atk, dff, equipment, remaining, aiming, effect) {
  this.name = name;
  this.atk = atk;
  this.dff = dff;
  this.equipment = equipment;
  this.remaining = remaining;
  this.aiming = aiming;
  this.effect = effect;

  this.equiped = false;
}
Item.prototype.use = function(game, player, enemy) {
  if (!this.equipment) {
    this.remaining--;
  }
  if (this.effect) {
    return this.effect(game, player, enemy);
  }
}
Item.prototype.isExpended = function() {
  if (!this.equipment && this.remaining <= 0) {
    return true;
  }
  return false;
}

var Equipment = function(name, atk, dff) {
  Item.call(this, name, atk, dff, true, 0, false, function(game, player) {
    var exists = false;
    var count = 0;
    var self = this;
    player.inventory.forEach(function(item) {
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
        return [this.name + "を装備した"]
      } else {
        return [this.name + "を外した"]
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
  Item.call(this, name, 0, 0, false, 1, false, function(game, player) {
    player.cure(efficacy);
    return ["傷を手当てした"]
  });
}
Medicine.prototype = new Item();


var Aiming = function(name, remaining, effect) {
  Item.call(this, name, 0, 0, false, remaining, true, effect);
}
Aiming.prototype = new Item();

var Bomb = function(name, damage) {
  Aiming.call(this, name, 1, function(game, target) {

  });
}



