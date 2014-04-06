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
      padding: '=',
      tiles: '='
    },
    link: function(scope, elem, attrs) {
      var size = scope.size;
      var padding = scope.padding;
      var r = size * Math.cos(degreesToRadians(30));
      var h = size * Math.sin(degreesToRadians(30));
      var d = padding / 2 / Math.tan(degreesToRadians(30));
      var width = (2 * r) + padding;
      var height = size + h + d;
      var originX = 50;//- (width * 4);
      var originY = 50;//- (height * 4);

      function calculateHexTile() {
        var vertices = [];
        for (var row = 0; row < scope.rows; row++) {
          for (var col = 0; col < scope.cols; col++) {
            var xy = calculateXY(originX, originY, col, row);
            vertices.push({
              //water: (row < 4 || row > scope.rows+4 || col < 4 || col > scope.cols+4),
              vertice: calculateHexVertices(xy[0], xy[1])
            });
          }
        }
        return vertices;
      }

      function calculateXY(x, y, col, row) {
        return [x + (col * width) + ((row % 2) * (width / 2)), y + (row * height)];
      }

      function calculateHexVertices(x, y) {
        return [[x, y], [x + r, y + h], [x + r, y + size + h], [x, y + size + h + h], [x - r, y + size + h], [x - r, y + h]];
      }

      if (!scope.tiles) {
        scope.tiles = calculateHexTile();
      }
      scope.boardSize = [scope.cols * width, scope.rows * height];
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

