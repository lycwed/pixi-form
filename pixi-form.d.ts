/// <reference types="pixi.js" />
/// <reference types="gsap" />

declare namespace PIXI {
  namespace form {
    export type STATUS = 'FOCUSED' | 'DISABLED' | 'DEFAULT' | 'VALID' | 'ERROR' | string;

    export type TextInputRule = {
      type?: string;
      validate?: (value: any) => boolean;
      onFail: () => void;
    };

    export type TextInputOptions = {
      type: string;
      placeholder: string;
      rules?: TextInputRule[];
      styles?: TextInputStyles;
      gsap?: typeof gsap;
    };

    export type FormOptions = {
      width: number;
      height: number;
      padding: number;
      alignItems: string;
      spaceBetween: number;
    };

    export class Form extends PIXI.Container {
      width: number;
      height: number;
      _padding: number;
      _alignItems: string;
      _spaceBetween: number;
      _inputs: TextInput[];
      _backdrop: PIXI.Graphics;
      _submitButton: PIXI.DisplayObject;
      _events: {
        [name: string]: () => void;
      };

      constructor(options: FormOptions);

      addInput(input: PIXI.form.TextInput): void;
      on(event: string, callback: () => void): void;
      setSubmitButton(button: PIXI.DisplayObject): void;

      _disableSubmit(): void;
      _enableSubmit(): void;
      _updateSubmit(): void;

      get data(): any;
    }

    export class TextInputStylesOptions {
      width: number;
      color?: number;
      padding?: number;
      fontSize?: number;
      fontFamily?: string;
      backgroundColor?: number;
      position?: string;
      border?: {
        color?: number;
        width?: number;
        radius?: number;
      };
      constructor(options?: TextInputStyles);
    }

    export class TextInputStyles {
      width: number;
      color?: number;
      padding?: number;
      fontSize?: number;
      fontFamily?: string;
      backgroundColor?: number;
      position?: string;
      border?: {
        color?: number;
        width?: number;
        radius?: number;
      };
      outline?: string;
      lineHeight?: string;
      multiline?: boolean;

      constructor(options?: TextInputStylesOptions);
    }

    export class TextInput extends PIXI.Container {
      _type: string;
      _placeholder: string;
      _rules: TextInputRule[];
      _styles: TextInputStyles;
      _placeholderColor: number;
      _box_generator: any;
      _box_cache: object;
      _previous: object;
      _dom_added: boolean;
      _dom_visible: boolean;
      _dom_input: object;
      _pixi_field: PIXI.Text;
      _pixi_field_mask: PIXI.Graphics;
      _pixi_field_hitbox: PIXI.Graphics;
      _selection: number[];
      _restrict_value: string;
      _restrict_regex: RegExp;
      _substituted: string;
      _disabled: boolean;
      _max_length: number;
      state: STATUS;

      constructor(options?: TextInputOptions);

      get substituteText(): string;
      set substituteText(substitute: string);

      get placeholder(): string;
      set placeholder(text: string);

      get disabled(): boolean;
      set disabled(n: boolean);

      get maxLength(): number;
      set maxLength(length: number);

      get restrict(): RegExp;
      set restrict(regex: RegExp);

      get htmlInput(): object;

      get text(): string;
      set text(text: string);

      get isValid(): boolean;

      focus(): void;

      blur(): void;

      select(): void;

      setInputStyle(n: string, v: any): void;

      destroy(options): void;

      addEventOn(name: string, callback: () => void): void;

      _callEventOn(name: string, data: any): void;

      protected _createDOMInput(): void;

      protected _updateDOMStyle(): void;

      protected _addListeners(): void;

      _onInputKeyDown(e: KeyboardEvent | TouchEvent): void;

      _onInputInput(e: KeyboardEvent | TouchEvent): void;

      _onInputKeyUp(e: KeyboardEvent | TouchEvent): void;

      _onFocused(): void;

      _onBlurred(): void;

      _onAdded(): void;

      _onRemoved(): void;

      _setState(state: STATUS): void;

      _checkRules(): string;

      renderWebGL(renderer: PIXI.Renderer): void;

      renderCanvas(renderer: PIXI.Renderer): void;

      render(renderer: PIXI.Renderer): void;

      _renderInternal(renderer: PIXI.Renderer): void;

      _update(): void;

      _updateBox(): void;

      _updateSubstitution(): void;

      _updateDOMInput(): void;

      _applyRestriction(): void;

      _needsUpdate(): boolean;

      _needsNewBoxCache(): boolean;

      _createPIXIField(): void;

      _updatePIXIField(): void;

      _updatePIXIFieldHitbox(bounds: PIXI.Bounds): void;

      _updatePIXIFieldMask(bounds: PIXI.Bounds, paddings: number[]): void;

      _destroyPIXIField(): void;

      _onPIXIFieldFocus(): void;

      _ensureFocus(): void;

      _derivePIXIFieldStyle(): PIXI.TextStyle;

      _derivePIXIFieldPadding(): number[];

      _derivePIXIFieldText(): string;

      _updateFontMetrics(): void;

      _buildBoxCache(): void;

      _destroyBoxCache(): void;

      _hasFocus(): boolean;

      _setDOMInputVisible(visible: boolean): void;

      _getCanvasBounds(): DOMRect;

      _getDOMInputBounds(): DOMRect;

      _getDOMRelativeWorldTransform(): PIXI.Matrix;

      _pixiMatrixToCSS(m: object): string;

      _comparePixiMatrices(m1: object, m2: object): boolean;

      _compareClientRects(r1: object, r2: object): boolean;
    }
  }
}

declare module "pixi-form" {
    export = PIXI.form;
}