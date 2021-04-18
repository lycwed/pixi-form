
# PIXI.form - Plugin for pixi.js

This plugin is based on mwni.io TextInput PIXI plugin.

Includes now :

`PIXI.form.TextInput` to generate input
`PIXI.form.TextInputStyles` to generate styles for input

I introduce:

- the input type password
- the notion of rules to validate an input and the box colorization on blur.
- d.ts file.

Some validation rules are already integrated:

- required
- email
- number
- string
- min:{number} (min:3)

And if it's not enough you can set your own validator!

# Installing

Created with PIXI v5.3.9.

`npm i -S pixi-form`

# Usage

```ts
import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import 'pixi-form';

var width = 1000;
var height = 600;
var app = new PIXI.Application({ 
    width: width,
    height: height,
    antialias: true,
    backgroundColor: 0xffffff,
    resolution: window.devicePixelRatio || 1
});

document.getElementById('canvas-placeholder').appendChild(app.view)

var styles = new PIXI.form.TextInputStyles({
    fontFamily: 'Arial',
    fontSize: 36,
    padding: 12,
    width: 500,
    color: 0x333333,
    backgroundColor: 0xEFEFEF,
    border: {
        radius: 4,
        width: 2,
        color: 0xACACAC,
    },
});

// Optional
gsap.registerPlugin(PixiPlugin);

var email = new PIXI.form.TextInput({
    type: 'text',
    placeholder: 'Enter your email...',
    styles: styles, // Optional
    gsap: gsap, // Optional
    rules: [ // Optional
        {
            type: 'required',
            onFail: function() {
                console.log('Email required');
            }
        },
        {
            type: 'email',
            onFail: function() {
                console.log('Email not correct');
            }
        },
    ]
});

var password = new PIXI.form.TextInput({
    type: 'password',
    placeholder: 'Enter your password...',
    styles: styles, // Optional
    gsap: gsap, // Optional
    rules: [ // Optional
        {
            type: 'required',
            onFail: function() {
                console.log('Password required');
            }
        },
        {
            type: 'min:3',
            onFail: function() {
                console.log('Password min 3 chars');
            }
        },
        {
            validator: function(value) {
                return value === 'password';
            },
            onFail: function() {
                console.log('it must be entered password');
            }
        },
    ]
});

email.x = width / 2;
email.y = height / 2;
email.pivot.x = email.width / 2;
email.pivot.y = email.height / 2;

password.x = width / 2;
password.y = email.y + email.height + 20;
password.pivot.x = password.width / 2;
password.pivot.y = password.height / 2;

app.stage.addChild(email, password);
```
