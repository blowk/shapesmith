var SS = SS || {};

SS.SphereCreator = SS.PrimitiveCreator.extend({

    initialize: function(attributes) {
        SS.PrimitiveCreator.prototype.initialize.call(this, attributes);

        this.node.parameters.r = 10;
        this.node.extra = {angle: 0};

        this.views = this.views.concat([
            new SS.SpherePreview({model: this}),
            new SS.DraggableRadiusCorner({model: this}),
            new SS.SphereDimensions({model: this}),
        ]);
        this.trigger('change', this);
    },

    mouseDownOnRadius: function(corner) {
        this.activateCorner(corner);
    },

    getBoundingBox: function() {
        var origin = this.node.origin;
        var r = this.node.parameters.r;
        return {min: new THREE.Vector3(origin.x - r, origin.y - r, origin.z - r),
                max: new THREE.Vector3(origin.x + r, origin.y + r, origin.z + r)};
    },

});

SS.SpherePreview = SS.PreviewWithOrigin.extend({

    initialize: function() {
        SS.PreviewWithOrigin.prototype.initialize.call(this);
        this.render();
    },
    
    render: function() {
        this.clear();
        SS.PreviewWithOrigin.prototype.render.call(this);

        var origin = this.model.node.origin;
        var r = this.model.node.parameters.r;

        if (r) {
            var geometry = new THREE.SphereGeometry(r, 50, 10);
	    var sphere = new THREE.Mesh(geometry, SS.constructors.faceMaterial);
	    this.sceneObject.add(sphere);
            
	    var circleGeom = new THREE.Geometry();
	    for(var i = 0; i <= 50; ++i) {
	        var theta = Math.PI*2*i/50;
	        var dx = r*Math.cos(theta);
	        var dy = r*Math.sin(theta);
	        circleGeom.vertices.push(new THREE.Vertex(new THREE.Vector3(dx, dy, 0)));
	    }
	    var circle = new THREE.Line(circleGeom, SS.constructors.lineMaterial);
	    this.sceneObject.add(circle);

            circle.position = sphere.position;

            if (origin.z) {
	        var circle2 = new THREE.Line(circleGeom, SS.constructors.lineMaterial);
                circle2.position.z = -origin.z;
                this.sceneObject.add(circle2);
            }
            
        }
       
        this.postRender();
    },

});

SS.DraggableRadiusCorner = SS.DraggableCorner.extend({

    initialize: function(options) {
        SS.DraggableCorner.prototype.initialize.call(this, options);
        this.key = options.key || 'r';
        this.render();
    },

    priority: 1,

    mouseDown: function() {
        this.model.mouseDownOnRadius(this);
    },

    cornerPositionFromModel: function() {
        var r = this.model.node.parameters[this.key];
        var angle = this.model.node.extra.angle;
        var dx = Math.cos(angle)*r;
        var dy = Math.sin(angle)*r;
        return {x: this.model.node.origin.x + dx,
                y: this.model.node.origin.y + dy,
                z: this.model.node.origin.z};
    },

    updateModelFromCorner: function(position) {
        var dx = position.x - this.model.node.origin.x;
        var dy = position.y - this.model.node.origin.y;
        var angle = Math.atan2(dy, dx);

        var r = Math.sqrt(dx*dx + dy*dy);
        this.model.node.parameters[this.key] = Math.round(r);
        this.model.node.extra = {angle: angle};
    },

});

SS.SphereDimensions = SS.SceneObjectView.extend({

    initialize: function() {
        SS.SceneObjectView.prototype.initialize.call(this);
        SS.sceneView.on('cameraChange', this.update, this);
        this.render();
    },

    remove: function() {
        SS.SceneObjectView.prototype.remove.call(this);
        SS.sceneView.off('cameraChange', this.update);
        this.$r.remove();
    },

    render: function() {
        this.clear();

        var origin = this.model.node.origin;
        var r = this.model.node.parameters.r;
        var angle = this.model.node.extra.angle;

        var vector = new THREE.Vector3(r*Math.cos(angle), r*Math.sin(angle), 0);

        var rDim = SS.createDimArrow(r, vector);
        this.sceneObject.add(rDim);
        this.sceneObject.position = new THREE.Vector3(origin.x, origin.y, origin.z);

        this.$r && this.$r.remove();
        this.$r = $('<div class="dimension">' + r + '</div>');
        $('body').append(this.$r);
        this.$r.css('position', 'absolute');

        this.update();
        this.postRender();
    },

    update: function() {
        var origin = this.model.node.origin;
        var r = this.model.node.parameters.r;
        var angle = this.model.node.extra.angle;

        var pixelPosition = SS.toScreenCoordinates(
            new THREE.Vector3(origin.x + r/2*Math.cos(angle), 
                              origin.y + r/2*Math.sin(angle), 
                              0));
        this.$r.css('left', pixelPosition.x);
        this.$r.css('top', pixelPosition.y);
    },

});


