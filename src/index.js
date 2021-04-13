var TextInput = require("./pixi-form");

Object.assign(PIXI, {
  form: {
    TextInput: TextInput.default,
  },
});

module.exports = PIXI.form;
