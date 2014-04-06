angular.module('hex.board', [])
.directive('board', ['$timeout', function($timeout) {

  return {
    restrict: 'AC',
    templateUrl: 'view/templates/board',
    scope: {
      tiles: '=',
      boardSize: '='
    },
    link: function(scope, elem, attrs) {

    }
  };
}])

.directive('polygon', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      vertice: '=',
      type: '='
    },
    link: function(scope, elem, attr) {

      var vertice = scope.vertice;
      var points = '';
      for (var i = 0; i < vertice.length; i++) {
        points += vertice[i][0] + ',' + vertice[i][1] + ' ';
      }
      $(elem).attr('points', points);

    }
  };
}])

.directive('type', ['tiles', function(tiles) {
  return {
    restrict: 'A',
    link: function(scope, elm, attr) {
      scope.$watch(attr.type, function(type) {
        if (type) {
          $(elm).attr('class', type);
        }
      });
    }
  }
}])

.factory('tileType', function() {
  return {
    sayHello: function() {
      return console.log('hello');
    }
  };
});

