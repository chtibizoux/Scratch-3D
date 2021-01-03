function History(editor) {
    this.editor = editor;
    this.undos = [];
    this.redos = [];
	this.historyDisabled = false;
}
History.prototype.add = function (cmd, object, property, oldProperty) {
    this.undos.push({cmd: cmd, object: object, property: property, oldProperty: oldProperty});
    this.redos = [];
};
History.prototype.undo = function () {
    if (!this.historyDisabled && this.undos.length > 0) {
		var cmd = this.undos.pop();
		this.redos.push(cmd);
        this.editor.set(cmd.cmd, cmd.object, cmd.oldProperty);
    }
};
History.prototype.redo = function () {
    if (!this.historyDisabled && this.redos.length > 0) {
		var cmd = this.redos.pop();
		this.undos.push(cmd);
        this.editor.set(cmd.cmd, cmd.object, cmd.property);
    }
};
