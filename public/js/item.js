var Item = function(name, atk, dff, equipment, remaining, effect) {
  this.name = name;
  this.atk = atk;
  this.dff = dff;
  this.equipment = equipment;
  this.remaining = remaining;
  this.effect = effect;

  this.equiped = false;
}
Item.prototype.use = function(chara, target) {
  if (!this.equipment) {
    this.remaining--;
  }
  if (this.effect) {
    this.effect(chara, target);
  }
}
Item.prototype.isExpended = function() {
  if (!this.equipment && this.remaining <= 0) {
    return true;
  }
  return false;
}

var Equipment = function(name, atk, dff) {
  Item.call(this, name, atk, dff, true, 0, function(chara) {
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

var Medicine = function() {
  Item.call(this, "medicine", 0, 0, false, 1, function(chara, target) {
    chara.cure(30);
  });
}
Medicine.prototype = new Item();

