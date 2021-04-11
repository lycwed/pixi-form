/// <reference types="pixi.js" />

declare module 'pixi-text-input-plus' {
  type STATUS = 'FOCUSED' | 'DISABLED' | 'DEFAULT' | 'VALID' | 'ERROR' | string;

  export type TextInputRule = {
    type: string;
    onError: () => void;
    validate?: (value: any) => boolean;
  };

  export type TextInputOptions = {
    position?: string;
    background?: string;
    border?: string;
    outline?: string;
    lineHeight?: string;
    multiline?: boolean;
    box?: any;
    input?: any;
    type?: string;
    rules?: TextInputRule[];
  }

  export class TextInput extends PIXI.Container {
    _input_style: TextInputOptions;
    _box_generator: any;
    _box_cache: object;
    _previous: object;
    _dom_added: boolean;
    _dom_visible: boolean;
    _dom_input: object;
    _placeholder: string;
    _placeholderColor: number;
    _selection: number[];
    _restrict_value: string;
    _restrict_regex: RegExp;
    _substituted: string;
    _disabled: boolean;
    _max_length: number;
    _type: string;
    _rules: TextInputRule[];
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

    focus(): void;

    blur(): void;

    select(): void;

    setInputStyle(n: string, v: any): void;

    destroy(): void;

    protected _createDOMInput(): void;

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

    _createSurrogate(): void;

    _updateSurrogate(): void;

    _updateSurrogateHitbox(bounds: PIXI.Bounds): void;

    _updateSurrogateMask(bounds: PIXI.Bounds, paddings: number[]): void;

    _destroySurrogate(): void;

    _onSurrogateFocus(): void;

    _ensureFocus(): void;

    _deriveSurrogateStyle(): PIXI.TextStyle;

    _deriveSurrogatePadding(): number[];

    _deriveSurrogateText(): string;

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
