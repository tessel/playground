var express = require('express')

var app = express()

app.set('view engine', 'jade');

app.get('/', function (req, res) {
  res.render('index', {
  	title: 'Hello',
  	message: 'Hi there!'
  });
})

app.use(express.static('public'));
app.use(express.static('build'));

var server = app.listen(3000, function () {
  var host = server.address().address == '::' ? 'localhost' : '';
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})
