var activeObject = null;
var uiObjects = [];
var threeObjects = [];
// Default Camera
newObject("3D", 1, "Main Camera");

function newObject(type, libraryId, name) {
    document.getElementById("3D-library").style.display = "none";
    document.getElementById("UI-library").style.display = "none";
    if (type === "3D") {
        if (!name) name = "object";
        activeObject = {
            id: Blockly.utils.genUid(),
            name: name,
            sceneObject: null,
            libraryId: libraryId,
            startJS: add3Dobject(libraryId),
            type: type,
            js: "",
            xml: "",
            position: new THREE.Vector3(0, 0, 0),
            rotation: new THREE.Vector3(0, 0, 0),
            scale: new THREE.Vector3(1, 1, 1),
            visible: true
        };
        image = getObjectImage(activeObject);
        document.getElementById('objects-3D-div').innerHTML += '<div class="object-button" id="' + activeObject.id + '" onclick="switchObject(\'' + activeObject.id + '\');"><div class="object-delete-img"><img src="' + image + '" alt=""></div><div class="object-button-name">' + activeObject.name + '</div><button class="object-delete-button" onclick="deleteObject(\'' + activeObject.id + '\');"><img src="assets/images/trash.svg" alt=""></button></div>';
        threeObjects.push(activeObject);
        activeObject.sceneObject = threeScene.addObjectInScene(activeObject.libraryId, activeObject.id, activeObject.name, activeObject.position, activeObject.rotation, activeObject.scale);
        switchObject(activeObject.id);
        updateContext();
    }else {
        activeObject = {
            id: Blockly.utils.genUid(),
            name: name,
            libraryId: libraryId,
            startJS: add2Dobject(libraryId),
            type: type,
            js: "",
            xml: "",
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            },
            scale: {
                x: 1,
                y: 1,
                z: 1
            }
        };
        image = getObjectImage(activeObject);
        document.getElementById('objects-UI-div').innerHTML += '<div class="object-button" id="' + activeObject.id + '" onclick="switchObject(\'' + activeObject.id + '\');"><div class="object-delete-img"><img src="' + image + '" alt=""></div><div class="object-button-name">' + activeObject.name + '</div><button class="object-delete-button" onclick="deleteObject(\'' + activeObject.id + '\');"><img src="assets/images/trash.svg" alt=""></button></div>';
        uiObjects.push(activeObject);
        updateContext();
    }
}
function add3Dobject(libraryId) {
    switch (libraryId) {
        case 1:
            // Return camera
            return "var camera = new THREE.PerspectiveCamera(75, renderCanvas.width / renderCanvas.height, 0.1, 1000);";
            break;
        default:
            // Return imported object
    }
}
function add2Dobject(libraryId) {
    switch (libraryId) {
        case 1:

            break;
        default:

    }
}
function switchObject(id) {
    for (var i = 0; i < threeObjects.length; i++) {
        if (threeObjects[i].id === id) {
            threeScene.transformControls.attach(threeObjects[i].sceneObject);
    		threeScene.selectionBox.setFromObject(threeObjects[i].sceneObject);
    		threeScene.selectionBox.visible = true;
            if (threeObjects[i].sceneObject.helper) threeScene.selectionBox.visible = false;
            activeObject = threeObjects[i];
            if (document.getElementsByClassName('active').length > 0) document.getElementsByClassName('active')[0].classList.remove("active");
            document.getElementById(id).classList.add("active");
            workspace.clear();
            Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(threeObjects[i].xml), workspace);
            break;
        }
    }
}
function deleteObject(id) {
    for (var i = 0; i < threeObjects.length; i++) {
        if (threeObjects[i].id === id) {
            if (threeObjects[i] === activeObject) {
                threeScene.selectionBox.visible = false;
                threeScene.transformControls.detach();
                activeObject = null;
                workspace.clear();
            }
            if (threeObjects[i].sceneObject.geometry) threeObjects[i].sceneObject.geometry.dispose();
            if (threeObjects[i].sceneObject.material) threeObjects[i].sceneObject.material.dispose();
            if (threeObjects[i].sceneObject.helper) threeScene.scene.remove(threeObjects[i].sceneObject.helper);
            threeScene.scene.remove(threeObjects[i].sceneObject);
            threeObjects.splice(i, 1);
            document.getElementById(id).remove();
            break;
        }
    }
}
function duplicateObject(id) {
    for (var i = 0; i < threeObjects.length; i++) {
        if (threeObjects[i].id === id) {
            activeObject = {
                id: Blockly.utils.genUid(),
                name: threeObjects[i].name,
                sceneObject: null,
                libraryId: threeObjects[i].libraryId,
                startJS: add3Dobject(threeObjects[i].libraryId),
                type: threeObjects[i].type,
                js: threeObjects[i].js,
                xml: threeObjects[i].xml,
                position: threeObjects[i].position.clone(),
                rotation: threeObjects[i].rotation.clone(),
                scale: threeObjects[i].scale.clone()
            };
            image = getObjectImage(activeObject);
            document.getElementById('objects-3D-div').innerHTML += '<div class="object-button" id="' + activeObject.id + '" onclick="switchObject(\'' + activeObject.id + '\');"><div class="object-delete-img"><img src="' + image + '" alt=""></div><div class="object-button-name">' + activeObject.name + '</div><button class="object-delete-button" onclick="deleteObject(\'' + activeObject.id + '\');"><img src="assets/images/trash.svg" alt=""></button></div>';
            threeObjects.push(activeObject);
            activeObject.sceneObject = threeScene.addObjectInScene(activeObject.libraryId, activeObject.id, activeObject.name, activeObject.position, activeObject.rotation, activeObject.scale);
            switchObject(activeObject.id);
            updateContext();
            break;
        }
    }
}
function getObjectImage(object) {
    switch (object.libraryId) {
        case 1:
            return "assets/images/camera.svg";
            break;
        case 2:
            return "assets/images/light.png";
            break;
        case 3:
            return "assets/images/light.png";
            break;
        case 4:
            return "assets/images/light.png";
            break;
        case 5:
            return "assets/images/light.png";
            break;
        case 6:
            return "assets/images/light.png";
            break;
        case 7:
            return "assets/images/text.png";
            break;
        case 8:
            return "assets/images/plan.png";
            break;
        case 9:
            return "assets/images/circle.png";
            break;
        case 10:
            return "assets/images/ring.png";
            break;
        case 11:
            return "assets/images/cube.png";
            break;
        case 12:
            return "assets/images/sphere.png";
            break;
        case 13:
            return "assets/images/cone.png";
            break;
        case 14:
            return "assets/images/cylinder.png";
            break;
        case 15:
            return "assets/images/capsule.png";
            break;
        case 16:
            return "assets/images/torus.png";
            break;
        case 17:
            return "assets/images/tube.png";
            break;
        case 18:
            return "assets/images/octahedron.png";
            break;
        case 19:
            return "assets/images/tetrahedron.png";
            break;
        case 20:
            return "assets/images/button.svg";
            break;
        default:
            // Return imported object or image
            return "assets/images/scratch/delete-x.svg";
    }
}
