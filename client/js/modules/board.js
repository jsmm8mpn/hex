angular.module('hex.board', [])
.directive('board', ['$timeout', function($timeout) {

  function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  return {
    restrict: 'AC',
    templateUrl: 'view/templates/board',
    scope: {
      rows: '=',
      cols: '=',
      size: '=',
      padding: '='
    },
    link: function(scope, elem, attrs) {
      var size = scope.size;
      var padding = scope.padding;
      var r = size * Math.cos(degreesToRadians(30));
      var h = size * Math.sin(degreesToRadians(30));
      var d = padding / 2 / Math.tan(degreesToRadians(30));
      var tileWidth = (4 * r) + (2 * padding);
      var tileHeight = (2 * h) + (2 * size) + (2 * d);

      function calculateHexTile() {
        var col, originX, originY, row, x, y, _i, _j, _ref, _ref1, _ref2;
        var vertices = [];
        for (var row = 0; row < scope.rows; row++) {
          for (var col = 0; col < scope.cols; col++) {
            var xy = calculateXY(0, 0, col, row);
            vertices.push(calculateHexVertices(xy[0], xy[1]));
          }
        }
        return vertices;
      }

      function calculateXY(x, y, col, row) {
        var width = (2 * r) + padding;
        var height = size + h + d;
        return [x + (col * width) + ((row % 2) * (width / 2)), y + (row * height)];
      }

      function calculateHexVertices(x, y) {
        return [[x, y], [x + r, y + h], [x + r, y + size + h], [x, y + size + h + h], [x - r, y + size + h], [x - r, y + h]];
      }

      scope.vertices = calculateHexTile();
      var width = (2 * r) + padding;
      var height = size + h + d;
      scope.boardSize = [scope.cols * width, scope.rows * height];
    }
  };
}])

.directive('polygon', ['$timeout', function($timeout) {
  return {
    restrict: 'EAC',
    scope: {
      vertice: '='
    },
    link: function(scope, elem, attrs) {
      var vertice = scope.vertice;
      var points = '';
      for (var i = 0; i < vertice.length; i++) {
        points += vertice[i][0] + ',' + vertice[i][1] + ' ';
      }
      $(elem).attr('points', points);
      return $(elem).click(function() {
        return console.log('click');
      });
    }
  };
}])

.factory('testService', function() {
  return {
    sayHello: function() {
      return console.log('hello');
    }
  };
});

