var dirStr = ['北','東','南','西'];

Array.prototype.rotateClockwise = function(times) {
  var buff = this;
  if (Array.isArray(this[0])) {
    times %= 4;
    for (var i=0; i<times; i++) {
      buff.reverse();
      buff = buff[0].map(function(col, i) { 
        return buff.map(function(row) { 
          return row[i] 
        })
      });
    }
  }
  return buff;
}
Array.prototype.sliceSquare = function(start1, count1, start2, count2) {
  if (Array.isArray(this[0])) {
    var result = [];
    for (var x=start1; x<start1+count1; x++) {
      var line = [];
      if (x < 0 || this.length <= x) {
        for (var i=0; i<count2; i++) {
          line.push(1);
        }
      } else {
        for (var y=start2; y<start2+count2; y++) {
          if (y < 0 || this[x].length <= y) {
            line.push(1);
          } else {
            line.push(this[x][y]);
          }
        }
      }
      result.push(line);
    }
    return result;
  }
}

var Map = function(width, height) {
  this.width = width;
  this.height = height;
  this.x = Math.floor(Math.random() * 3) * 2 + 1;
  this.y = Math.floor(Math.random() * 3) * 2 + 1;
  this.dir = Math.floor(Math.random() * 3);
  this.drawer = new Drawer();

  this.array = [];
  for (var i=1; i<=width; i++) {
    var line = [];
    for (var j=1; j<=height; j++) {
      if (i==1 || i==width || j==1 || j==height) {
        line.push(1);
      } else {
        line.push(0);
      }
    }
    this.array.push(line);
  }
  this._generateWall();

  this.known = [];
  for (var i=1; i<=width; i++) {
    var line = [];
    for (var j=1; j<=height; j++) {
      line.push(1)
    }
    this.known.push(line);
  }
  this.view();
}
Map.prototype._generateWall = function() {
  var settable = [];
  for (var x=0; x<this.array.length/2; x++) {
    for (var y=0; y<this.array[0].length/2; y++) {
      if (this.array[x*2][y*2] == 0) {
        settable.push([x*2, y*2]);
      }
    }
  }
  if (settable.length < ((this.width-3)/2*(this.height-3)/2)/10) {
    return;
  }

  var set = settable[Math.floor(Math.random() * settable.length)];
  var rx = set[0],
  ry = set[1];

  this.array[rx][ry] = 2;
  while (true) {
    movable = [];
    if (rx+2 < this.array.length && this.array[rx+2][ry] != 2) {
      movable.push([2, 0]);
    }
    if (rx-2 >= 0 && this.array[rx-2][ry] != 2) {
      movable.push([-2, 0]);
    }
    if (ry+2 < this.array[0].length && this.array[rx][ry+2] != 2) {
      movable.push([0, 2]);
    }
    if (ry-2 >= 0 && this.array[rx][ry-2] != 2) {
      movable.push([0, -2]);
    }

    if (movable.length == 0) {
      for (var x=0; x<this.array.length; x++) {
        for (var y=0; y<this.array[0].length; y++) {
          if(this.array[x][y] > 1) {
            this.array[x][y] = 0;
          }
        }
      }
      break;
    }
    var dxy = movable[Math.floor(Math.random() * movable.length)];
    var dx = dxy[0];
    var dy = dxy[1];
    this.array[rx + dx / 2][ry + dy / 2] = 2;
    rx += dx;
    ry += dy;

    if (this.array[rx][ry] == 1) {
      for (var x=0; x<this.array.length; x++) {
        for (var y=0; y<this.array[0].length; y++) {
          if(this.array[x][y] > 1) {
            this.array[x][y] = 1;
          }
        }
      }
      break;
    }
    this.array[rx][ry] = 2;
  }

  for (var x=0; x<this.array.length/2; x++) {
    for (var y=0; y<this.array[0].length/2; y++) {
      if (this.array[x*2][y*2] == 0) {
        this._generateWall();
      }
    }
  }
}
Map.prototype.view = function() {
  var px = this.x
    , py = this.y
    , dir = this.dir
    ;
  var view = [];
  if (dir == 0) {
    view = this.array.sliceSquare(px-2, 5 ,py  , 4).reverse().rotateClockwise(1);
  } else if (dir == 2) {
    view = this.array.sliceSquare(px-2, 5 ,py-3, 4).reverse().rotateClockwise(3);
  } else if (dir == 1) {
    view = this.array.sliceSquare(px  , 4 ,py-2, 5).reverse().rotateClockwise(2);
  } else if (dir == 3) {
    view = this.array.sliceSquare(px-3, 4 ,py-2, 5).reverse().rotateClockwise(0);
  }
  this.drawer.view(view);
  this.look();
}
Map.prototype.look = function() {
  this.known[this.x][this.y] = this.array[this.x][this.y];
  this.known[this.x-1][this.y] = this.array[this.x-1][this.y];
  this.known[this.x][this.y-1] = this.array[this.x][this.y-1];
  this.known[this.x+1][this.y] = this.array[this.x+1][this.y];
  this.known[this.x][this.y+1] = this.array[this.x][this.y+1];
  this.known[this.x+1][this.y+1] = this.array[this.x+1][this.y+1];
  this.known[this.x-1][this.y+1] = this.array[this.x-1][this.y+1];
  this.known[this.x+1][this.y-1] = this.array[this.x+1][this.y-1];
  this.known[this.x-1][this.y-1] = this.array[this.x-1][this.y-1];
}
Map.prototype.walk = function() {
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
  if (this.array[nx][ny] == 0) {
    this.x = nx;
    this.y = ny;
    this.view();
  }
}
Map.prototype.turnLeft = function() {
  this.dir += 3;
  this.dir %= 4;
  this.view();
}
Map.prototype.turnRight = function() {
  this.dir++;
  this.dir %= 4;
  this.view();
}
Map.prototype.turnBack = function() {
  this.dir += 2;
  this.dir %= 4;
  this.view();
}
Map.prototype.illustrate = function() {
  this.drawer.map(this);
}
Map.prototype._console = function() {
  var str = "";
  this.array.forEach(function(row) {
    row.forEach(function(cell) {
      if (cell==1) {
        str += "@";
      } else {
        str += ".";
      }
    });
    str += "\n";
  });
  console.log(str);
}

