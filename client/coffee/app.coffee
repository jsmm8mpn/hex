angular.module('hex', ['myDir']).config(['$routeProvider', ($routeProvider) ->
  $routeProvider.when('/main',
    templateUrl: 'view/main'
    controller: MainCtrl
  ).otherwise({
    redirectTo: '/main'

  })
])