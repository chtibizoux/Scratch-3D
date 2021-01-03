document.addEventListener('keypress', function(event) {
    console.log(event.code);
});
// Code to add in start
var start = "var isPlaying = true;\nfunction waitFor(conditionFunction) {\n  const poll = resolve => {\n    if(conditionFunction()) resolve();\n    else setTimeout(_ => poll(resolve), 400);\n  }\n  return new Promise(poll);\n}\ndocument.getElementById('stop').addEventListener('click', function () {\n  isPlaying = false;\n});";
// var message = "";
// for (var i = 0; i < Object.keys(Blockly.Blocks).length; i++) {
//     if (!Blockly.JavaScript[Object.keys(Blockly.Blocks)[i]]) {
//         message += 'Blockly.JavaScript["' + Object.keys(Blockly.Blocks)[i] + '"] = function(block) {\n    var code = "";\n    return code;\n};\n';
//     }
// }
// console.log(message);

// Blockly.JavaScript['when_flag'] = function(block) {
//     var argument0 = Blockly.JavaScript.statementToCode(block, 'DO', Blockly.JavaScript.ORDER_FUNCTION_CALL) || '';
//     var code = argument0;
//     return code;
// };
// Blockly.JavaScript['when_anykeypress'] = function(block) {
//     var variable_key = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('KEY'), Blockly.Variables.NAME_TYPE);
//     var argument0 = Blockly.JavaScript.statementToCode(block, 'DO', Blockly.JavaScript.ORDER_FUNCTION_CALL) || '';
//     var code = "document.addEventListener('keypress', function(event) {\n  " + variable_key + " = event.code;\n" + argument0 + "});\n";
//     return code;
// };
// Blockly.JavaScript['when_keypress'] = function(block) {
//     var argument0 = Blockly.JavaScript.statementToCode(block, 'DO', Blockly.JavaScript.ORDER_FUNCTION_CALL) || '';
//     var code = "document.addEventListener('mousepress', function(event) {\nif (" + block.getFieldValue('KEY') + " == event.code) {\n" + argument0 + "}\n});\n";
//     return code;
// };
// Blockly.JavaScript['when_keydown'] = function(block) {
//     var argument0 = Blockly.JavaScript.statementToCode(block, 'DO', Blockly.JavaScript.ORDER_FUNCTION_CALL) || '';
//     var code = "document.addEventListener('keydown', function(event) {\nif (" + block.getFieldValue('KEY') + " == event.code) {\n" + argument0 + "}\n});\n";
//     return code;
// };
// Blockly.JavaScript['when_keyup'] = function(block) {
//     var argument0 = Blockly.JavaScript.statementToCode(block, 'DO', Blockly.JavaScript.ORDER_FUNCTION_CALL) || '';
//     var code = "document.addEventListener('keyup', function(event) {\nif (" + block.getFieldValue('KEY') + " == event.code) {\n" + argument0 + "}\n});\n";
//     return code;
// };
// Blockly.JavaScript['when_mousedown'] = function(block) {
//     var variable_mouseX = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('MOUSEX'), Blockly.Variables.NAME_TYPE);
//     var variable_mouseY = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('MOUSEY'), Blockly.Variables.NAME_TYPE);
//     var argument0 = Blockly.JavaScript.statementToCode(block, 'DO', Blockly.JavaScript.ORDER_FUNCTION_CALL) || '';
//     var code = "document.addEventListener('mousedown', function(event) {\nif (" + block.getFieldValue('MOUSE_BUTTON') + " == event.button) {\n  " + variable_mouseX + " = event.mouseX;\n  " + variable_mouseY + " = event.mouseY;\n" + argument0 + "}\n});\n";
//     return code;
// };
// Blockly.JavaScript['when_mouseup'] = function(block) {
//     var variable_mouseX = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('MOUSEX'), Blockly.Variables.NAME_TYPE);
//     var variable_mouseY = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('MOUSEY'), Blockly.Variables.NAME_TYPE);
//     var argument0 = Blockly.JavaScript.statementToCode(block, 'DO', Blockly.JavaScript.ORDER_FUNCTION_CALL) || '';
//     var code = "document.addEventListener('mouseup', function(event) {\nif (" + block.getFieldValue('MOUSE_BUTTON') + " == event.button) {\n  " + variable_mouseX + " = event.mouseX;\n  " + variable_mouseY + " = event.mouseY;\n" + argument0 + "}\n});\n";
//     return code;
// };
// Blockly.JavaScript['when_mousemove'] = function(block) {
//     var variable_mouseX = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('MOUSEX'), Blockly.Variables.NAME_TYPE);
//     var variable_mouseY = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('MOUSEY'), Blockly.Variables.NAME_TYPE);
//     var argument0 = Blockly.JavaScript.statementToCode(block, 'DO', Blockly.JavaScript.ORDER_FUNCTION_CALL) || '';
//     var code = "document.addEventListener('mousemove', function(event) {\n  " + variable_mouseX + " = event.mouseX;\n  " + variable_mouseY + " = event.mouseY;\n" + argument0 + "});\n";
//     return code;
// };
// Blockly.JavaScript['when_mouseclick'] = function(block) {
//     var argument0 = Blockly.JavaScript.statementToCode(block, 'DO', Blockly.JavaScript.ORDER_FUNCTION_CALL) || '';
//     var code = "sprite.addEventListener('mouseclick', function() {\n" + argument0 + "});\n"
//     return code;
// };
// Blockly.JavaScript['when_mousehover'] = function(block) {
//     var argument0 = Blockly.JavaScript.statementToCode(block, 'DO', Blockly.JavaScript.ORDER_FUNCTION_CALL) || '';
//     var code = "sprite.addEventListener('mousehover', function() {\n" + argument0 + "});\n"
//     return code;
// };
// Blockly.JavaScript['when_mouseout'] = function(block) {
//     var argument0 = Blockly.JavaScript.statementToCode(block, 'DO', Blockly.JavaScript.ORDER_FUNCTION_CALL) || '';
//     var code = "sprite.addEventListener('mouseout', function() {\n" + argument0 + "});\n"
//     return code;
// };
// Blockly.JavaScript['controls_wait'] = function(block) {
//     var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_FUNCTION_CALL) || 0;
//     var argument1 = Blockly.JavaScript.statementToCode(block, 'DO', Blockly.JavaScript.ORDER_FUNCTION_CALL) || '';
//     var code = 'setTimeout(function(){\n' + argument1 + '}, ' + (parseInt(argument0) * 1000) + ');\n';
//     return code;
// };
// Blockly.JavaScript['controls_waitUntil'] = function(block) {
//     var argument0 = Blockly.JavaScript.valueToCode(block, 'EVENT', Blockly.JavaScript.ORDER_FUNCTION_CALL) || 0;
//     var argument1 = Blockly.JavaScript.statementToCode(block, 'DO', Blockly.JavaScript.ORDER_FUNCTION_CALL) || '';
//     var code = "waitFor(_ => " + argument0 + ").then(_ => {\n" + argument1 + "});\n";
//     return code;
// };
// Blockly.JavaScript['controls_forever'] = function(block) {
//     var argument0 = Blockly.JavaScript.statementToCode(block, 'DO', Blockly.JavaScript.ORDER_FUNCTION_CALL) || '';
//     var code = 'while (isPlaying === true) {\n' + argument0 + '}\n';
//     return code;
// };
// Blockly.JavaScript['date_get'] = function(block) {
//     var code = '0';
//     switch (block.getFieldValue('TYPE')) {
//         case "YEAR":
//             code = 'new Date().getFullYear()';
//             break;
//         case "MONTH":
//             code = 'new Date().getMonth()';
//             break;
//         case "DATE":
//             code = 'new Date().getDate()';
//             break;
//         case "DAY":
//             code = 'new Date().getDay()';
//             break;
//         case "HOUR":
//             code = 'new Date().getHours()';
//             break;
//         case "MINUTE":
//             code = 'new Date().getMinutes()';
//             break;
//         case "SECOND":
//             code = 'new Date().getSeconds()';
//             break;
//     }
//     return code;
// };
// Blockly.JavaScript['text_includes'] = function(block) {
//     var argument0 = Blockly.JavaScript.valueToCode(block, 'CONTENT', Blockly.JavaScript.ORDER_FUNCTION_CALL) || '\'\'';
//     var argument1 = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_FUNCTION_CALL) || '\'\'';
//     var code = argument0 + '.includes(' + argument1 + ')';
//     return code;
// };
