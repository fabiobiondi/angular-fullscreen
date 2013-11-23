(function(window) {
   var createModule = function(angular) {
      var module = angular.module('FBAngular', []);

      module.factory('Fullscreen', ['$document', function ($document) {
         var document = $document[0];

         return {
            all: function() {
               this.enable( document.documentElement );
            },
            enable: function(element) {
               if(element.requestFullScreen) {
                  element.requestFullScreen();
               } else if(element.mozRequestFullScreen) {
                  element.mozRequestFullScreen();
               } else if(element.webkitRequestFullScreen) {
                  element.webkitRequestFullScreen();
               }
            },
            cancel: function() {

               if(document.cancelFullScreen) {
                  document.cancelFullScreen();
               } else if(document.mozCancelFullScreen) {
                  document.mozCancelFullScreen();
               } else if(document.webkitCancelFullScreen) {
                  document.webkitCancelFullScreen();
               }
            },
            isEnabled: function(){
               var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
               return fullscreenElement;
            }
         };
      }]);

      module.directive('fullscreen', ['Fullscreen', '$document', function(Fullscreen, $document) {
         var document = $document[0];

         return {
            link : function ($scope, $element, $attrs) {
               $element.on('click', function (ev) {
                  Fullscreen.enable(  document.getElementById( $attrs.id  ));
               });
            }
         };
      }]);

      return module;
   };

   if (typeof define === "function" && define.amd) {
      define("FBAngular", ['angular'], function (angular) { return createModule(angular); } );
   } else {
      createModule(window.angular);
   }
})(window);
