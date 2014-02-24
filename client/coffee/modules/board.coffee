angular.module('hex.board', []).directive('board2', ['$timeout','testService', ($timeout, testService) ->
  return {
    restrict: 'AC'
    link: (scope, elem, attrs) ->
      console.log('here')


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

  }
)

