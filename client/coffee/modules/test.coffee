angular.module('app.test', []).directive('testDir', ['$timeout','testService', ($timeout, testService) ->
  return {
    restrict: 'A'
    templateUrl: 'view/templates/test'
    link: (scope, elem, attrs) ->
      testService.sayHello()
  }
])
.factory('testService', ->

  return {
    sayHello: ->
      console.log('hello')
  }
)

