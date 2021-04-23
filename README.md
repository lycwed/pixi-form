
# PIXI.form - Plugin for pixi.js

This plugin is based on mwni.io TextInput PIXI plugin.

# Installation

Created with PIXI v5.3.9.

`npm i -S pixi-form`

# What's new !?

Includes now :

- `PIXI.form.Input` to generate input
- `PIXI.form.InputStyles` to generate input styles
- `PIXI.form.Button` to generate a button with styles
- `PIXI.form.Form` to generate form to wrap inputs

I introduce:

- the input type password
- the notion of rules to validate an input and the box colorization on blur.
- the button generator
- the formulary allows you to validate submit according to the input validation.
- d.ts file.

Some input validation rules are already integrated:

- required
- email
- number
- string
- min:{number} (min:3)

And if it's not enough you can set your own validator!

# Usage

```ts
import * as PIXI from 'pixi.js';
import 'pixi-form';

// Optional
import gsap from 'gsap';
import PixiPlugin from 'gsap/PixiPlugin';
gsap.registerPlugin(PixiPlugin);

const width = 1000;
const height = 600;
const app = new PIXI.Application(
    { 
        width: width,
        height: height,
        antialias: true,
        backgroundColor: 0xffffff,
        resolution: window.devicePixelRatio || 1
    }
);

document.getElementById('canvas-wrapper').appendChild(app.view);

const styles = new PIXI.form.InputStyles({
    fontFamily: 'Impact',
    fontSize: 36,
    padding: 12,
    width: 500,
    color: 0x333333,
    backgroundColor: 0xEFEFEF,
    border: {
        position: 'bottom',
        radius: 0,
        width: 1,
        color: 0xDFDFDF,
    },
});

const email = new PIXI.form.Input({
    type: 'text',
    name: 'email',
    placeholder: 'Enter your email...',
    styles: styles,
    gsap: gsap,
    rules: [
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

const password = new PIXI.form.Input({
    type: 'password',
    name: 'password',
    placeholder: 'Enter your password...',
    styles: styles,
    gsap: gsap,
    rules: [
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

// Everything from there on is optional
const submitButton = new PIXI.form.Button('SUBMIT RIGHT NOW!', {
    fontFamily: 'Impact',
    fontSize: 36,
    width: 500,
    padding: 12,
    color: 0xffffff,
    backgroundColor: 0x00CC00,
    border: {
        radius: 12,
        width: 1,
        color: 0x00FF00,
    },
}, gsap);

// You can use form to wrap inputs with all logic to submit form 
const form = new PIXI.form.Form({
    width: width,
    height: height,
    alignItems: 'center',
    spaceBetween: 10,
});

form.y = 100;
form.addInput(email);
form.addInput(password);
form.setButton('submit', submitButton);
form.onSubmit((data) => {
    alert(`Wow! ${data.email} ${data.password}`);
});

app.stage.addChild(form);
```
