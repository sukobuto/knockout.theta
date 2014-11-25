knockout.theta
==============

Create your own viewer of RICHO THETA with Knockout.js, Three.js and jQuery.

[Live Example](http://sukobuto.com/files/knockout.theta/)

RECHO THETA で撮影した equirectangular 形式の全天球写真を簡単に球体表示させることができる Knockout.js のバインディングハンドラです。
Three.js を使った全天球処理は [richo-theta-with-threejs](https://github.com/mitsuruog/richo-theta-with-threejs) を参考にしました。

## Usage

Bind your equirectangular image URL.

```html
<div data-bind="theta: 'path/to/image.jpg'"></div>
```

Of course, you can bind an observable.

```html
<div data-bind="theta: imageUrl"></div>
```

```javascript
function ThetaViewModel() {
	var self = this;
	self.imageUrl = ko.observable('path/to/image.jpg');
	
	// ... later
	self.imageUrl('path/to/other_image.jpg'); // Image change.
}
ko.applyBindings(new ThetaViewModel());
```

You can also pass optional parameters - `thetaWheelZoom` and `thetaLoading`.
 
### thetaWheelZoom

Enable or disable zoom on corresponding element.

```html
<div data-bind="theta: imageUrl(), thetaWheelZoom: zoomEnabled"></div>
```

```javascript
function ThetaViewModel() {
	var self = this;
	self.imageUrl = ko.observable('path/to/image.jpg');
	self.zoomEnabled = ko.observable(true);
	
	// ... later
	self.zoomEnabled(false); // disable wheel zoom.
}
ko.applyBindings(new ThetaViewModel());
```

### thetaLoading

Know the loading is started, or completed.

```html
<div data-bind="theta: imageUrl(), thetaLoading: isLoading"></div>

<p data-bind="visible: isLoading">Now loading...</p>
<p data-bind="visible: !isLoading()">Loading completed!</p>
```

```javascript
function ThetaViewModel() {
	var self = this;
	self.imageUrl = ko.observable('path/to/image.jpg');
	
	// automatically change to false when completed to load the image.
	self.isLoading = ko.observable(true);
}
ko.applyBindings(new ThetaViewModel());
```

Please look the code at [Live Example](http://sukobuto.com/files/knockout.theta/) for more information.
