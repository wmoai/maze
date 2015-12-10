var Item = function(name, atk, dff, expendable, effect) {
  this.name = name;
  this.atk = atk;
  this.dff = dff;
  this.expendable = expendable;
  this.effect = effect;
}


var IronSword = function() {
  Item.call(this, "iron sword", 5, 1, false, function(chara, target){
  });
}
IronSword.prototype = new Item();

var Medicine = function() {
  Item.call(this, "medicine", 0, 0, true, function(chara, target) {
    chara.cure(30);
  });
}
Medicine.prototype = new Item();

