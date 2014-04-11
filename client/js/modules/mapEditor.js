angular.module('hex.editor', [])
  .directive('editor', ['$timeout', function($timeout) {
    return {
      restrict: 'EAC',
      templateUrl: 'view/templates/edit',
      link: function(scope, elem, attrs) {

      }
    };
  }])
  .directive('edit', ['$timeout', function($timeout) {
    return {
      restrict: 'EAC',
      link: function(scope, elem, attrs) {
        return $(elem).click(function() {
          //$(elem).attr('style', 'fill:#0000FF');
        });
      }
    };
  }])
  .factory('mapGenerator', function() {
    
    function degreesToRadians(degrees) {
      return degrees * Math.PI / 180;
    }
    
    return {
      generateTiles: function(rows, cols, size, padding, startRow, startCol) {
        var size = size;
        var padding = padding;
        var r = size * Math.cos(degreesToRadians(30));
        var h = size * Math.sin(degreesToRadians(30));
        var d = padding / 2 / Math.tan(degreesToRadians(30));
        var width = (2 * r) + padding;
        var height = size + h + d;
        var originX = 50;//- (width * 4);
        var originY = 50;//- (height * 4);
        startRow = startRow || 0;
        startCol = startCol || 0;
  
        function calculateHexTile() {
          var vertices = [];
          for (var row = startRow; row < rows; row++) {
            for (var col = startCol; col < cols; col++) {
              var xy = calculateXY(originX, originY, col, row);
              vertices.push({
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
                    
        return calculateHexTile();
      },
      
      changeMapSize: function(tiles, rows, cols, newRows, newCols) {
        var newTiles = tiles;
        if (newRows) {
          if (newRows < rows) {
            var rowsToRemove = rows - newRows;
            var startIndex = tiles.length - cols * rowsToRemove;
            newTiles = tiles.slice(0,startIndex);
          } else if (newRows > rows) {
            var rowsToAdd = newRows - rows;
            newTiles = newTiles.concat(this.generateTiles(newRows, cols, 20, 3, rows));
          }
        }
        if (newCols) {
          if (newCols < cols) {            
            var left = [];
            for (var i = 0; i < newTiles.length; i++) {
              if (i % cols < newCols) {
                left.push(newTiles[i]);
              }
            }
            newTiles = left;
          } else if (newCols > cols) {
            for (var row = 0; row < (newRows || rows); row++) {
              var toAdd = this.generateTiles(row+1, newCols, 20, 3, row, cols);
              var args = [row * newCols + cols, 0].concat(toAdd);
              Array.prototype.splice.apply(newTiles, args);
            }
          }
        }
        return newTiles;
      }
    };
  });