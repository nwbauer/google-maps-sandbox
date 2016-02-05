var fs = require('fs');
var geoData = [];
var output = [];

fs.readFile(__dirname + '/rawData.txt', 'utf-8', function (err, data) {
  data.toString().split('\n').forEach(function (line, index, arr) {
      if (index === arr.length - 1 && line === '') { return; }

      var data = line.split('(((');
      var parkingCode = data[0].slice(0,data[0].indexOf(','));
      data[1] = data[1].slice(0, -4); //remove the last 4 characters

      var shapes = data[1].split(')), ((');

      shapes = shapes.map(function (shape) {
        return shape.split(', ');
      });

      var coordinates = shapes.map(function (shape) {
        return shape.map(function (tuple) {
          return tuple.split(' ').map(function (item) {
            return parseFloat(item);
          });
        });
      });

      var obj = {
        index: index,
        parkingCode:parkingCode,
        coordinates:coordinates,
      };
      output.push(obj);
    });

  console.log(JSON.stringify(output));
});

//console.log('here is the filee', JSON.stringify(file));

//var lines = file.toString().split('\n');

//console.log(lines);
