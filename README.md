Angular Fullscreen - HTML5 Fullscreen API 
=======

An AngularJS service and a directive to quickly use the HTML5 fullscreen API and set the fullscreen to a specific element or to the whole page.


## Usage
Add AngularJS and the angular-fullscreen.js to your main file (index.html)
	
```html
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.1/angular.min.js"></script>
<script src="../src/angular-fullscreen.js"></script>
```

Set `FBAngular` as a dependency in your module

```javascript
  var app = angular.module('YourApp', ['FBAngular'])

```

## Use as a directive
Set the fullscreen to a specific element. The only requirement for the element is the ID attribute.

```html
	<img id="img1" src="imgs/P1030188.JPG" fullscreen />
```

## Use as a Service
Inject the Fullscreen service into your controller and use the following methods:

#### Methods

Method | Details
:---------------------- | :------ | :------
all()                  		 | enable fullscreen
cancel()			 | disable fullscreen
isEnable()			 | return true if fullscreen is enabled, otherwise false
enable(elementID)	 | enable fullscreen to a specific element


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

## Example
You can check out this live example here: http://jsfiddle.net/asafdav/8YQcz/6/
