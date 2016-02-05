var fs = require('fs');
var geoData = [];

var obj = {};
var hex = '';
var color = '';

fs.readFile(__dirname + '/rawColors.txt', 'utf-8', function (err, data) {
  data.toString().split('\n').forEach(function (line, index, arr) {
      if (index === arr.length - 1 && line === '') { return; }

      var info = line.split('\t');
      rgb = info[2].slice(1, info[2].length - 1);
      hex = info[1];
      name = info[0];

      obj[name] = {
        hex:hex,
        rgb:rgb,
      };
    });

  console.log(JSON.stringify(obj));
});
