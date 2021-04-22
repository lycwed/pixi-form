
# PIXI.form - Plugin for pixi.js

This plugin is based on mwni.io TextInput PIXI plugin.

# Installation

Created with PIXI v5.3.9.

`npm i -S pixi-form`

# What's new !?

Includes now :

- `PIXI.form.TextInput` to generate input
- `PIXI.form.TextInputStyles` to generate input styles
- `PIXI.form.Form` to generate form to wrap inputs

I introduce:

- the input type password
- the notion of rules to validate an input and the box colorization on blur.
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

document.querySelector('#canvas-wrapper').appendChild(app.view);

const styles = new PIXI.form.TextInputStyles({
    fontFamily: 'impact',
    fontSize: 36,
    padding: 12,
    width: 500,
    color: 0x333333,
    selectionColor: 0x00AAFF,
    backgroundColor: 0xEFEFEF,
    border: {
        position: 'bottom',
        radius: 0,
        width: 1,
        color: 0xDFDFDF,
    },
});

const email = new PIXI.form.TextInput({
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

const password = new PIXI.form.TextInput({
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

// All here is optional, you can use
const button = new PIXI.Graphics();
button.lineStyle(1, 0x75F94C, 1, 0);
button.beginFill(0x6FD254);
button.drawRoundedRect(0, 0, 530, 70, 12);
button.endFill();
button.on('pointerover', () => {
    button.scale.set(1.1);
});
button.on('pointerout', () => {
    button.scale.set(1);
});

const buttonStyles = new PIXI.TextStyle({
    fontFamily: 'impact',
    fontSize: 36,
    fill: 0xffffff,
    align: 'center',
    dropShadow: true,
    dropShadowColor: 0x75F94C,
    dropShadowBlur: 20,
    dropShadowAngle: 0,
    dropShadowDistance: 0,
});

const buttonText = new PIXI.Text('SUBMIT RIGHT NOW!', buttonStyles);
buttonText.x = button.width / 2;
buttonText.y = button.height / 2;
buttonText.pivot.x = buttonText.width / 2;
buttonText.pivot.y = buttonText.height / 2;
button.addChild(buttonText);

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
form.setSubmitButton(button);
form.on('submit', (data) => {
    console.log('submit data', data);
    alert(`Wow! ${data.email} ${data.password}`)
});

app.stage.addChild(form);
```
