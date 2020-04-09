
(function() {
   'use strict';

   var app = angular.module('DemoApp', ['angular-fullscreen-toggle']);

   app.controller('MainCtrl', ['$scope', '$log', 'Fullscreen', function ($scope, $log, Fullscreen) {

      $scope.goFullscreen = function () {

         // Fullscreen
         if (Fullscreen.isEnabled())
            Fullscreen.cancel();
         else
            Fullscreen.all();

         // Set Fullscreen to a specific element (bad practice)
         // Fullscreen.enable( document.getElementById('img') )

      };

      $scope.isFullScreen = false;

      $scope.goFullScreenViaWatcher = function() {
         $scope.isFullScreen = !$scope.isFullScreen;
      };
   }]);
})();

