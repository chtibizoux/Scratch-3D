class ThreeEditor {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    constructor(update, canvasId) {
        this.renderCanvas = document.getElementById(canvasId);
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, this.renderCanvas.width / this.renderCanvas.height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({canvas: this.renderCanvas, antialias: true});

        const light = new THREE.AmbientLight(0xFFFFFF);
        light.position.set(-1, 1, 1);
        this.scene.add(light);
        // const light = new THREE.DirectionalLight(0xFFFFFF, 1);
        // light.position.set(-1, 2, 4);
        // this.scene.add(light);
		const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({color: 0x00ff00}));
		this.scene.add(cube);
		this.camera.position.z = 5;
        var _this = this;
		function update() {
            requestAnimationFrame(update);
        	_this.raycaster.setFromCamera(_this.mouse, _this.camera);
        	const intersects = _this.raycaster.intersectObjects(_this.scene.children);
            for (var i = 0; i < _this.scene.children.length; i++) {
                if (_this.scene.children[i].material) {
                    _this.scene.children[i].material.color.set(0x00ff00);
                }
            }
        	for (let i = 0; i < intersects.length; i ++) {
        		intersects[i].object.material.color.set(0xff0000);
        	}
			_this.renderer.render(_this.scene, _this.camera);
		}
        update();
        function onMouseMove(event) {
        	_this.mouse.x = ((event.clientX - _this.renderCanvas.getBoundingClientRect().left) / _this.renderCanvas.width) * 2 - 1;
        	_this.mouse.y = -((event.clientY - _this.renderCanvas.getBoundingClientRect().top) / _this.renderCanvas.height) * 2 + 1;
        }
        window.addEventListener('mousemove', onMouseMove, false);
    }
}
