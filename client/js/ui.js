var blocklyDiv = document.getElementById('blockly-div');
var editorDiv = document.getElementById('3DEditor-div');
var imageEditorDiv = document.getElementById('imageEditor-div');
var soundEditorDiv = document.getElementById('soundEditor-div');
var codeEditorButton = document.getElementById('codeEditor-button');
var editorButton = document.getElementById('3DEditor-button');
var imageEditorButton = document.getElementById('imageEditor-button');
var soundEditorButton = document.getElementById('soundEditor-button');
function codeEditor() {
    codeEditorButton.className = "selected";
    editorButton.className = "unselected";
    imageEditorButton.className = "unselected";
    // soundEditorButton.className = "unselected";
    blocklyDiv.style.display = "block";
    editorDiv.style.display = "none";
    imageEditorDiv.style.display = "none";
    // soundEditorDiv.style.display = "none";
}
function threeEditor() {
    codeEditorButton.className = "unselected";
    editorButton.className = "selected";
    imageEditorButton.className = "unselected";
    // soundEditorButton.className = "unselected";
    blocklyDiv.style.display = "none";
    editorDiv.style.display = "block";
    imageEditorDiv.style.display = "none";
    // soundEditorDiv.style.display = "none";
}
function imageEditor() {
    codeEditorButton.className = "unselected";
    editorButton.className = "unselected";
    imageEditorButton.className = "selected";
    // soundEditorButton.className = "unselected";
    blocklyDiv.style.display = "none";
    editorDiv.style.display = "none";
    imageEditorDiv.style.display = "block";
    // soundEditorDiv.style.display = "none";
}
// function soundEditor() {
//     codeEditorButton.className = "unselected";
//     editorButton.className = "unselected";
//     imageEditorButton.className = "unselected";
//     soundEditorButton.className = "selected";
//     blocklyDiv.style.display = "none";
//     editorDiv.style.display = "none";
//     imageEditorDiv.style.display = "none";
//     soundEditorDiv.style.display = "block";
// }
var addUIMenu = document.getElementById('add-UI-menu');
var addUIButton = document.getElementById('add-UI-button');
var add3DMenu = document.getElementById('add-3D-menu');
var add3DButton = document.getElementById('add-3D-button');
addUIMenu.addEventListener("mouseover", function () {
    addUIMenu.classList.add("visible");
});
addUIMenu.addEventListener("mouseout", function () {
    addUIMenu.classList.remove("visible");
});
addUIButton.addEventListener("mouseover", function () {
    addUIMenu.classList.add("visible");
});
addUIButton.addEventListener("mouseout", function () {
    addUIMenu.classList.remove("visible");
});
add3DMenu.addEventListener("mouseover", function () {
    add3DMenu.classList.add("visible");
});
add3DMenu.addEventListener("mouseout", function () {
    add3DMenu.classList.remove("visible");
});
add3DButton.addEventListener("mouseover", function () {
    add3DMenu.classList.add("visible");
});
add3DButton.addEventListener("mouseout", function () {
    add3DMenu.classList.remove("visible");
});
document.getElementById('move').addEventListener("click", function () {
    threeScene.transformControls.setMode('translate');
});
document.getElementById('rotate').addEventListener("click", function () {
    threeScene.transformControls.setMode('rotate' || 'scale');
});
document.getElementById('scale').addEventListener("click", function () {
    threeScene.transformControls.setMode('scale');
});
document.getElementById('undo').addEventListener("click", function () {
    threeScene.history.undo();
});
document.getElementById('redo').addEventListener("click", function () {
    threeScene.history.redo();
});
function inputChange(cmd) {
    if (activeObject) {
        if (activeObject.sceneObject) {
            switch (cmd) {
                case "setPosition":
                    threeScene.set(cmd, activeObject.sceneObject, new THREE.Vector3(document.getElementsByName('positionX')[0].value, document.getElementsByName('positionY')[0].value, document.getElementsByName('positionZ')[0].value));
                    break;
                case "setRotation":
                    threeScene.set(cmd, activeObject.sceneObject, new THREE.Vector3(document.getElementsByName('rotationX')[0].value, document.getElementsByName('rotationY')[0].value, document.getElementsByName('rotationZ')[0].value));
                    break;
                case "setScale":
                    threeScene.set(cmd, activeObject.sceneObject, new THREE.Vector3(document.getElementsByName('scaleX')[0].value, document.getElementsByName('scaleY')[0].value, document.getElementsByName('scaleZ')[0].value));
                    break;
                case "setName":
                    threeScene.set(cmd, activeObject.sceneObject, document.getElementsByName('objectName')[0].value);
                    break;
                case "setVisible":
                    threeScene.set(cmd, activeObject.sceneObject, document.getElementsByName('show')[0].value);
                    break;
            }
        }else {

        }
    }
}
var contextObjectId = "";
var menu = document.getElementById('hierarchy-context-menu');
window.addEventListener("click", e => {
    if (menu.style.display === "block") menu.style.display = "none";
});
document.getElementById("duplicate").addEventListener("click", function () {
    duplicateObject(contextObjectId);
});
document.getElementById("delete").addEventListener("click", function () {
    deleteObject(contextObjectId);
});
function addContext(id) {
    document.getElementById(id).addEventListener("contextmenu", e => {
        contextObjectId = id;
        e.preventDefault();
        menu.style.display = "block";
        if ((window.innerWidth - e.pageX) < (menu.offsetWidth + 4)) {
            menu.style.left = window.innerWidth - (menu.offsetWidth + 4) + "px";
        } else {
            menu.style.left = e.pageX + "px";
        }
        if ((window.innerHeight - e.pageY) < (menu.offsetHeight + 4)) {
            menu.style.top = window.innerHeight - (menu.offsetHeight + 4) + "px";
        } else {
            menu.style.top = e.pageY + "px";
        }
        return false;
    });
}
function updateContext() {
    for (var i = 0; i < threeObjects.length; i++) {
        addContext(threeObjects[i].id);
    }
}
