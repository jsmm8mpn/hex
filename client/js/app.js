(function() {

  angular.module('hex', ['ngRoute', 'hex.board']).config([
    '$routeProvider', function($routeProvider) {
      return $routeProvider.when('/main', {
        templateUrl: 'view/main',
        controller: MainCtrl
      }).when('/', {
          redirectTo: '/main'
        });
    }
  ]);

}).call(this);
