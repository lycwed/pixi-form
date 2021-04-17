var Form = require("./pixi-form");

Object.assign(PIXI, {
  form: {
    TextInput: Form.TextInput,
    TextInputStyles: Form.TextInputStyles,
  },
});

module.exports = PIXI.form;
