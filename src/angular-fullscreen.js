/**
 * Fullscreen Service
 */
var module = angular.module('FBAngular', []);

module.factory('Fullscreen', function () {

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
   }
})

module.directive('fullscreen', function(Fullscreen) {
   return {
      link : function ($scope, $element, $attrs) {
         $element.on('click', function (ev) {
            Fullscreen.enable(  document.getElementById( $attrs.id  ));
         });
      }
   };
});