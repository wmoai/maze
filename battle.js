var Chara = require('./chara');

var Battle = function(socket, ally) {
  this.socket = socket
  this.ally = ally;
  this.enemy = new Chara('teki', 32, 18, 10, 9);
}
Battle.prototype.command = function() {
  this.socket.emit('battle command', ['atk','esc']);
}
Battle.prototype.run = function(cmd) {

}
