var EditCtrl = ['$scope', '$timeout', '$http', '$routeParams', 'mapGenerator', function($scope, $timeout, $http, $routeParams, mapGenerator) {

  function changeType(elm) {
    $(elm).isolateScope().type = $scope.type;
    $scope.$apply();
  }
    
  function setupClickHandlers() {
    $timeout(function() {
      
      var bbox = $('#hex-tile')[0].getBBox();
      $scope.boardSize = [bbox.width,bbox.height];
      
      var mousedown = false;
      $('polygon').click(function() {
        changeType(this);
      });
      $(document).mousedown(function() {
        mousedown = true;
        //changeType(this);
      });
      $('polygon').mousedown(function(e) {
        //if (e.preventDefault) e.preventDefault();
        mousedown = false;
        changeType(this);
  
      });
      $(document).mouseup(function() {
        mousedown = false;
      });
      $('polygon').mouseenter(function() {
        if (mousedown) {
          changeType(this);
        }
      });
    });
  }
  
  var tileRows;
  var tileCols;
  if ($routeParams.name) {
    $scope.loading = true;
    var name = $routeParams.name;
    $http.get('/map/' + name).then(
      function(res) {
        $scope.tiles = res.data.tiles;
        tileRows = res.data.rows;
        tileCols = res.data.cols;
        $scope.newTileRows = tileRows;
        $scope.newTileCols = tileCols;
        $scope.loading = false;
        setupClickHandlers();
      }
    );
  } else {
    
    tileRows = 20;
    tileCols = 30;
    $scope.tiles = mapGenerator.generateTiles(tileRows,tileCols,20,3);
    
    $scope.newTileRows = tileRows;
    $scope.newTileCols = tileCols;
    
    setupClickHandlers();
  }
  
  
  //$scope.boardSize = mapGenerator.getBoardSize(20,30);

  
  
  
  $scope.type = 'water'
  $scope.$watch('type', function(type) {
    if (type) {
      console.log('type changed to: ' + type);
    }
  });
  
  $scope.changeSize = function(newRows, newCols) {
    $scope.tiles = mapGenerator.changeMapSize($scope.tiles, tileRows, tileCols, newRows, newCols);
    tileRows = newRows;
    tileCols = newCols;
  }
  
  $scope.save = function() {
    var body = {
      tiles: $scope.tiles,
      rows: $scope.newTileRows,
      cols: $scope.newTileCols,
      name: $scope.name
    };
    $http.post('/map', body).then(
      function(response) {
        console.log('saved');  
      }
    );
  }
}];