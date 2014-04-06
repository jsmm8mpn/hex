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
  
  if ($routeParams.name) {
    $scope.loading = true;
    var name = $routeParams.name;
    $http.get('/map/' + name).then(
      function(res) {
        $scope.tiles = res.data.tiles;  
        $scope.loading = false;
        setupClickHandlers();
      }
    );
  } else {
    
    $scope.tiles = mapGenerator.generateTiles(20,30,20,3);
    
    setupClickHandlers();
  }
  
  
  //$scope.boardSize = mapGenerator.getBoardSize(20,30);

  $scope.tileRows = 20;
  $scope.tileCols = 30;
  $scope.type = 'water'
  $scope.$watch('type', function(type) {
    if (type) {
      console.log('type changed to: ' + type);
    }
  });
  
  $scope.newTileRows = $scope.tileRows;
  $scope.newTileCols = $scope.tileCols;
  $scope.changeSize = function(tileRows, tileCols) {
    $scope.tileRows = tileRows;
    $scope.tileCols = tileCols;
  }
  
  $scope.save = function() {
    var body = {
      tiles: $scope.tiles,
      name: $scope.name
    };
    $http.post('/map', body).then(
      function(response) {
        console.log('saved');  
      }
    );
  }
}];