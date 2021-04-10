
# PIXI.TextInput - Plugin for pixi.js

This plugin is based on mwni.io TextInput PIXI plugin.

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

`npm i -S pixi-text-input-plus`

# Usage

```ts
import * as PIXI from 'pixi.js';
import 'pixi-text-input-plus';

const input = PIXI.TextInput({
    input: {
        fontFamily: 'Arial',
        fontSize: '36px',
        padding: '12px',
        width: '500px',
        color: '#26272E',
        type: 'password', // 'text' by default
    },
    box: {
        error: {fill: 0xE8E9F3, rounded: 12, stroke: {color: 0xFF0000, width: 3}},
        valid: {fill: 0xE8E9F3, rounded: 12, stroke: {color: 0x00FF00, width: 3}},
        default: {fill: 0xE8E9F3, rounded: 12, stroke: {color: 0xCBCEE0, width: 3}},
        focused: {fill: 0xE1E3EE, rounded: 12, stroke: {color: 0xABAFC6, width: 3}},
        disabled: {fill: 0xDBDBDB, rounded: 12}
    },
    rules: [
        {
            type: 'required',
            onError: function() {
                // What you want on error
                console.log('input required');
            }
        },
        {
            type: 'min:3',
            onError: function() {
                // What you want on error
                console.log('input min 3 chars');
            }
        },
        {
            type: 'regexp',
            validate: function(value) {
                return value === 'password';
            },
            onError: function() {
                // What you want on error
                console.log('it must be entered password');
            }
        },
    ]
});
```
