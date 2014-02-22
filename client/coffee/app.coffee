angular.module('hex', [
  'ngRoute',
  'app.test'
])
.config(['$routeProvider', ($routeProvider) ->
  $routeProvider.when('/main',
    templateUrl: 'view/main'
    controller: MainCtrl
  ).when('/',
    redirectTo: '/main'
  )
])