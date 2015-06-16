var express = require('express')
  , app = express()
  , server = require('http').createServer(app).listen(3000)
;

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res) {
  res.render('maze');
});



