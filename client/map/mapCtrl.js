angular.module('spotz.map', ['MapServices'])

.controller('mapCtrl', ['$scope', 'MapFactory', function ($scope, MapFactory) {

  MapFactory.init();

  MapFactory.loadColors(function () {
    MapFactory.fetchParkingZones();
  });

}]);
