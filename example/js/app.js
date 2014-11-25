/**
 * Author: sukobuto.com
 * Since: 2014/11/24 0:47
 * Copyright: 2014 sukobuto.com All Rights Reserved.
 */

var AppViewModel = (function() {
	
	function AppViewModel(contents) {
		var self = this;
		
		self.loading = ko.observable(true);
		self.images = contents.images;
		self.selectedImage = ko.observable(contents.images[0]);
		self.selectedNumber = ko.computed(function() {
			return self.images.indexOf(self.selectedImage()) + 1;
		});
		self.wheelZoom = ko.observable(false);
		
		function selectOffset(offset) {
			var image = self.selectedImage()
			var pos = self.images.indexOf(image);
			pos += offset;
			if (pos < 0) pos = 0;
			if (pos >= self.images.length) pos = self.images.length - 1;
			self.selectedImage(self.images[pos]);
		}
		
		self.prev = function() {
			selectOffset(-1);
		};
		
		self.next = function() {
			selectOffset(+1);
		};
		
		self.select = function(image) {
			self.selectedImage(image);
			return true;
		};
		
		self.switchWheel = function(enabled) {
			return function() {
				self.wheelZoom(enabled);
			}
		};
	}
	
	return AppViewModel;
	
})();