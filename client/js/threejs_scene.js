const fontLoader = new THREE.FontLoader();
class ThreeScene {
    objects = [];
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    constructor(update, canvasId) {
        var _this = this;
        this.renderCanvas = document.getElementById(canvasId);
		this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x314D79);
		this.camera = new THREE.PerspectiveCamera(75, this.renderCanvas.width / this.renderCanvas.height, 0.1, 1000);
        this.camera.position.set(0, 20, 30);
        this.renderer = new THREE.WebGLRenderer({canvas: this.renderCanvas, antialias: true});
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        // history
        this.history = new History(this);
        // Save properties
    	var objectPositionOnDown = null;
    	var objectRotationOnDown = null;
    	var objectScaleOnDown = null;
        // Grid
        var grid = new THREE.GridHelper(100, 100);
        grid.raycastDisabled = true;
    	const color1 = new THREE.Color(0xBBBBBB);
    	const color2 = new THREE.Color(0x888888);
    	const array = grid.geometry.attributes.color.array;
    	for (var i = 0; i < array.length; i += 12) {
    		const color = (i % (12 * 5) === 0) ? color1 : color2;
    		for (var j = 0; j < 12; j += 3) {
    			color.toArray(array, i + j);
    		}
    	}
        this.scene.add(grid);
        // Selection Box
        this.selectionBox = new THREE.BoxHelper();
        this.selectionBox.material.depthTest = false;
        this.selectionBox.material.transparent = true;
        this.selectionBox.visible = false;
        this.scene.add(this.selectionBox);
        // Transform Controls
    	this.transformControls = new TransformControls(this.camera, this.renderCanvas);
    	this.transformControls.addEventListener('change', function () {
    		var object = _this.transformControls.object;
    		if (object !== undefined) {
                _this.setProperties(object);
    		}
    	});
    	this.transformControls.addEventListener('mouseDown', function () {
    		var object = _this.transformControls.object;
    		objectPositionOnDown = object.position.clone();
    		objectRotationOnDown = object.rotation.clone();
    		objectScaleOnDown = object.scale.clone();
    		_this.controls.enabled = false;
    	});
    	this.transformControls.addEventListener('mouseUp', function () {
    		var object = _this.transformControls.object;
    		if (object !== undefined) {
    			switch (_this.transformControls.getMode()) {
    				case 'translate':
    					if (!objectPositionOnDown.equals(object.position)) {
    						_this.history.add("setPosition", object, object.position.clone(), objectPositionOnDown);
    					}
    					break;
    				case 'rotate':
    					if (!objectRotationOnDown.equals(object.rotation)) {
    						_this.history.add("setRotation", object, object.rotation.clone(), objectRotationOnDown);
    					}
    					break;
    				case 'scale':
    					if (!objectScaleOnDown.equals(object.scale)) {
    						_this.history.add("setScale", object, object.scale.clone(), objectScaleOnDown);
    					}
    					break;
    			}
    		}
    		_this.controls.enabled = true;
    	});
    	this.scene.add(this.transformControls);

		function update() {
            requestAnimationFrame(update);
        	_this.controls.update();
			_this.renderer.render(_this.scene, _this.camera);
		}
        this.controls.update();
        update();

        this.renderCanvas.addEventListener('mousemove', function(event) {
        	_this.mouse.x = ((event.clientX - _this.renderCanvas.getBoundingClientRect().left) / _this.renderCanvas.width) * 2 - 1;
        	_this.mouse.y = -((event.clientY - _this.renderCanvas.getBoundingClientRect().top) / _this.renderCanvas.height) * 2 + 1;
        }, false);
        this.renderCanvas.addEventListener('click', function(event) {
            if (_this.controls.enabled) {
                _this.raycaster.setFromCamera(_this.mouse, _this.camera);
            	const intersects = _this.raycaster.intersectObjects(_this.objects);
                if (intersects.length > 0) {
                    var object = null;
                    if (intersects[0].object.myObject) {
                        object = intersects[0].object.myObject;
                    } else {
                        object = intersects[0].object;
                    }
                    switchObject(object.objectId);
                }
            }
        }, false);
        var hover = false;
        document.getElementsByClassName('right')[0].addEventListener("mouseover", function () {
            hover = true;
        });
        document.getElementsByClassName('right')[0].addEventListener("mouseout", function () {
            hover = false;
        });
        document.addEventListener('keypress', function (event) {
            if (hover) {
                if (event.keyCode === 26) {
                    _this.history.undo();
                }else if (event.keyCode === 25) {
                    _this.history.redo();
                }
            }
        });
        document.addEventListener('keydown', function (event) {
            if (hover) {
                if (event.keyCode === 46 && activeObject) {
                    deleteObject(activeObject.id);
                }
            }
        });

		// this.transformControls.detach();
		// this.transformControls.attach(object);
		// this.selectionBox.setFromObject(object);
		// this.selectionBox.visible = true;
		// this.transformControls.setTranslationSnap(dist);
		// this.transformControls.setSpace(space);

        // test
        const light = new THREE.AmbientLight(0xFFFFFF, 100);
        light.position.set(-2, 2, 2);
        this.scene.add(light);
		// const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({color: 0x00ff00}));
		// this.scene.add(cube);
        // this.objects.push(cube);
        // Test Transform Controls
		// this.transformControls.attach(cube);
		// this.selectionBox.setFromObject(cube);
		// this.selectionBox.visible = true;
    }
}
ThreeScene.prototype.set = function (cmd, object, property) {
    switch (cmd) {
        case "setPosition":
            object.position.set(property.x, property.y, property.z);
            break;
        case "setRotation":
            object.rotation.set(degToRad(property.x) , degToRad(property.y) , degToRad(property.z) );
            break;
        case "setScale":
            object.scale.set(property.x, property.y, property.z);
            break;
        case "setName":
            object.name = property;
            break;
        case "setVisible":
            object.visible = property;
            break;
    }
    this.setProperties(object);
};
ThreeScene.prototype.setProperties = function (object) {
    this.selectionBox.setFromObject(object);
    document.getElementsByName('positionX')[0].value = object.position.x;
    document.getElementsByName('positionY')[0].value = object.position.y;
    document.getElementsByName('positionZ')[0].value = object.position.z;
    document.getElementsByName('rotationX')[0].value = radToDeg(object.rotation.x);
    document.getElementsByName('rotationY')[0].value = radToDeg(object.rotation.y);
    document.getElementsByName('rotationZ')[0].value = radToDeg(object.rotation.z);
    document.getElementsByName('scaleX')[0].value = object.scale.x;
    document.getElementsByName('scaleY')[0].value = object.scale.y;
    document.getElementsByName('scaleZ')[0].value = object.scale.z;
    document.getElementsByName('show')[0].value = object.visible;
    document.getElementsByName('objectName')[0].value = object.name;
    document.getElementById(object.objectId).getElementsByClassName("object-button-name")[0].innerHTML = object.name;
    for (var i = 0; i < threeObjects.length; i++) {
        if (threeObjects[i].id === object.objectId) {
            threeObjects[i].position = object.position;
            threeObjects[i].rotation = object.rotation;
            threeObjects[i].scale = object.scale;
            threeObjects[i].visible = object.visible;
            threeObjects[i].name = object.name;
            break;
        }
    }
};
ThreeScene.prototype.addObjectInScene = function (libraryId, id, name, position, rotation, scale) {
    var object = null;
    switch (libraryId) {
        case 1:
            object = new THREE.PerspectiveCamera(75, this.renderCanvas.width / this.renderCanvas.height, 0.1, 1000);
            break;
        case 2:
            object = new THREE.DirectionalLight(0xffffff, 1);
            break;
        case 3:
            object = new THREE.AmbientLight(0xffffff);
            break;
        case 4:
            object = new THREE.PointLight(0xffffff, 1, 100);
            break;
        case 5:
            object = new THREE.SpotLight(0xffffff);
            break;
        case 6:
            object = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
            break;
        case 7:
            fontLoader.load('assets/fonts/helvetiker_regular.typeface.json', function (font) {
                object = new THREE.Mesh(new THREE.TextGeometry("Text", {
                    font: font,
                    size: 80,
                    height: 5,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 10,
                    bevelSize: 8,
                    bevelOffset: 0,
                    bevelSegments: 5
                }), new THREE.MeshBasicMaterial({color: 0xffffff}));
            });
            break;
        case 8:
            object = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial({color: 0xffffff}));
            break;
        case 9:
            object = new THREE.Mesh(new THREE.CircleGeometry(5, 32), new THREE.MeshBasicMaterial({color: 0xffffff}));
            break;
        case 10:
            object = new THREE.Mesh(new THREE.RingGeometry(5, 7, 32), new THREE.MeshBasicMaterial({color: 0xffffff}));
            break;
        case 11:
            object = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial({color: 0xffffff}));
            break;
        case 12:
            object = new THREE.Mesh(new THREE.SphereGeometry(10, 10, 32), new THREE.MeshBasicMaterial({color: 0xffffff}));
            break;
        case 13:
            object = new THREE.Mesh(new THREE.ConeGeometry(5, 10, 32), new THREE.MeshBasicMaterial({color: 0xffffff}));
            break;
        case 14:
            object = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 10, 32), new THREE.MeshBasicMaterial({color: 0xffffff}));
            break;
        case 15:
            object = new THREE.Mesh(new THREE.CapsuleGeometry(), new THREE.MeshBasicMaterial({color: 0xffffff}));
            break;
        case 16:
            object = new THREE.Mesh(new THREE.TorusGeometry(10, 3, 16, 100), new THREE.MeshBasicMaterial({color: 0xffffff}));
            break;
        case 17:
            const path = new CustomSinCurve(10);
            object = new THREE.Mesh(new THREE.TubeGeometry(path, 20, 2, 8, false), new THREE.MeshBasicMaterial({color: 0xffffff}));
            break;
        case 18:
            object = new THREE.Mesh(new THREE.OctahedronGeometry(10, 0), new THREE.MeshBasicMaterial({color: 0xffffff}));
            break;
        case 19:
            object = new THREE.Mesh(new THREE.TetrahedronGeometry(10, 0), new THREE.MeshBasicMaterial({color: 0xffffff}));
            break;
        default:
            object = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({color: 0xffffff}));
            // Return imported object
    }
    object.name = name;
    object.objectId = id;
    object.position.set(position.x, position.y, position.z);
    object.rotation.set(rotation.x, rotation.y, rotation.z);
    object.scale.set(scale.x, scale.y, scale.z);
    var helper = this.addHelper(object);
    if (helper !== null) {
        object.helper = helper;
        this.scene.add(helper);
    }
    this.scene.add(object);
    this.objects.push(object);
    return object;
};
ThreeScene.prototype.addHelper = function(object) {
    var helper = null;
	if (object.isCamera) {
		helper = new THREE.CameraHelper(object);
	} else if (object.isPointLight) {
		helper = new THREE.PointLightHelper(object, 1);
	} else if (object.isDirectionalLight) {
		helper = new THREE.DirectionalLightHelper(object, 1);
	} else if (object.isSpotLight) {
		helper = new THREE.SpotLightHelper(object, 1);
	} else if (object.isHemisphereLight) {
		helper = new THREE.HemisphereLightHelper(object, 1);
	} else if (object.isSkinnedMesh) {
		helper = new THREE.SkeletonHelper(object.skeleton.bones[0]);
	} else {
		return null;
	}
    var picker = new THREE.Mesh(new THREE.SphereBufferGeometry(2, 4, 2), new THREE.MeshBasicMaterial({color: 0xff0000, visible: false}));
    picker.name = 'picker';
    picker.myObject = object;
    helper.add(picker);
    this.objects.push(picker);
    return helper;
};
function degToRad(deg)
{
   return (Math.PI*deg)/180
}
function radToDeg(rad)
{
   return (rad*180)/Math.PI
}
class CustomSinCurve extends THREE.Curve {
    constructor(scale = 1) {
        super();
        this.scale = scale;
    }
    getPoint( t, optionalTarget = new THREE.Vector3() ) {
        const tx = t * 3 - 1.5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = 0;
        return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
    }
}
