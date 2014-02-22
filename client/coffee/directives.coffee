myDir = angular.module('myDir', [])

myDir.directive('testDir', ['$timeout', ($timeout) ->
  return {
    restrict: 'A'
    templateUrl: 'view/templates/test'
    link: (scope, elem, attrs) ->
      console.log('test')
  }
])
