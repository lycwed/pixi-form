export class Form extends PIXI.Container {
	constructor(options) {
		super();

		this.width = options.width;
		this.height = options.height;
		this._padding = options.padding || 10;
		this._alignItems = options.alignItems || 'left';
		this._spaceBetween = options.spaceBetween || 4;

		this._submitButton = null;
		this._inputs = [];
		this._events = {};

		this._backdrop = new PIXI.Graphics();
		this._backdrop.beginFill(0xFFFFFF);
		this._backdrop.drawRect(0, 0, options.width, options.height);
		this._backdrop.endFill();
		this._backdrop.on("pointerdown", () => {
			this._inputs.forEach((input) => {
				input.blur();
				this._backdrop.interactive = false;
			});
		});

		this.addChild(this._backdrop);
	}

	on(event, callback) {
		this._events[event] = callback;
	}

	addInput(input) {
		const lastInputHeight = this._inputs.length ? this._inputs[this._inputs.length - 1].height : 0;
		input.y = this._padding + ((lastInputHeight + this._spaceBetween) * this._inputs.length);

		switch (this._alignItems) {
			case 'center':
				input.x = this.width / 2;
				input.pivot.x = input.width / 2;
				input.pivot.y = 0;
				break;

			case 'left':
				input.x = this._padding;
				break;
		}

		this._inputs.push(input);
		this.addChild(input);

		input.addEventOn("pointerdown", () => {
			this._backdrop.interactive = true;
		});

		input.addEventOn("statechange", () => {
			this._updateSubmit();
		});
	}

	_disableSubmit() {
		if (this._submitButton) {
			this._submitButton.alpha = 0.6;
			this._submitButton.interactive = false;
		}
	}

	_enableSubmit() {
		if (this._submitButton) {
			this._submitButton.alpha = 1;
			this._submitButton.interactive = true;
		}
	}

	_updateSubmit() {
		let isValidForm = true;
		this._inputs.forEach((input) => {
			if (!input.isValid) {
				isValidForm = false;
			}
		});
		if (isValidForm) {
			this._enableSubmit();
		} else {
			this._disableSubmit();
		}
	}

	get data() {
		const data = {};
		this._inputs.forEach((input) => {
			data[input.name] = input.value;
		});
		return data;
	}

	setSubmitButton(button) {
		const lastInputHeight = this._inputs.length ? this._inputs[this._inputs.length - 1].height : 0;
		button.y = this._padding + ((lastInputHeight + this._spaceBetween) * this._inputs.length);
		button.x = this.width / 2;
		button.pivot.x = button.width / 2;
		button.pivot.y = 0;
		button.on('pointerdown', () => {
			if (this._events.submit) {
				this._events.submit(this.data);
			}
		})
		this._submitButton = button;
		this._disableSubmit();
		this.addChild(button);
	}
}

export class TextInputStyles {
	constructor(styles) {
		this.width = styles.width || 200;
		this.color = styles.color || 0x333333;
		this.padding = styles.padding || 4;
		this.fontSize = styles.fontSize || 13;
		this.fontFamily = styles.fontFamily || 'Arial';
		this.backgroundColor = styles.backgroundColor || 0xEFEFEF;
		this.border = {
			...{ color: 0xFFFFFF, width: 0, radius: 0 }, ...styles.border
		};
	}
}

export class TextInput extends PIXI.Container {
	constructor(options) {
		super();

		this.name = options.name;
		this.value = options.value || '';
		this._type = options.type || 'text';
		this._placeholder = options.placeholder;
		this._rules = options.rules || [];
		this._styles = Object.assign(
			{
				position: 'absolute',
				backgroundColor: 0xFFFFFF,
				transformOrigin: '0 0',
				outline: 'none',
				border: null,
				lineHeight: '1',
			},
			options.styles || new TextInputStyles({})
		);
		this._gsap = options.gsap;

		this._box_generator = new BoxGenerator({
			default: { color: this._styles.backgroundColor, border: this._styles.border },
			focused: { color: this._styles.backgroundColor, border: this._styles.border },
			disabled: { color: this._styles.backgroundColor, border: this._styles.border },
			error: { color: this._styles.backgroundColor, border: { ...this._styles.border, ...{ color: 0xFF0000 } } },
			valid: { color: this._styles.backgroundColor, border: { ...this._styles.border, ...{ color: 0x00FF00 } } },
		});

		if (this._styles.hasOwnProperty('multiline')) {
			this._multiline = !!this._styles.multiline;
			delete this._styles.multiline;
		} else {
			this._multiline = false;
		}

		this._eventsCallback = {};
		this._box_cache = {};
		this._previous = {};
		this._dom_added = false;
		this._dom_visible = true;
		this._placeholderColor = 0xa9a9a9;
		this._selection = [0, 0];
		this._restrict_value = '';
		this._createDOMInput();
		this.substituteText = true;
		this._setState('DEFAULT');
		this._addListeners();
	}


	// GETTERS & SETTERS

	get substituteText() {
		return this._substituted;
	}

	set substituteText(substitute) {
		if (this._substituted === substitute) {
			return;
		}

		this._substituted = substitute;

		if (substitute) {
			this._createPIXIField();
			this._dom_visible = false;
		} else {
			this._destroyPIXIField();
			this._dom_visible = true;
		}

		this.placeholder = this._placeholder;
		this._update();
	}

	get placeholder() {
		return this._placeholder;
	}

	set placeholder(text) {
		this._placeholder = text;
		if (this._substituted) {
			this._updatePIXIField();
			this._dom_input.placeholder = '';
		} else {
			this._dom_input.placeholder = text;
		}
	}

	get disabled() {
		return this._disabled;
	}

	set disabled(disabled) {
		this._disabled = disabled;
		this._dom_input.disabled = disabled;
		this._setState(disabled ? 'DISABLED' : 'DEFAULT');
	}

	get maxLength() {
		return this._max_length;
	}

	set maxLength(length) {
		this._max_length = length;
		this._dom_input.setAttribute('maxlength', length);
	}

	get restrict() {
		return this._restrict_regex;
	}

	set restrict(regex) {
		if (regex instanceof RegExp) {
			regex = regex.toString().slice(1, -1)

			if (regex.charAt(0) !== '^') {
				regex = '^' + regex;
			}

			if (regex.charAt(regex.length - 1) !== '$') {
				regex = regex + '$';
			}

			regex = new RegExp(regex);
		} else {
			regex = new RegExp('^[' + regex + ']*$');
		}

		this._restrict_regex = regex;
	}

	get text() {
		return this._dom_input.value;
	}

	set text(text) {
		this._dom_input.value = text;
		if (this._substituted) {
			this._updatePIXIField();
		}
	}

	get htmlInput() {
		return this._dom_input;
	}

	get isValid() {
		return this.state === 'VALID';
	}

	focus() {
		if (this._substituted && !this.dom_visible) {
			this._setDOMInputVisible(true);
		}

		this._dom_input.focus();
	}

	blur() {
		this._dom_input.blur();
	}

	select() {
		this.focus();
		this._dom_input.select();
	}

	setInputStyle(key, value, updateStyle) {
		this._dom_input.style[key] = value;
		this._dom_copy.style[key] = value;
		var valueWithUnity = ['fontSize', 'padding', 'width'];
		if (typeof value !== 'number' && valueWithUnity.includes(key)) {
			value = parseInt(value.replace('px', ''));
		}
		if (updateStyle === true) {
			this._styles[key] = value;
		}

		if (key === 'padding') {
			this._dom_copy.style.width = this._dom_copy.style.width - (this._dom_copy.style.padding * 2);
			this._dom_copy.style.padding = 0;
		}

		if (this._substituted && (key === 'fontFamily' || key === 'fontSize')) {
			this._updateFontMetrics();
		}

		if (this._last_renderer) {
			this._update();
		}
	}

	destroy(options) {
		this._destroyBoxCache();
		super.destroy(options);
	}

	addEventOn(name, callback) {
		if (!this._eventsCallback[name]) {
			this._eventsCallback[name] = [];
		}

		this._eventsCallback[name].push(callback);
	}

	_callEventOn(name, data) {
		if (this._eventsCallback[name]) {
			this._eventsCallback[name].forEach((callback) => {
				callback(data || null);
			});
		}
	}


	// SETUP

	_createDOMInput() {
		var id = new Date().getTime();
		if (this._multiline) {
			this._dom_input = document.createElement('textarea');
			this._dom_input.style.resize = 'none';
		} else {
			this._dom_input = document.createElement('input');
			this._dom_input.id = `input_${id}`;
			this._dom_input.type = this._type;
		}

		this._dom_copy = document.createElement('p');
		this._dom_copy.id = `copy_${id}`;
		this._dom_copy.style.textAlign = 'left';
		this._dom_copy.style.overflow = 'hidden';
		this._dom_copy.style.whiteSpace = 'nowrap';

		this._updateDOMStyle();
	}

	_updateDOMStyle() {
		var valueWithUnity = ['fontSize', 'padding', 'width'];
		for (let key in this._styles) {
			var value = this._styles[key];
			if (typeof value === 'number' && valueWithUnity.includes(key)) {
				value += 'px';
			}
			this.setInputStyle(key, value);
		}
	}

	_addListeners() {
		this.on('added', this._onAdded.bind(this));
		this.on('removed', this._onRemoved.bind(this));

		this._dom_input.addEventListener('keydown', this._onInputKeyDown.bind(this));
		this._dom_input.addEventListener('click', this._onInputKeyDown.bind(this));
		this._dom_input.addEventListener('input', this._onInputInput.bind(this));
		this._dom_input.addEventListener('keyup', this._onInputKeyUp.bind(this));
		this._dom_input.addEventListener('focus', this._onFocused.bind(this));
		this._dom_input.addEventListener('blur', this._onBlurred.bind(this));
	}

	_onInputKeyDown(e) {
		this._selection = [
			this._dom_input.selectionStart,
			this._dom_input.selectionEnd,
		];
		this._updateCaret();
		this.emit('keydown', e.keyCode);
	}

	_onInputInput(e) {
		if (this._restrict_regex) {
			this._applyRestriction();
		}

		if (this._substituted) {
			this._updateSubstitution();
		}

		this._updateCaret();
		this._updateDOMCopy();
		this.value = this.text;
		this.emit('input', this.text);
	}

	_onInputKeyUp(e) {
		this.emit('keyup', e.keyCode);
	}

	_onFocused() {
		this._setState('FOCUSED');
		this.emit('focus');
	}

	_onBlurred() {
		const state = this._checkRules();
		this._setState(state);
		this.emit('blur');
	}

	_onAdded() {
		document.body.appendChild(this._dom_input);
		document.body.appendChild(this._dom_copy);
		this._dom_input.style.display = 'none';
		this._dom_copy.style.display = 'none';
		this._dom_added = true;
	}

	_onRemoved() {
		document.body.removeChild(this._dom_input);
		this._dom_added = false;
	}

	_setState(state) {
		this.state = state;
		this._callEventOn('statechange', state);
		this._updateBox();
		if (this._substituted) {
			this._updateSubstitution();
		}
	}

	// Allows to check email, number, string and min length
	_checkRules() {
		const emailRegexp = /^([a-z0-9-_]+){2}@([a-z0-9-_]+){2}\.([a-z]+){2}$/;
		const numberRegexp = /^\d+$/;
		const stringRegexp = /^(?:.*[A-Za-z])$/;

		let state = 'VALID';

		for (let i = 0, li = this._rules.length; i < li; i++) {
			const rule = this._rules[i];

			if (!rule.type) {
				if (!rule.validator) {
					console.warn('you must set validate function to performed');
				} else {
					if (!rule.validator(this.text)) {
						state = 'ERROR';
					}
				}
			} else {
				if (rule.type === 'required') {
					if (!this.text || !this.text.trim().length) {
						state = 'ERROR';
					} else {
						continue;
					}
				}

				if (this.text) {
					if (rule.type === 'email') {
						if (!emailRegexp.test(this.text)) {
							state = 'ERROR';
						} else {
							continue;
						}
					} else if (rule.type === 'number') {
						if (!numberRegexp.test(this.text)) {
							state = 'ERROR';
						} else {
							continue;
						}
					} else if (rule.type === 'string') {
						if (!stringRegexp.test(this.text)) {
							state = 'ERROR';
						} else {
							continue;
						}
					} else if (rule.type.includes('min:')) {
						const minLength = parseInt(rule.type.replace('min:', ''));
						if (this.text.length < minLength) {
							state = 'ERROR';
						} else {
							continue;
						}
					}
				}
			}

			if (state === 'ERROR') {
				if (rule.onFail) {
					rule.onFail();
				}
				break;
			}
		}

		return state;
	}

	// RENDER & UPDATE

	// for pixi v4
	renderWebGL(renderer) {
		super.renderWebGL(renderer);
		this._renderInternal(renderer);
	}

	// for pixi v4
	renderCanvas(renderer) {
		super.renderCanvas(renderer);
		this._renderInternal(renderer);
	}

	// for pixi v5
	render(renderer) {
		super.render(renderer);
		this._renderInternal(renderer);
	}

	_renderInternal(renderer) {
		this._resolution = renderer.resolution;
		this._last_renderer = renderer;
		this._canvas_bounds = this._getCanvasBounds();
		if (this._needsUpdate()) {
			this._update();
		}
	}

	_update() {
		this._updateDOMInput();
		this._createCaret();
		if (this._substituted) {
			this._updatePIXIField();
		}
		this._updateBox();
	}

	_updateDOMCopy() {
		const text = this.text.split('');
		const domText = text.map((letter) => {
			if (this._type !== 'password') {
				if (letter === ' ') {
					letter = '&nbsp;';
				}
			} else {
				letter = '•';
			}
			return `<span style="display:inline-block;">${letter}</span>`;
		});
		this._dom_copy.innerHTML = domText.join('');
	}

	_updateCaret() {
		setTimeout(() => {
			let caretX = this._styles.padding;
			this._scrollDiff = this._dom_copy.offsetWidth - this._dom_copy.scrollWidth;

			if (this._dom_copy.childNodes.length && this._dom_input.selectionEnd) {
				this._caretSpan = this._dom_copy.childNodes[this._dom_input.selectionEnd - 1];
				this._spanDiff = this._dom_copy.offsetWidth - (this._caretSpan.offsetLeft + this._caretSpan.offsetWidth);
				// console.log('diff / spanDiff', this._dom_copy.offsetWidth, this._scrollDiff, this._spanDiff);

				if (this._scrollDiff < 0 && this._scrollDiff === this._spanDiff) {
					caretX = caretX + this._dom_copy.offsetWidth;
				} else {
					caretX = caretX + this._caretSpan.offsetLeft + this._caretSpan.offsetWidth + this._scrollDiff;
					if (caretX < this._styles.padding) {
						caretX = this._styles.padding;
					}
				}
			} else {
				this._spanDiff = this._dom_copy.offsetWidth;
			}

			this._caret.x = caretX;
			this._caret.y = this._styles.padding;
			this._caret.height = this._font_metrics.fontSize + 4;
			this._updatePIXIField();
		}, 50);
	}

	_updateCaretPosition(x) {
	}

	_createCaret() {
		if (this._caret) {
			this._updateCaret();
			return;
		}

		this._caret = new Caret({
			fill: 0x333333,
			width: 2,
			height: this._font_metrics.fontSize,
			gsap: this._gsap,
		});

		this._caret.visible = false;

		this.addChild(this._caret);
	}

	_updateBox() {
		if (!this._box_generator) {
			return;
		}

		if (this._needsNewBoxCache()) {
			this._buildBoxCache();
		}

		if (!this.state) {
			return;
		}

		const [box] = this._box_cache[this.state];

		if (this.state === this._previous.state
			&& this._box === box) {
			return;
		}

		if (this._box) {
			this.removeChild(this._box);
		}
		if (this._boxShadow) {
			this.removeChild(this._boxShadow);
		}

		[this._box, this._boxShadow] = this._box_cache[this.state];

		this.addChildAt(this._boxShadow, 1);
		this.addChildAt(this._box, 2);
		this._previous.state = this.state;
	}

	_updateSubstitution() {
		if (this.state === 'FOCUSED') {
			this._dom_visible = true;
			// this._pixi_field.visible = false;
			if (this._caret) {
				this._caret.visible = true;
			}
		} else {
			// this._dom_visible = false;
			// this._pixi_field.visible = true;
			if (this._caret) {
				this._caret.visible = false;
			}
		}
		// this._dom_visible = true;
		// this._pixi_field.visible = true;
		this._updateDOMInput();
		this._updatePIXIField();
	}

	_updateDOMInput() {
		if (!this._canvas_bounds) {
			return;
		}

		this._dom_input.style.zIndex = -10;
		this._dom_input.style.top = (this._canvas_bounds.top + this.height || 0) + 'px';
		this._dom_input.style.left = (this._canvas_bounds.left || 0) + 'px';
		this._dom_input.style.transform = this._pixiMatrixToCSS(this._getDOMRelativeWorldTransform());
		this._dom_input.style.opacity = this.worldAlpha;
		this._setDOMInputVisible(this.worldVisible && this._dom_visible);

		this._dom_copy.style.zIndex = -10;
		this._dom_copy.style.top = (this._canvas_bounds.top + (this.height * 2) || 0) + 'px';
		this._dom_copy.style.left = (this._canvas_bounds.left || 0) + 'px';
		this._dom_copy.style.transform = this._pixiMatrixToCSS(this._getDOMRelativeWorldTransform());
		this._dom_copy.style.opacity = this.worldAlpha;

		this._previous.canvas_bounds = this._canvas_bounds;
		this._previous.world_transform = this.worldTransform.clone();
		this._previous.world_alpha = this.worldAlpha;
		this._previous.world_visible = this.worldVisible;
	}

	_applyRestriction() {
		if (this._restrict_regex.test(this.text)) {
			this._restrict_value = this.text;
		} else {
			this.text = this._restrict_value;
			this._dom_input.setSelectionRange(this._selection[0], this._selection[1]);
		}
	}

	// STATE COMPAIRSON (FOR PERFORMANCE BENEFITS)

	_needsUpdate() {
		return (
			!this._comparePixiMatrices(this.worldTransform, this._previous.world_transform)
			|| !this._compareClientRects(this._canvas_bounds, this._previous.canvas_bounds)
			|| this.worldAlpha != this._previous.world_alpha
			|| this.worldVisible != this._previous.world_visible
		);
	}

	_needsNewBoxCache() {
		let input_bounds = this._getDOMInputBounds();
		return (
			!this._previous.input_bounds
			|| input_bounds.width != this._previous.input_bounds.width
			|| input_bounds.height != this._previous.input_bounds.height
		);
	}

	// INPUT SUBSTITUTION

	_createPIXIField() {
		this._pixi_field_hitbox = new PIXI.Graphics();
		this._pixi_field_hitbox.alpha = 0;
		this._pixi_field_hitbox.interactive = true;
		this._pixi_field_hitbox.caret = 'text';
		this._pixi_field_hitbox.on('pointerdown', this._onPIXIFieldFocus.bind(this));
		this._pixi_field_hitbox.on('pointerupoutside', this.blur.bind(this));
		this.addChild(this._pixi_field_hitbox);

		this._pixi_field_mask = new PIXI.Graphics();
		this.addChild(this._pixi_field_mask);

		this._pixi_field = new PIXI.Text('', {});
		this.addChild(this._pixi_field);

		this._pixi_field.mask = this._pixi_field_mask;

		this._updateFontMetrics();
		this._updatePIXIField();
	}

	_updatePIXIField() {
		let padding = this._derivePIXIFieldPadding();
		let input_bounds = this._getDOMInputBounds();

		this._pixi_field.alpha = this.state === 'DISABLED' ? 0.6 : 1;
		this._pixi_field.style = this._derivePIXIFieldStyle();
		this._pixi_field.style.padding = Math.max.apply(Math, padding);
		this._pixi_field.y = this._multiline ? padding[0] : (input_bounds.height - this._pixi_field.height) / 2;
		this._pixi_field.text = this._derivePIXIFieldText();

		let fieldX = padding[3];
		switch (this._pixi_field.style.align) {
			case 'left':
				fieldX = padding[3];
				break

			case 'center':
				fieldX = input_bounds.width * 0.5 - this._pixi_field.width * 0.5;
				break

			case 'right':
				fieldX = input_bounds.width - padding[1] - this._pixi_field.width;
				break
		}

		let diff = this._dom_copy.offsetWidth - this._dom_copy.scrollWidth;
		if (diff < 0 && this._spanDiff !== this._dom_copy.offsetWidth) {
			if (this._caret && (this._scrollDiff + this._dom_copy.offsetWidth) < this._spanDiff) {
				diff += this._spanDiff - (this._scrollDiff + this._dom_copy.offsetWidth);
			}
			console.log('_scrollDiff', this._scrollDiff, this._spanDiff, diff);
			this._pixi_field.x = fieldX + diff;
		} else {
			this._pixi_field.x = fieldX;
		}

		this._updatePIXIFieldHitbox(input_bounds);
		this._updatePIXIFieldMask(input_bounds, padding);
	}

	_updatePIXIFieldHitbox(bounds) {
		this._pixi_field_hitbox.clear();
		this._pixi_field_hitbox.beginFill(0);
		this._pixi_field_hitbox.drawRect(0, 0, bounds.width, bounds.height);
		this._pixi_field_hitbox.endFill();
		this._pixi_field_hitbox.interactive = !this._disabled;
	}

	_updatePIXIFieldMask(bounds, padding) {
		this._pixi_field_mask.clear();
		this._pixi_field_mask.beginFill(0);
		this._pixi_field_mask.drawRect(padding[3], 0, bounds.width - padding[3] - padding[1], bounds.height);
		this._pixi_field_mask.endFill();
	}

	_destroyPIXIField() {
		if (!this._pixi_field) {
			return;
		}

		this.removeChild(this._pixi_field);
		this.removeChild(this._pixi_field_hitbox);

		this._pixi_field.destroy();
		this._pixi_field_hitbox.destroy();

		this._pixi_field = null;
		this._pixi_field_hitbox = null;
	}

	_onPIXIFieldFocus() {
		this._callEventOn('pointerdown');
		this._setDOMInputVisible(true);
		//sometimes the input is not being focused by the mouseclick
		setTimeout(this._ensureFocus.bind(this), 10);
	}

	_ensureFocus() {
		if (!this._hasFocus()) {
			this.focus();
		}
	}

	_derivePIXIFieldStyle() {
		let style = new PIXI.TextStyle();

		for (var key in this._styles) {
			switch (key) {
				case 'color':
					style.fill = this._styles.color;
					break

				case 'fontFamily':
				case 'fontSize':
				case 'fontWeight':
				case 'fontVariant':
				case 'fontStyle':
					style[key] = this._styles[key];
					break

				case 'letterSpacing':
					style.letterSpacing = parseFloat(this._styles.letterSpacing);
					break

				case 'textAlign':
					style.align = this._styles.textAlign;
					break
			}
		}

		if (this._multiline) {
			style.lineHeight = parseFloat(style.fontSize);
			style.wordWrap = true;
			style.wordWrapWidth = this._getDOMInputBounds().width;
		}

		if (this._dom_input.value.length === 0) {
			style.fill = this._placeholderColor;
		}

		return style;
	}

	_derivePIXIFieldPadding() {
		let indent = this._styles.textIndent ? parseFloat(this._styles.textIndent) : 0
		const padding = this._styles.padding

		if (padding) {
			let components = typeof padding === 'string' ? padding.trim().split(' ') : [padding + 'px'];

			if (components.length === 1) {
				let padding = parseFloat(components[0]);
				return [padding, padding, padding, padding + indent];

			} else if (components.length === 2) {
				let paddingV = parseFloat(components[0]);
				let paddingH = parseFloat(components[1]);
				return [paddingV, paddingH, paddingV, paddingH + indent];

			} else if (components.length === 4) {
				let padding = components.map(component => {
					return parseFloat(component);
				});
				padding[3] += indent;
				return padding;
			}
		}

		return [0, 0, 0, indent];
	}

	_derivePIXIFieldText() {
		if (this._dom_input.value.length === 0) {
			return this._placeholder;
		}

		if (this._dom_input.type === 'password') {
			return '•'.repeat(this._dom_input.value.length);
		}

		return this._dom_input.value;
	}

	_updateFontMetrics() {
		const style = this._derivePIXIFieldStyle();
		const font = style.toFontString();

		this._font_metrics = PIXI.TextMetrics.measureFont(font);
	}


	// CACHING OF INPUT BOX GRAPHICS

	_buildBoxCache() {
		this._destroyBoxCache();

		let states = ['DEFAULT', 'FOCUSED', 'DISABLED', 'VALID', 'ERROR'];
		let input_bounds = this._getDOMInputBounds();

		for (let i in states) {
			const [box, boxShadow] = this._box_generator(
				input_bounds.width,
				input_bounds.height,
				states[i]
			);

			if (box) {
				this._box_cache[states[i]] = [box, boxShadow];
			}
		}

		this._previous.input_bounds = input_bounds;
	}

	_destroyBoxCache() {
		if (this._box) {
			this.removeChild(this._box);
			this._box = null;
		}

		for (let i in this._box_cache) {
			this._box_cache[i].forEach((box) => box.destroy());
			this._box_cache[i] = null;
			delete this._box_cache[i];
		}
	}

	// HELPER FUNCTIONS

	_hasFocus() {
		return document.activeElement === this._dom_input;
	}

	_setDOMInputVisible(visible) {
		this._dom_input.style.display = visible ? 'block' : 'none';
		this._dom_copy.style.display = visible ? 'block' : 'none';
	}

	_getCanvasBounds() {
		let rect = this._last_renderer.view.getBoundingClientRect();
		let bounds = { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
		bounds.left += window.scrollX;
		bounds.top += window.scrollY;
		return bounds;
	}

	_getDOMInputBounds() {
		let remove_after = false;

		if (!this._dom_added) {
			document.body.appendChild(this._dom_input);
			remove_after = true;
		}

		let org_transform = this._dom_input.style.transform;
		let org_display = this._dom_input.style.display;
		this._dom_input.style.transform = '';
		this._dom_input.style.display = 'block';
		this._dom_copy.style.transform = '';
		this._dom_copy.style.display = 'block';
		let bounds = this._dom_input.getBoundingClientRect();
		this._dom_input.style.transform = org_transform;
		this._dom_input.style.display = org_display;
		this._dom_copy.style.transform = org_transform;
		this._dom_copy.style.display = org_display;

		if (remove_after) {
			document.body.removeChild(this._dom_input);
		}

		return bounds;
	}

	_getDOMRelativeWorldTransform() {
		let canvas_bounds = this._last_renderer.view.getBoundingClientRect();
		let matrix = this.worldTransform.clone();

		matrix.scale(this._resolution, this._resolution);
		matrix.scale(canvas_bounds.width / this._last_renderer.width,
			canvas_bounds.height / this._last_renderer.height);
		return matrix;
	}

	_pixiMatrixToCSS(m) {
		return 'matrix(' + [m.a, m.b, m.c, m.d, m.tx, m.ty].join(',') + ')';
	}

	_comparePixiMatrices(m1, m2) {
		if (!m1 || !m2) {
			return false;
		}

		return (
			m1.a === m2.a
			&& m1.b === m2.b
			&& m1.c === m2.c
			&& m1.d === m2.d
			&& m1.tx === m2.tx
			&& m1.ty === m2.ty
		);
	}

	_compareClientRects(r1, r2) {
		if (!r1 || !r2) {
			return false;
		}

		return (
			r1.left === r2.left
			&& r1.top === r2.top
			&& r1.width === r2.width
			&& r1.height === r2.height
		);
	}
}

class Caret extends PIXI.Graphics {
	constructor(options) {
		super();

		this.offsetLeft = 0;
		this.alpha = 0.8;
		this.beginFill(options.fill);
		this.drawRect(0, 0, options.width, options.height);
		this.endFill();
		this.closePath();

		if (options.gsap) {
			options.gsap.to(this, { alpha: 0, duration: 0.4, loop: true, ease: "power1.inOut", repeat: -1, yoyo: true });
		} else {
			this._animateCaret();
		}
	}

	_animateCaret() {
		this.alpha = 0.8;
		setTimeout(() => {
			this.alpha = 0;
			setTimeout(() => {
				this._animateCaret();
			}, 400);
		}, 400);
	}
}

function BoxGenerator(options) {
	if (options.default) {
		options.focused = options.focused || options.default;
		options.disabled = options.disabled || options.default;
	} else {
		let temp_styles = options;
		options = {};
		options.default = options.focused = options.disabled = temp_styles;
	}

	return function (w, h, state) {
		let style = options[state.toLowerCase()];
		if (style) {
			let box = new PIXI.Graphics();
			if (style.color) {
				box.beginFill(style.color);
			}
			box.drawRoundedRect(0, 0, w, h, style.border.radius);
			box.endFill();

			let boxShadow = null;

			if (style.border && style.border.width) {
				boxShadow = new PIXI.Graphics();
				let sx = 0;
				let sy = 0;
				let sw = w;
				let sh = h;
				switch (style.border.position) {
					case 'all':
						sx -= style.border.width;
						sy -= style.border.width;
						sw += style.border.width * 2;
						sh += style.border.width * 2;
						break;
					case 'left':
						sx -= style.border.width;
						break;
					case 'right':
						sx += style.border.width;
						break;
					case 'top':
						sy -= style.border.width;
						break;
					case 'bottom':
					default:
						sy += style.border.width;
				}
				boxShadow.beginFill(style.border.color);
				boxShadow.drawRoundedRect(sx, sy, sw, sh, style.border.radius + style.border.width);
				boxShadow.endFill();
			}

			return [box, boxShadow];
		}
	}
}