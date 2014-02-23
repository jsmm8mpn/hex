angular.module('hex', [
  'ngRoute',
  'hex.board'
])
.config(['$routeProvider', ($routeProvider) ->
  $routeProvider.when('/main',
    templateUrl: 'view/main'
    controller: MainCtrl
  ).when('/',
    redirectTo: '/main'
  )
])