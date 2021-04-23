var PIXIForm = require("./pixi-form");
var plugin = {
  form: {
    Form: PIXIForm.Form,
    Input: PIXIForm.Input,
    InputStyles: PIXIForm.InputStyles,
    Button: PIXIForm.Button,
  },
};

Object.assign(PIXI, plugin);

module.exports = plugin;
