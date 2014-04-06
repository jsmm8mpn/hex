(function() {

  angular.module('hex', ['ngRoute', 'hex.board', 'hex.panzoom', 'hex.editor']).config([
    '$routeProvider', function($routeProvider) {
      return $routeProvider.when('/main', {
        templateUrl: 'view/main',
        controller: MainCtrl
      })
        .when('/edit', {
          templateUrl: 'view/edit',
          controller: EditCtrl
        })
        .when('/edit/:name', {
          templateUrl: 'view/edit',
          controller: EditCtrl
        })
        .when('/', {
          redirectTo: '/main'
        });
    }
  ])

    .value('tiles',{
      water: '#0000FF',
      grass: '#6C6',
      hill: '#FF0000',
      mtn: '#000000',
      desert: '#FFFFFF'
    });

}).call(this);
