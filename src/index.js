var Form = require("./pixi-form");
var plugin = {
  form: {
    TextInput: Form.TextInput,
    TextInputStyles: Form.TextInputStyles,
  },
};

Object.assign(PIXI, plugin);

module.exports = plugin;
