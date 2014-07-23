(function(window) {
   var createModule = function(angular) {
      var module = angular.module('FBAngular', []);

      module.factory('Fullscreen', ['$document', function ($document) {
         var document = $document[0];

         // ensure ALLOW_KEYBOARD_INPUT is available and enabled
         var isKeyboardAvailbleOnFullScreen = (typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element) && Element.ALLOW_KEYBOARD_INPUT;

         var serviceInstance = {
            all: function() {
               serviceInstance.enable( document.documentElement );
            },
            enable: function(element) {
               if(element.requestFullScreen) {
                  element.requestFullScreen();
               } else if(element.mozRequestFullScreen) {
                  element.mozRequestFullScreen();
               } else if(element.webkitRequestFullscreen) {
                  // Safari temporary fix
                  if (/\/[\d\.]{2}[\d\.]{2}[\d]* Safari/.test(navigator.userAgent)) {
                     element.webkitRequestFullscreen();
                  } else {
                     element.webkitRequestFullscreen(isKeyboardAvailbleOnFullScreen);
                  }
               } else if (element.msRequestFullscreen) {
                  element.msRequestFullscreen();
               }
            },
            cancel: function() {

               if(document.cancelFullScreen) {
                  document.cancelFullScreen();
               } else if(document.mozCancelFullScreen) {
                  document.mozCancelFullScreen();
               } else if(document.webkitExitFullscreen) {
                  document.webkitExitFullscreen();
               } else if (document.msExitFullscreen) {
                  document.msExitFullscreen();
               }
            },
            isEnabled: function(){
               var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
               return fullscreenElement;
            },
            toggleAll: function(){
                serviceInstance.isEnabled() ? serviceInstance.cancel() : serviceInstance.all();
            },
            isSupported: function(){
                var docElm = document.documentElement;
                return docElm.requestFullScreen || docElm.mozRequestFullScreen || docElm.webkitRequestFullscreen || docElm.msRequestFullscreen;
            }
         };

         return serviceInstance;
      }]);

      module.directive('fullscreen', ['Fullscreen',  function(Fullscreen) {
         return {
            link : function ($scope, $element, $attrs) {
               // Watch for changes on scope if model is provided
               if ($attrs.fullscreen) {
                  $scope.$watch($attrs.fullscreen, function(value) {
                     var isEnabled = Fullscreen.isEnabled();
                     if (value && !isEnabled) {
                        Fullscreen.enable($element[0]);
                        $element.addClass('isInFullScreen');
                     } else if (!value && isEnabled) {
                        Fullscreen.cancel();
                        $element.removeClass('isInFullScreen');
                     }
                  });
                  // listen event on document instead of element to avoid firefox limitation
                  // see https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
                  angular.element(document).on('fullscreenchange webkitfullscreenchange mozfullscreenchange', function(){
                     if(!Fullscreen.isEnabled()){
                        $scope.$evalAsync(function(){
                           $scope[$attrs.fullscreen] = false
                           $element.removeClass('isInFullScreen');
                        })
                     }
                  })
               } else {
                  if ($attrs.onlyWatchedProperty !== undefined) {
                     return;
                  }

                  $element.on('click', function (ev) {
                     Fullscreen.enable(  $element[0] );
                  });
               }
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
