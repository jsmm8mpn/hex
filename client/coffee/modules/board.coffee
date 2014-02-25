angular.module('hex.board', []).directive('board', ['$timeout','testService', ($timeout, testService) ->
  return {
    restrict: 'AC'
    templateUrl: 'view/templates/board'
    link: (scope, elem, attrs) ->
      scope.width = 6
      scope.height = 6
      scope.number = (num) ->
        new Array(num)

      $timeout(->
        hexGrid = new HexGrid(8, 8, 20, 4)
      )


  }
])
.directive('tileDir', ->
  return {
    restrict: 'AC'
    templateUrl: 'view/templates/tile'
    scope: {}
    link: (scope, elem, attrs) ->
      console.log('tile')
      scope.select = ->
        scope.selected = true
  }
)
.factory('testService', ->

  return {
    sayHello: ->
      console.log('hello')
  }
)

