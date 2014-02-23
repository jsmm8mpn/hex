angular.module('hex.board', []).directive('board', ['$timeout','testService', ($timeout, testService) ->
  return {
    restrict: 'AC'
    templateUrl: 'view/templates/board'
    link: (scope, elem, attrs) ->
      scope.width = 5
      scope.height = 5
      scope.number = (num) ->
        new Array(num)
  }
])
.directive('tile', ->
  return {
    restrict: 'AC'
    templateUrl: 'view/templates/tile'
    link: (scope, elem, attrs) ->
      console.log('tile')

  }
)
.factory('testService', ->

  return {
    sayHello: ->
      console.log('hello')
  }
)

