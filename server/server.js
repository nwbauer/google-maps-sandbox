var express = require('express');
var morgan = require('morgan');
var fs = require('fs');

var app = express();
app.use(express.static(__dirname + '/../client'));  //serve files in client
app.use(morgan('combined'));
app.listen(3000);

app.get('/datr', function (req, res, next) {
  fs.createReadStream(__dirname + '/../server/geoJson.json').pipe(res);
});

console.log('listening...');
