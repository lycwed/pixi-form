var PIXIForm = require("./pixi-form");
var plugin = {
  form: {
    Form: PIXIForm.Form,
    TextInput: PIXIForm.TextInput,
    TextInputStyles: PIXIForm.TextInputStyles,
  },
};

Object.assign(PIXI, plugin);

module.exports = plugin;
