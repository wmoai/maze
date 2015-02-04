var fs = require('fs')
  , csv = require('csv')
;


var map = [];
module.exports.init = function() {
  var str = fs.readFileSync('map.csv', 'utf8');
  csv.parse(str, function(err, arr) {
    map = arr.map(function(line) {
      return line.map(function(val) { 
        return parseInt(val);
      });
    });
  });
}


module.exports.view = function(px, py, dir) {
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
  return view;
}

module.exports.isMovable = function(x, y) {
  return map[x][y] == 0;
}

module.exports.event = function(x, y) {
  if (x == 10 && y == 15) {
    return function() {
      return 'goal !';
    }
  }
}


