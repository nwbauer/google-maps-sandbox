angular.module('MapServices', ['AdminServices'])

.factory('MapFactory', ['$http', '$window', '$timeout', 'KeyFacory', function ($http, $window, $timeout, KeyFacory) {

  var factory = {};
  var street = [];
  var streets = [];
  var infowindow = {};
  var colors = {};
  var colorOptions = [];

  factory.map = {};

  factory.loadColors = function (callback) {
    return $http({
      method:'GET',
      url:'http://localhost:3000/map/colors.json',
    })
    .success(function (data) {
      console.log('colors loaded!', data);
      colors = data;
      colorOptions = Object.keys(colors);
      callback(data);
    });
  };

  factory.fetchParkingZones = function () {
    $http({
      method:'GET',
      url:'http://localhost:3000/datr',
    })
    .success(function (data, status, headers, config) {

      console.log('got em',data);

      data.forEach(function (poly) {
        console.log(poly);
        var p = {
          type: 'Feature',
          properties:{
            parkingCode:poly.parkingCode,
          },
          geometry:{
            type: 'MultiPolygon',
            coordinates: [poly.coordinates],
          },
        };
        map.data.addGeoJson(p);
      });

      var parkingColor = {};
      var zoneCounter = 0;

      var colorGenerator = function (parkingCode) {
        var randomColor = colorOptions[Math.round(colorOptions.length * Math.random())];
        return colors[randomColor].rgb;
      };

      var parkingCode;

      map.data.setStyle(function (feature) {
        parkingCode = feature.getProperty('parkingCode');

        if (!parkingColor[parkingCode]) {
          parkingColor[parkingCode] = colorGenerator(parkingCode);
          console.log(zoneCounter, parkingCode, parkingColor[parkingCode]);
          zoneCounter++;
        }

        polyColor = parkingColor[parkingCode];

        return ({
           strokeColor: 'rgb(' + polyColor + ')',
           fillColor:'rgba(' + polyColor + ', 0.7)',
           strokeWeight: 1,
         });
      });

      map.data.addListener('mouseover', function (event, other) {
        test = event;
        infowindow.setContent(event.feature.R.parkingCode, event);
        infowindow.setPosition(event.latLng);
        infowindow.open(map);

        console.log(event.feature.R.parkingCode);
      });

    });
  };

  factory.init = function () {
    console.log('setting up the map',  KeyFacory.map);

    //jsonp
    $http.jsonp('https://maps.googleapis.com/maps/api/js?key=' + KeyFacory.map + '&callback=JSON_CALLBACK').
    success(function (data, status, headers, config) {

      console.log('creating map', document.getElementById('map').toString());
      this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: { lat: 37.86834903305901, lng: -122.27156639099121 },
      });

      infowindow = new google.maps.InfoWindow();

      map.data.setStyle({
        strokeWeight: 5,
      });

      map.addListener('click', function (event) {
        lastClick = event;
        var coordinates = [event.latLng.lng(), event.latLng.lat()];
        console.log(coordinates);

        street.push(coordinates);
        streets.push(coordinates);

        if (street.length === 2) {
          //show the segment
          console.log(JSON.stringify(street));

          //line
          var f = {
            type: 'Feature',
            properties:{},
            geometry:{
              type:'LineString',
              coordinates: street.slice(),
            },
          };

          //data format line = [ [point 1], [point 2], ....]
          map.data.addGeoJson(f);

          //polygon
          var copy = streets.slice();
          copy.push(streets[0].slice());    //add endpoint
          console.log(copy);

          var p = {
            type: 'Feature',
            properties:{},
            geometry:{
              type: 'Polygon',
              coordinates: [copy],
            },
          };

          // data format polygon = [ [line 1], [line 2], ....]
          map.data.addGeoJson(p);
          street = [];
        }
      });

    }).
    error(function (data, status, headers, config) {
      console.log('map load failed', data);
    });
  };

  return factory;
}]);
