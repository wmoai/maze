$(function() {

  var baseWidth = 17
  , baseHeight = 17;

  var dirStr = ['北','東','南','西'];

  var generateMap = function(width, height) {
    var map = [];
    for (var i=1; i<=width; i++) {
      var line = [];
      for (var j=1; j<=height; j++) {
        if (i==1 || i==width || j==1 || j==height) {
          line.push(1);
        } else {
          line.push(0);
        }
      }
      map.push(line);
    }

    map = generateWall(map);
    return map;
  }

  var generateWall = function(map) {
    var settable = [];
    for (var x=0; x<map.length/2; x++) {
      for (var y=0; y<map[0].length/2; y++) {
        if (map[x*2][y*2] == 0) {
          settable.push([x*2, y*2]);
        }
      }
    }
    if (settable.length < ((baseWidth-3)/2*(baseHeight-3)/2)/10) {
      return map;
    }

    var set = settable[Math.floor(Math.random() * settable.length)];
    var rx = set[0],
    ry = set[1]
    ;

    map[rx][ry] = 2;
    while (true) {
      movable = [];
      if (rx+2 < map.length && map[rx+2][ry] != 2) {
        movable.push([2, 0]);
      }
      if (rx-2 >= 0 && map[rx-2][ry] != 2) {
        movable.push([-2, 0]);
      }
      if (ry+2 < map[0].length && map[rx][ry+2] != 2) {
        movable.push([0, 2]);
      }
      if (ry-2 >= 0 && map[rx][ry-2] != 2) {
        movable.push([0, -2]);
      }

      if (movable.length == 0) {
        for (var x=0; x<map.length; x++) {
          for (var y=0; y<map[0].length; y++) {
            if(map[x][y] > 1) {
              map[x][y] = 0;
            }
          }
        }
        break;
      }
      var dxy = movable[Math.floor(Math.random() * movable.length)];
      var dx = dxy[0];
      var dy = dxy[1];
      map[rx + dx / 2][ry + dy / 2] = 2;
      rx += dx;
      ry += dy;

      if (map[rx][ry] == 1) {
        for (var x=0; x<map.length; x++) {
          for (var y=0; y<map[0].length; y++) {
            if(map[x][y] > 1) {
              map[x][y] = 1;
            }
          }
        }
        break;
      }
      map[rx][ry] = 2;
    }

    for (var x=0; x<map.length/2; x++) {
      for (var y=0; y<map[0].length/2; y++) {
        if (map[x*2][y*2] == 0) {
          map = generateWall(map);
        }
      }
    }
    return map;
  }

  var map = generateMap(baseWidth, baseHeight);

  var Chara = function() {
    this.x = 1;
    this.y = 1;
    this.dir = 0;
    this.goal = {
      x: baseWidth-2,
      y: baseHeight-2
    };
    this.steps = 0;
    this.start = new Date();
    this.drawer = getDrawer();
    this.hints = 3;
    $('#hints').html(this.hints);
  }
  Chara.prototype.view = function() {
    var px = this.x
    , py = this.y
    , dir = this.dir
    ;
    var view = [];
    if (dir == 0) {
      for (var y=0; y<3; y++) {
        var line = [];
        for(var x=-1; x<2; x++) {
          if (map[px + x] != undefined && map[px + x][py + y] != undefined) {
            line.push(map[px + x][py + y]);
          } else {
            line.push(1);
          }
        }
        view.push(line);
      }
    } else if (dir == 2) {
      for (var y=0; y>-3; y--) {
        var line = [];
        for (var x=1; x>-2; x--) {
          if (map[px + x] != undefined && map[px + x][py + y] != undefined) {
            line.push(map[px + x][py + y]);
          } else {
            line.push(1);
          }
        }
        view.push(line);
      }
    } else if (dir == 1) {
      for (var x=0; x<3; x++) {
        var line = [];
        for (var y=1; y>-2; y--) {
          if (map[px + x] != undefined && map[px + x][py + y] != undefined) {
            line.push(map[px + x][py + y]);
          } else {
            line.push(1);
          }
        }
        view.push(line);
      }
    } else if (dir == 3) {
      for (var x=0; x>-3; x--) {
        var line = [];
        for (var y=-1; y<2; y++) {
          if (map[px + x] != undefined && map[px + x][py + y] != undefined) {
            line.push(map[px + x][py + y]);
          } else {
            line.push(1);
          }
        }
        view.push(line);
      }
    }
    this.drawer.map(view);
  }
  Chara.prototype.walk = function() {
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
    $('#console').html('');
    if (map[nx][ny] == 0) {
      this.x = nx;
      this.y = ny;
      this.view();
      this.steps++;
    }
    if (!this.end && this.x == this.goal.x && this.y == this.goal.y) {
      this.end = true;
      var time = Math.floor((new Date() - this.start) / 1000);
      var score = baseWidth * baseHeight - this.steps - time;
      $('#score').html('ゴール！<br>スコア：'+score);
    }
  }
  Chara.prototype.left = function() {
    this.dir += 3;
    this.dir %= 4;
    this.view();
  }
  Chara.prototype.right = function() {
    this.dir++;
    this.dir %= 4;
    this.view();
  }
  Chara.prototype.back = function() {
    this.dir += 2;
    this.dir %= 4;
    this.view();
  }
  Chara.prototype.hint = function(code) {
    if (this.hints > 0) {
      var north = this.goal.y - this.y;
      var sn = (north >= 0) ? '北' : '南';
      var east = this.goal.x - this.x;
      var ew = (east >= 0) ? '東' : '西';
      $('#console').html(dirStr[this.dir]+'を向いている<br>ゴールは'+sn+'に'+Math.abs(north)
                         +'、'+ew+'に'+Math.abs(east));
      this.hints--;
      $('#hints').html(this.hints);
    }
  }

  var chara = new Chara();
  chara.view();

  $('html').on('keyup', function(e) {
    switch(e.keyCode) {
      case 37:
        chara.left();
      break;
      case 38:
        chara.walk();
      break;
      case 39:
        chara.right();
      break;
      case 40:
        chara.back();
      break;
      case 49:
        chara.hint();
      break;
    }
  });

});
