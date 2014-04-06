var EditCtrl = ['$scope', '$timeout', '$http', '$routeParams', function($scope, $timeout, $http, $routeParams) {

  function changeType(elm) {
    $(elm).isolateScope().type = $scope.type;
    $scope.$apply();
  }
  
  if ($routeParams.name) {
    $scope.loading = true;
    var name = $routeParams.name;
    $http.get('/map/' + name).then(
      function(res) {
        $scope.tiles = res.data.tiles;  
        $scope.loading = false;
      }
    );
  }

  $scope.type = 'water'
  $scope.$watch('type', function(type) {
    if (type) {
      console.log('type changed to: ' + type);
    }
  });
  $timeout(function() {
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