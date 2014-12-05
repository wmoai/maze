var map = require('./map');

var User = function(socket) {
  this.socket = socket;
  this.x = 1;
  this.y = 1;
  this.dir = 0;

  this.battle = false;
  this.encount = 4;
}
User.prototype.willWalk = function() {
  var nx = this.x
    , ny = this.y;
  switch(this.dir) {
    case 0:
      ny++;
    break;
    case 1:
      nx++;
    break;
    case 2:
      ny--;
    break;
    case 3:
      nx--;
    break;
  }
  return [nx, ny];
}
User.prototype.walk = function() {
  if (this.battle) {
    return;
  }
  var npt = this.willWalk();
  if (map.isMovable(npt[0], npt[1])) {
    switch(this.dir) {
      case 0:
        this.y++;
      break;
      case 1:
        this.x++;
      break;
      case 2:
        this.y--;
      break;
      case 3:
        this.x--;
      break;
    }
  }
  this.look();
}
User.prototype.back = function() {
  if (this.battle) {
    return;
  }
  this.dir += 2;
  this.dir %= 4;
  this.look();
}
User.prototype.left = function() {
  if (this.battle) {
    return;
  }
  this.dir += 3;
  this.dir %= 4;
  this.look();
}
User.prototype.right = function() {
  if (this.battle) {
    return;
  }
  this.dir++;
  this.dir %= 4;
  this.look();
}
User.prototype.look = function() {
  this.socket.emit('view', map.view(this.x, this.y, this.dir));
}


module.exports = User;
