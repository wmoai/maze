var Drawer = function() {
  this.canvas = document.getElementById('view');
  this.dx = this.canvas.width / 16;
  this.dy = this.canvas.height / 16;
}
Drawer.prototype.getMonoColor = function(val) {
  return 'rgb('+val+','+val+','+val+')';
}
Drawer.prototype.px = function(x) {
  return x*this.dx;
}
Drawer.prototype.py = function(y) {
  return y*this.dy;
}
Drawer.prototype.drawWall = function(ctx, x, y, w, h, sw, sh, depth) {
  ctx.fillStyle = this.getMonoColor(140 / 10 * (10-depth*2));
  ctx.fillRect(this.px(x), this.py(y), this.px(w), this.py(h));
  if (sw != 0 && sh != 0) {
    var bx = x;
    if (sw > 0) {
      bx = x + w;
    }
    ctx.fillStyle = this.getMonoColor(90 / 10 * (10-depth*2));
    ctx.beginPath();
    ctx.moveTo(this.px(bx), this.py(y));
    ctx.lineTo(this.px(bx+sw), this.py(y+sh));
    ctx.lineTo(this.px(bx+sw), this.py(y+h-sh));
    ctx.lineTo(this.px(bx), this.py(y+h));
    ctx.closePath();
    ctx.fill();
  }
}
Drawer.prototype.view = function(view) {
  var self = this;
  canvas = document.getElementById('view');
  var ctx = canvas.getContext('2d');

  ctx.beginPath();
  ctx.fillStyle = 'rgb(50, 50, 50)';
  ctx.fillRect(0,0,self.px(16),self.py(16));
  setTimeout(function() {
    ctx.fillStyle = 'rgb(50, 50, 50)';
    ctx.fillRect(0,0,self.px(16),self.py(16));

    ctx.fillStyle = 'rgb(40, 40, 40)';
    ctx.fillRect(0,self.py(3),self.px(16),self.py(10));

    ctx.fillStyle = 'rgb(30, 30, 30)';
    ctx.fillRect(0,self.py(5),self.px(16),self.py(6));

    ctx.fillStyle = 'rgb(20, 20, 20)';
    ctx.fillRect(0,self.py(6),self.px(16),self.py(4));
    self.drawWall(ctx, 0, 5, 0, 6, 2, 1, 3.5);
    self.drawWall(ctx, 16, 5, 0, 6, -2, 1, 3.5);

    if (view[3][Math.floor(view[3].length/2)-1]) {
      self.drawWall(ctx, 2, 6, 4, 4, 1, 1, 3.5);
    }
    if (view[3][Math.floor(view[3].length/2)+1]) {
      self.drawWall(ctx, 10, 6, 4, 4, -1, 1, 3.5);
    }
    if (view[3][Math.floor(view[3].length/2)]) {
      self.drawWall(ctx, 6, 6, 4, 4, 0, 0, 3);
    }

    if (view[2][Math.floor(view[3].length/2)-1]) {
      self.drawWall(ctx, 0, 5, 5, 6, 1, 1, 2.5);
    }
    if (view[2][Math.floor(view[3].length/2)+1]) {
      self.drawWall(ctx, 11, 5, 5, 6, -1, 1, 2.5);
    }
    if (view[2][Math.floor(view[3].length/2)]) {
      self.drawWall(ctx, 5, 5, 6, 6, 0, 0, 2);
    }

    if (view[1][Math.floor(view[3].length/2)-1]) {
      self.drawWall(ctx, 0, 3, 3, 10, 2, 2, 1.5);
    }
    if (view[1][Math.floor(view[3].length/2)+1]) {
      self.drawWall(ctx, 13, 3, 3, 10, -2, 2, 1.5);
    }
    if (view[1][Math.floor(view[3].length/2)]) {
      self.drawWall(ctx, 3, 3, 10, 10, 0, 0, 1);
    }

    if (view[0][Math.floor(view[3].length/2)-1]) {
      self.drawWall(ctx, 0, 0, 0, 16, 3, 3, 0.5);
    }
    if (view[0][Math.floor(view[3].length/2)+1]) {
      self.drawWall(ctx, 16, 0, 0, 16, -3, 3, 0.5);
    }
  } ,10);
}
Drawer.prototype.map = function(map) {
  canvas = document.getElementById('view');
  var ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.fillStyle = 'rgb(20, 20, 20)';
  ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

  var width = map.known.length;
  var height = map.known[0].length;

  var u = Math.min(this.canvas.width / width, this.canvas.height / height);

  ctx.fillStyle = 'rgb(120, 120, 150)';
  for (var i=0; i<width; i++) {
    for (var j=0; j<height; j++) {
      if (map.known[i][height-1-j] != 1) {
        ctx.fillRect(i*u, j*u, u, u);
      }
    }
  }
  ctx.fillStyle = 'rgb(220, 220, 220)';
  ctx.fillRect(map.x*u, (height-1-map.y)*u, u, u);
}

