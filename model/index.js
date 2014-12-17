var fs = require('fs')
  , mongoose = require('mongoose')
;
mongoose.connect('mongodb://localhost/maze');

fs.readdirSync(__dirname + '/mongoose').forEach(function(filename) {
  if (/\.js$/.test(filename)) {
    var name = filename.substr(0, filename.lastIndexOf('.'));
    exports.__defineGetter__(name, function() {
      return require('./mongoose/' + name);
    });
  }
});

