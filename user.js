

var User = function() {
  this.x = 1;
  this.y = 1;
  this.dir = 0;
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
User.prototype.back = function() {
    this.dir += 2;
    this.dir %= 4;
}
User.prototype.left = function() {
  this.dir += 3;
  this.dir %= 4;
}
User.prototype.right = function() {
  this.dir++;
  this.dir %= 4;
}


module.exports = User;
