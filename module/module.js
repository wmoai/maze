var Module = function(name) {
  this.name = name;
}
Module.prototype.field = function(user) {
  user.socket.emit('log', user.x + ":" + user.y);
}
Module.prototype.battle = function(battle, cb) {
  // attack
  // rainforce
  // cure
  battle.attack();

  cb(true);
}

module.exports = Module;
