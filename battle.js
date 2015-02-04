var Chara = require('./chara');

var Battle = function(socket, user) {
  this.socket = socket
  this.enemies = [];
  this.enemies.push({
    hp: 30,
    dmg: 10
  });
}

