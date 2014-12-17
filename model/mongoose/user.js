var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
;

var schema = new Schema({
  name: String,
  password_hash: String,
  password_solt: String
});

module.exports = mongoose.model('user', schema);
