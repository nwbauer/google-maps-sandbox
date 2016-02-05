var mapApp = angular.module('spotz', ['ui.router','spotz.map'])

.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('dashboard', {
      url: '/map',
      templateUrl: '/map/map.html',
      controller: 'mapCtrl',
    });

  $urlRouterProvider.otherwise('/map');
});
