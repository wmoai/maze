var _drawer = null;
var getDrawer = function() {
  if (_drawer) {
    return _drawer;
  }
  var canvas = document.getElementById('view');
  var dx = canvas.width / 16;
  var dy = canvas.height / 16;

  function wallColor(val) {
    return 'rgb('+val+','+val+','+val+')';
  }

  function wall(ctx, x, y, w, h, sw, sh, depth) {
    ctx.fillStyle = wallColor(150 / 10 * (10-depth));
    ctx.fillRect(px(x), py(y), px(w), py(h));
    if (sw != 0 && sh != 0) {
      var bx = x;
      if (sw > 0) {
        bx = x + w;
      }
      ctx.fillStyle = wallColor(100 / 10 * (10-depth));
      ctx.beginPath();
      ctx.moveTo(px(bx), py(y));
      ctx.lineTo(px(bx+sw), py(y+sh));
      ctx.lineTo(px(bx+sw), py(y+h-sh));
      ctx.lineTo(px(bx), py(y+h));
      ctx.closePath();
      ctx.fill();
    }
  }

  function px(x) {
    return x*dx;
  }
  function py(y) {
    return y*dy;
  }

  _drawer = {};
  _drawer.map = function(map) {
    canvas = document.getElementById('view');
    var ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.fillStyle = 'rgb(50, 50, 50)';
    ctx.fillRect(0,0,px(16),py(16));

    ctx.fillStyle = 'rgb(20, 20, 20)';
    ctx.fillRect(0,py(7),px(16),py(2));

    if (map[3][Math.floor(map[3].length/2)-1]) {
      wall(ctx, 3, 6, 3, 4, 1, 1, 3);
    }
    if (map[3][Math.floor(map[3].length/2)+1]) {
      wall(ctx, 10, 6, 3, 4, -1, 1, 3);
    }
    if (map[3][Math.floor(map[3].length/2)]) {
      wall(ctx, 6, 6, 4, 4, 0, 0, 3);
    }

    if (map[2][Math.floor(map[3].length/2)-1]) {
      wall(ctx, 0, 5, 5, 6, 1, 1, 2);
    }
    if (map[2][Math.floor(map[3].length/2)+1]) {
      wall(ctx, 11, 5, 5, 6, -1, 1, 2);
    }
    if (map[2][Math.floor(map[3].length/2)]) {
      wall(ctx, 5, 5, 6, 6, 0, 0, 2);
    }

    if (map[1][Math.floor(map[3].length/2)-1]) {
      wall(ctx, 0, 3, 3, 10, 2, 2, 1);
    }
    if (map[1][Math.floor(map[3].length/2)+1]) {
      wall(ctx, 13, 3, 3, 10, -2, 2, 1);
    }
    if (map[1][Math.floor(map[3].length/2)]) {
      wall(ctx, 3, 3, 10, 10, 0, 0, 1);
    }

    if (map[0][Math.floor(map[3].length/2)-1]) {
      wall(ctx, 0, 0, 0, 16, 3, 3, 0);
    }
    if (map[0][Math.floor(map[3].length/2)+1]) {
      wall(ctx, 16, 0, 0, 16, -3, 3, 0);
    }
  };
  return _drawer;
};


