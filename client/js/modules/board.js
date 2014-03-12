(function() {

  angular.module('hex.board', []).directive('board', [
      '$timeout', 'testService', function($timeout, testService) {
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
            var calculateHexTile, calculateHexVertices, calculateXY, createPoints, d, degreesToRadians, h, height, padding, r, size, tileHeight, tileWidth, vertices, width;
            size = scope.size;
            padding = scope.padding;
            degreesToRadians = function(degrees) {
              return degrees * Math.PI / 180;
            };
            r = size * Math.cos(degreesToRadians(30));
            h = size * Math.sin(degreesToRadians(30));
            d = padding / 2 / Math.tan(degreesToRadians(30));
            tileWidth = (4 * r) + (2 * padding);
            tileHeight = (2 * h) + (2 * size) + (2 * d);
            calculateHexTile = function() {
              var col, originX, originY, row, vertices, x, y, _i, _j, _ref, _ref1, _ref2;
              originX = 0;
              originY = 0;
              vertices = [];
              for (row = _i = 0, _ref = scope.rows; 0 <= _ref ? _i < _ref : _i > _ref; row = 0 <= _ref ? ++_i : --_i) {
                for (col = _j = 0, _ref1 = scope.cols; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; col = 0 <= _ref1 ? ++_j : --_j) {
                  _ref2 = calculateXY(originX, originY, col, row), x = _ref2[0], y = _ref2[1];
                  vertices.push(calculateHexVertices(x, y));
                }
              }
              return vertices;
            };
            calculateXY = function(x, y, col, row) {
              var height, width;
              width = (2 * r) + padding;
              height = size + h + d;
              return [x + (col * width) + ((row % 2) * (width / 2)), y + (row * height)];
            };
            createPoints = function(x, y) {
              return x + ',' + y + ' ' + (x + r) + ',' + (y + h) + ' ' + (x + r) + ',' + (y + size + h) + ' ' + x + ',' + (y + size + h + h) + ' ' + (x - r) + ',' + (y + size + h) + ' ' + (x - r) + ',' + (y + h);
            };
            calculateHexVertices = function(x, y) {
              return [[x, y], [x + r, y + h], [x + r, y + size + h], [x, y + size + h + h], [x - r, y + size + h], [x - r, y + h]];
            };
            vertices = calculateHexTile();
            scope.vertices = vertices;
            width = (2 * r) + padding;
            height = size + h + d;
            scope.boardSize = [scope.cols * width, scope.rows * height];
            return $timeout(function() {
              return SVGPan();
            });
          }
        };
      }
    ]).directive('polygon', [
      '$timeout', function($timeout) {
        return {
          restrict: 'EAC',
          scope: {
            vertice: '='
          },
          link: function(scope, elem, attrs) {
            var point, points, _i, _len, _ref;
            points = '';
            _ref = scope.vertice;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              point = _ref[_i];
              points += point[0] + ',' + point[1] + ' ';
            }
            $(elem).attr('points', points);
            return $(elem).click(function() {
              return console.log('click');
            });
          }
        };
      }
    ]).factory('testService', function() {
      return {
        sayHello: function() {
          return console.log('hello');
        }
      };
    });

}).call(this);
