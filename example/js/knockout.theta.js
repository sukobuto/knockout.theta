/**
 * Author: sukobuto.com
 * Since: 2014/11/24 0:55
 * Copyright: 2014 sukobuto.com All Rights Reserved.
 */

;(function(factory) {
	if (typeof define === "function" && define.amd) {
		// AMD anonymous module
		define(["knockout", "jquery", "three"], factory);
	} else {
		// No module loader (plain <script> tag) - put directly in global namespace
		factory(ko, jQuery, THREE);
	}
})(function(ko, $, THREE) {
	
	var default_context = {
		fov: 70,
		loading: ko.observable(true),
		isUserInteracting: false,
		lon: 0,
		lat: 0,
		phi: 0,
		theta: 0,
		onMouseDownX: 0,
		onMouseDownY: 0,
		onMouseDownLon: 0,
		onMouseDownLat: 0
	};

	ko.bindingHandlers.theta = {
		init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
			var $elm = $(element),
				imageUrl = ko.unwrap(valueAccessor()),
				context = ko.utils.extend({}, default_context),
				wheelZoom = allBindings.get('thetaWheelZoom') || ko.observable(false),
				loading = allBindings.get('thetaLoading');
			
			if (loading && ko.isWriteableObservable(loading)) {
				context.loading.subscribe(loading);
			}
			
			var camera = new THREE.PerspectiveCamera(context.fov, $elm.innerWidth() / $elm.innerHeight(), 1, 1100);
			camera.target = new THREE.Vector3(0, 0, 0);
			
			var geometry = new THREE.SphereGeometry(500, 60, 40);
			geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
			
			var material = new THREE.MeshBasicMaterial({
				map: THREE.ImageUtils.loadTexture(imageUrl, null, function() {
					context.loading(false);
					render();
				})
			});
			
			var mesh = new THREE.Mesh(geometry, material);
			
			var scene = new THREE.Scene();
			scene.add(mesh);
			
			var renderer = new THREE.WebGLRenderer();
			renderer.setSize($elm.innerWidth(), $elm.innerHeight());
			element.appendChild(renderer.domElement);
			
			var theta = {
				context: context,
				camera: camera,
				scene: scene,
				material: material,
				renderer: renderer,
				render: render
			};
			
			function animate() {
				requestAnimationFrame(animate);
				if (!context.loading() && context.isUserInteracting) render();
			}
			
			function render() {
				context.lat = Math.max(-85, Math.min(85, context.lat));
				context.phi = THREE.Math.degToRad(90 - context.lat);
				context.theta = THREE.Math.degToRad(context.lon);
				
				theta.camera.target.x = 500 * Math.sin(context.phi) * Math.cos(context.theta);
				theta.camera.target.y = 500 * Math.cos(context.phi);
				theta.camera.target.z = 500 * Math.sin(context.phi) * Math.sin(context.theta);

				theta.camera.lookAt(theta.camera.target);
				theta.renderer.render(theta.scene, theta.camera);
			}
			
			$elm
				.on('mousedown', function(e) {
					e.preventDefault();
					context.isUserInteracting = true;
					var offset = $elm.offset();
					context.onMouseDownX = e.pageX - offset.left;
					context.onMouseDownY = e.pageY - offset.top;
					context.onMouseDownLon = context.lon;
					context.onMouseDownLat = context.lat;
				})
				.on('mousemove', function(e) {
					if (!context.isUserInteracting) return; 
					var offset = $elm.offset();
					var x = e.pageX - offset.left,
						y = e.pageY - offset.top;
					context.lon = (context.onMouseDownX - x) * 0.1 + context.onMouseDownLon;
					context.lat = (y - context.onMouseDownY) * 0.1 + context.onMouseDownLat;
				})
				.on('mouseup', function(e) {
					context.isUserInteracting = false;
				});
			
			function onScroll(e) {
				if (!ko.unwrap(wheelZoom)) return;
				e.preventDefault();
				if (e.wheelDeltaY) { // WebKit
					context.fov -= e.wheelDeltaY * 0.05;
				} else if (e.wheelDelta) { // Opera / Explorer 9
					context.fov -= e.wheelDelta * 0.05;
				} else if (e.detail) { // Firefox
					context.fov += e.detail * 1.0;
				}
				theta.camera.projectionMatrix.makePerspective(context.fov, $elm.innerWidth() / $elm.innerHeight(), 1, 1100);
				render();
			}
			
			element.onmousewheel = onScroll;
			
			$(window).resize(function(e) {
				theta.camera.aspect = $elm.innerWidth() / $elm.innerHeight();
				theta.camera.updateProjectionMatrix();
				renderer.setSize($elm.innerWidth(), $elm.innerHeight());
			});
			
			$.data(element, "knockout.theta", theta);
			animate();
		},
		update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
			var theta = $.data(element, "knockout.theta");
			var context = theta.context;
			var imageUrl = ko.unwrap(valueAccessor());
			context.loading(true);
			theta.material.map = THREE.ImageUtils.loadTexture(imageUrl, null, function() {
				context.loading(false);
				theta.render();
			});
			theta.material.map.needsUpdate = true;
		}
	};
	
});