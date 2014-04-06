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
  }]);