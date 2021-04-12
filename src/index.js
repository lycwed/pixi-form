var TextInput = require("./pixi-form");
var form = {
  TextInput: TextInput,
};

Object.defineProperties(PIXI, {
  form: form,
});

module.exports = form;
