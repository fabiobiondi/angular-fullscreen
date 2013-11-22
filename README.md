AngularJS HTML5 Fullscreen 
=======

An AngularJS service and a directive to quickly use the HTML5 fullscreen API and set the fullscreen to the document or to a specific element.


## Usage
Add AngularJS and the angular-fullscreen.js to your main file (index.html)
	
```html
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.1/angular.min.js"></script>
<script src="../src/angular-fullscreen.js"></script>
```


Set `FBAngular` as a dependency in your module:

```javascript
var app = angular.module('YourApp', ['FBAngular'])
```

## Use as a directive
Set the fullscreen attribute to a specific element. The only requirement is to set an ID to the element.

```html
<img id="img1" src="imgs/P1030188.JPG" fullscreen />
```

## Use as a Service
You can also use the Fullscreen service into your controller:

Controller:
```javascript
function MainCtrl($scope, Fullscreen) {

   $scope.goFullscreen = function () {

      // Fullscreen
      if (Fullscreen.isEnabled())
         Fullscreen.cancel();
      else
         Fullscreen.all();

      // Set Fullscreen to a specific element (bad practice)
      // Fullscreen.enable( document.getElementById('img') )

   }

}
```

HTML:
```html
<button ng-click="goFullscreen()">Enable/Disable fullscreen</button>
```

#### Available Methods

Method | Details
:---------------------- | :------ 
all()                  		 | enable document fullscreen
enable(elementID)	 | enable fullscreen to a specific element
cancel()			 | disable fullscreen
isEnable()			 | return true if fullscreen is enabled, otherwise false



## Example
You can check out this live example here: http://jsfiddle.net/asafdav/8YQcz/6/
