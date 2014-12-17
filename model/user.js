var model = require('../model')
  , crypto = require('crypto')
;

var User = function(name) {
  this.name = name;
}
User.create = function(name, password, callback) {
  if (!(name && password)) {
    callback(new Error('invalid paramerters.'));
    return;
  }
  model.user.findOne({'name': name})
  .exec(function(err, existing) {
    if (existing) {
      callback(new Error('same name user exists.'));
      return;
    }
    var solt = getSha1(String(Math.random()));
    var hash = getSha1(password + solt);

    var user = new model.user;
    user.name = name;
    user.password_hash = hash;
    user.password_solt = solt;
    user.save(function(err) {
      callback(err, new User(name));
    });
  });
}
User.auth = function(name, password, callback) {
  if (!(name && password)) {
    callback(new Error('invalid paramerters.'));
    return;
  }
  model.user.findOne({'name': name})
  .exec(function(err, user) {
    if (err) {
      callback(err);
      return;
    }
    if (!user) {
      callback(new Error('No such user.'));
      return;
    }
    var solt = user.password_solt;
    if (user.password_hash !== getSha1(password + solt)) {
      callback(new Error('invalid username or password.'));
      return;
    }
    callback(null, new User(name));
  });
}
User.find = function(name, callback) {
  model.user.findOne({'name': name})
  .exec(function(err, user) {
    if (err) {
      callback(err);
      return;
    }
    if (!user) {
      callback(new Error('No such user.'));
      return;
    }
    callback(null, new User(name));
  });
}


module.exports = User;

var getSha1 = function(str) {
  var sha1sum = crypto.createHash('sha1')
  sha1sum.update(str);
  return sha1sum.digest('hex');
}



