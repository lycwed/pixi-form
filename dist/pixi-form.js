(()=>{var t={138:(t,i,e)=>{var s=e(262),h={form:{Form:s.Form,Input:s.Input,InputStyles:s.InputStyles,Button:s.Button}};Object.assign(PIXI,h),t.exports=h},262:(t,i,e)=>{"use strict";e.r(i),e.d(i,{Form:()=>s,Button:()=>h,InputStyles:()=>o,Input:()=>d});class s extends PIXI.Container{constructor(t){super(),this.isForm=!0,this.id=t.id||"form",this.width=t.width,this.height=t.height,this._padding=t.padding||10,this._alignItems=t.alignItems||"left",this._spaceBetween=t.spaceBetween||4,this._inputs=[],this._buttons={},this._events={},this._backdrop=new PIXI.Graphics,this._backdrop.beginFill(16777215),this._backdrop.drawRect(0,0,t.width,t.height),this._backdrop.endFill(),this._backdrop.on("pointerdown",(()=>{this._inputs.forEach((t=>{t.blur(),this._backdrop.interactive=!1}))})),this.addChild(this._backdrop)}addInput(t){const i=this._inputs.length?this._inputs[this._inputs.length-1].height:0;switch(t.y=this._padding+(i+this._spaceBetween)*this._inputs.length,this._alignItems){case"center":t.x=this.width/2,t.pivot.x=t.width/2,t.pivot.y=0;break;case"left":t.x=this._padding}this._inputs.push(t),t.addEventOn("pointerdown",(()=>{this._backdrop.interactive=!0})),t.addEventOn("inputchange",(()=>{this._updateSubmit()})),t.addEventOn("statechange",(()=>{this._updateSubmit()})),this.addChild(t)}setButton(t){this._buttons[t.type]=t,this._events[t.type]=t.onTap,"submit"===t.type&&(t.on("pointerdown",(()=>{this._events.submit&&this._events.submit(this.data)})),this._disableSubmit()),this.addChild(t),this._updateButtons()}get data(){const t={};return this._inputs.forEach((i=>{t[i.name]=i.value})),t}_disableSubmit(){this._buttons.submit&&(this._buttons.submit.alpha=.6,this._buttons.submit.interactive=!1)}_enableSubmit(){this._buttons.submit&&(this._buttons.submit.alpha=1,this._buttons.submit.interactive=!0)}_updateSubmit(){let t=!0;this._inputs.forEach((i=>{i.isValid||(t=!1)})),t?this._enableSubmit():this._disableSubmit()}_updateButtons(){const t=this._inputs.length?this._inputs[this._inputs.length-1].height:0;this._buttons.submit.y=this._padding+(t+this._spaceBetween)*this._inputs.length,this._buttons.submit.x=this.width/2,this._buttons.submit.pivot.x=this._buttons.submit.width/2,this._buttons.submit.pivot.y=0}}class h extends PIXI.Graphics{constructor(t){super(),this.isButton=!0,this.type=t.type,this.label=t.label,this.onTap=t.onTap;const i=Object.assign({color:3355443,fontFamily:"Arial",fontSize:13,padding:4,backgroundColor:15724527,border:{width:1,radius:4,color:16777215}},t.styles||{}),e=t.styles.width+2*i.padding,s=i.fontSize+8+2*i.padding;this.lineStyle(i.border.width,i.border.color,1,0),this.beginFill(i.backgroundColor),this.drawRoundedRect(0,0,e,s,i.border.radius),this.endFill();const h=new PIXI.TextStyle({fontFamily:i.fontFamily,fontSize:i.fontSize,fill:i.color,align:"center"});this.text=new PIXI.Text(this.label,h),this.text.x=this.width/2,this.text.y=this.height/2,this.text.pivot.x=this.text.width/2,this.text.pivot.y=this.text.height/2,this.text.alpha=.8,this.on("pointerover",(()=>{gsap?(gsap.to(this.scale,{x:.99,y:.99,duration:.3,ease:"power.2"}),gsap.to(this.text,{alpha:1,duration:.3,ease:"power.2"})):(this.scale.set(.99),this.text.alpha=1)})),this.on("pointerout",(()=>{gsap?(gsap.to(this.scale,{x:1,y:1,duration:.3,ease:"power.2"}),gsap.to(this.text,{alpha:.8,duration:.3,ease:"power.2"})):(this.scale.set(1),this.text.alpha=.8)})),this.addChild(this.text)}}class o{constructor(t){this.width=t.width||200,this.color=t.color||3355443,this.padding=t.padding||4,this.fontSize=t.fontSize||13,this.fontFamily=t.fontFamily||"Arial",this.selectionColor=t.selectionColor||43775,this.backgroundColor=t.backgroundColor||15724527,this.border={color:16777215,width:0,radius:0,...t.border}}}class d extends PIXI.Container{constructor(t){super(),this.isInput=!0,this.name=t.name,this.value=t.value||"",this._type=t.type||"text",this._placeholder=t.placeholder,this._rules=t.rules||[],this._styles=Object.assign({position:"absolute",backgroundColor:16777215,transformOrigin:"0 0",outline:"none",border:null,lineHeight:"1"},t.styles||new o({})),this._input_box=new _({default:{color:this._styles.backgroundColor,border:this._styles.border},focused:{color:this._styles.backgroundColor,border:this._styles.border},disabled:{color:this._styles.backgroundColor,border:this._styles.border},error:{color:this._styles.backgroundColor,border:{...this._styles.border,color:16711680}},valid:{color:this._styles.backgroundColor,border:{...this._styles.border,color:65280}}}),this._styles.hasOwnProperty("multiline")?(this._multiline=!!this._styles.multiline,delete this._styles.multiline):this._multiline=!1,this.isValid=!this._rules.length,this._eventsCallback={},this._box_cache={},this._previous={},this._dom_added=!1,this._dom_visible=!0,this._placeholderColor=11119017,this._selection=[0,0],this._restrict_value="",this._createDOMInput(),this.substituteText=!0,this._setState("DEFAULT"),this._addListeners()}get substituteText(){return this._substituted}set substituteText(t){this._substituted!==t&&(this._substituted=t,t?(this._createPIXIField(),this._createCaret(),this._dom_visible=!1):(this._destroyPIXIField(),this._dom_visible=!0),this.placeholder=this._placeholder,this._update())}get placeholder(){return this._placeholder}set placeholder(t){this._placeholder=t,this._substituted?(this._updatePIXIField(),this._dom_input.placeholder=""):this._dom_input.placeholder=t}get disabled(){return this._disabled}set disabled(t){this._disabled=t,this._dom_input.disabled=t,this._setState(t?"DISABLED":"DEFAULT")}get maxLength(){return this._max_length}set maxLength(t){this._max_length=t,this._dom_input.setAttribute("maxlength",t)}get restrict(){return this._restrict_regex}set restrict(t){t instanceof RegExp?("^"!==(t=t.toString().slice(1,-1)).charAt(0)&&(t="^"+t),"$"!==t.charAt(t.length-1)&&(t+="$"),t=new RegExp(t)):t=new RegExp("^["+t+"]*$"),this._restrict_regex=t}get text(){return this._dom_input.value}set text(t){this._dom_input.value=t,this._substituted&&this._updatePIXIField()}get htmlInput(){return this._dom_input}focus(){this._substituted&&!this.dom_visible&&this._setDOMInputVisible(!0),this._dom_input.focus()}blur(){this._dom_input.blur()}select(){this.focus(),this._dom_input.select()}setInputStyle(t,i,e){this._dom_input.style[t]=i,this._dom_copy.style[t]=i,"number"!=typeof i&&["fontSize","padding","width"].includes(t)&&(i=parseInt(i.replace("px",""))),!0===e&&(this._styles[t]=i),"padding"===t&&(this._dom_copy.style.width=this._dom_copy.style.width-2*this._dom_copy.style.padding,this._dom_copy.style.padding=0),!this._substituted||"fontFamily"!==t&&"fontSize"!==t||this._updateFontMetrics(),this._last_renderer&&this._update()}destroy(t){this._destroyBoxCache(),super.destroy(t)}addEventOn(t,i){this._eventsCallback[t]||(this._eventsCallback[t]=[]),this._eventsCallback[t].push(i)}_callEventOn(t,i){this._eventsCallback[t]&&this._eventsCallback[t].forEach((t=>{t(i||null)}))}_createDOMInput(){var t=(new Date).getTime();this._multiline?(this._dom_input=document.createElement("textarea"),this._dom_input.style.resize="none"):(this._dom_input=document.createElement("input"),this._dom_input.id=`input_${t}`,this._dom_input.type=this._type),this._dom_copy=document.createElement("p"),this._dom_copy.id=`copy_${t}`,this._dom_copy.style.textAlign="left",this._dom_copy.style.overflow="hidden",this._dom_copy.style.whiteSpace="nowrap",this._updateDOMStyle()}_updateDOMStyle(){var t=["fontSize","padding","width"];for(let e in this._styles){var i=this._styles[e];"number"==typeof i&&t.includes(e)&&(i+="px"),this.setInputStyle(e,i)}}_addListeners(){this.on("added",this._onAdded.bind(this)),this.on("removed",this._onRemoved.bind(this)),this._dom_input.addEventListener("keydown",this._onInputKeyDown.bind(this)),this._dom_input.addEventListener("click",this._onInputKeyDown.bind(this)),this._dom_input.addEventListener("input",this._onInputInput.bind(this)),this._dom_input.addEventListener("keyup",this._onInputKeyUp.bind(this)),this._dom_input.addEventListener("focus",this._onFocused.bind(this)),this._dom_input.addEventListener("blur",this._onBlurred.bind(this))}_onInputKeyDown(t){if(this._selection=[this._dom_input.selectionStart,this._dom_input.selectionEnd],9!==t.keyCode)this._updateCaret(),this.emit("keydown",t.keyCode);else{t.stopPropagation(),t.preventDefault();const i=this.parent.children.length;let e=this.parent.children.findIndex((t=>t===this)),s=null;for(;!s;){const t=this.parent.children[e+1];console.log(t),t&&t.isInput?(s=t,t.focus()):e=e<i-1?e+1:0}}}_onInputInput(t){this._checkRules(!0),this._restrict_regex&&this._applyRestriction(),this._updateCaret(),this._updateDOMCopy(),this.value=this.text,this.emit("input",this.text)}_onInputKeyUp(t){this.emit("keyup",t.keyCode)}_onFocused(){this._setState("FOCUSED"),this.emit("focus")}_onBlurred(){const t=this._checkRules(!1);this._setState(t),this.emit("blur")}_onAdded(){document.body.appendChild(this._dom_input),document.body.appendChild(this._dom_copy),this._dom_input.style.display="none",this._dom_copy.style.display="none",this._dom_added=!0}_onRemoved(){document.body.removeChild(this._dom_input),this._dom_added=!1}_setState(t){this.state=t,this._updateBox(),this._substituted&&this._updateSubstitution()}_checkRules(t){const i=/^([a-z0-9-_]+){2}@([a-z0-9-_]+){2}\.([a-z]+){2}$/,e=/^\d+$/,s=/^(?:.*[A-Za-z])$/;let h="VALID";for(let o=0,d=this._rules.length;o<d;o++){const d=this._rules[o];if(d.type){if("required"===d.type){if(this.text&&this.text.trim().length)continue;h="ERROR"}if(this.text)if("email"===d.type){if(i.test(this.text))continue;h="ERROR"}else if("number"===d.type){if(e.test(this.text))continue;h="ERROR"}else if("string"===d.type){if(s.test(this.text))continue;h="ERROR"}else if(d.type.includes("min:")){const t=parseInt(d.type.replace("min:",""));if(!(this.text.length<t))continue;h="ERROR"}}else d.validator?d.validator(this.text)||(h="ERROR"):console.warn("you must set validate function to performed");if("ERROR"===h){d.onFail&&!t&&d.onFail();break}}return this.isValid="VALID"===h,this._callEventOn("statechange",this.isValid),h}renderWebGL(t){super.renderWebGL(t),this._renderInternal(t)}renderCanvas(t){super.renderCanvas(t),this._renderInternal(t)}render(t){super.render(t),this._renderInternal(t)}_renderInternal(t){this._resolution=t.resolution,this._last_renderer=t,this._canvas_bounds=this._getCanvasBounds(),this._needsUpdate()&&this._update()}_update(){this._updateDOMInput(),this._updateCaret(),this._substituted&&this._updatePIXIField(),this._updateBox()}_updateDOMCopy(){const t=this.text.split("").map((t=>("password"!==this._type?" "===t&&(t="&nbsp;"):t="•",`<span style="display:inline-block;">${t}</span>`)));this._dom_copy.innerHTML=t.join("")}_updateCaret(){setTimeout((()=>{let t=this._styles.padding;this._scrollDiff=this._dom_copy.offsetWidth-this._dom_copy.scrollWidth,this._dom_copy.childNodes.length&&this._dom_input.selectionStart?(this._caretSpan=this._dom_copy.childNodes[this._dom_input.selectionStart-1],this._spanDiff=this._dom_copy.offsetWidth-(this._caretSpan.offsetLeft+this._caretSpan.offsetWidth),this._scrollDiff<0&&this._scrollDiff===this._spanDiff?t+=this._dom_copy.offsetWidth:(t=t+this._caretSpan.offsetLeft+this._caretSpan.offsetWidth+this._scrollDiff,t<this._styles.padding&&(t=this._styles.padding))):this._spanDiff=this._dom_copy.offsetWidth,this._caret.x=t,this._caret.y=this._styles.padding,this._updateSelectionBox(),this._updatePIXIField()}),50)}_updateSelectionBox(){const t=Array.prototype.slice.call(this._dom_copy.childNodes);if(this._selectionBox.y=this._caret.y,this._dom_input.selectionStart!==this._dom_input.selectionEnd){const i=t.slice(this._dom_input.selectionStart,this._dom_input.selectionEnd).map((t=>t.offsetWidth)).reduce(((t,i)=>t+i));this._selectionBox.width=i,this._selectionBox.x=this._caret.x,this._selectionBox.alpha=.4,this._caret.visible=!1}else this._selectionBox.width=1,this._selectionBox.alpha=0,"FOCUSED"===this.state&&(this._caret.visible=!0)}_createSelectionBox(t){this._selectionBox=new PIXI.Graphics,this._selectionBox.beginFill(this._styles.selectionColor),this._selectionBox.drawRect(0,0,1,t),this._selectionBox.endFill(),this._selectionBox.closePath(),this._selectionBox.alpha=0,this._selectionBox.mask=this._pixi_field_mask,this.addChild(this._selectionBox)}_createCaret(){this._caret=new n({fill:3355443,width:2,height:this._font_metrics.fontSize+4}),this._caret.visible=!1,this._createSelectionBox(this._caret.height),this.addChild(this._caret)}_updateBox(){if(!this._input_box)return;if(this._needsNewBoxCache()&&this._buildBoxCache(),!this.state)return;const[t]=this._box_cache[this.state];this.state===this._previous.state&&this._box===t||(this._box&&this.removeChild(this._box),this._boxShadow&&this.removeChild(this._boxShadow),[this._box,this._boxShadow]=this._box_cache[this.state],this._boxShadow&&this.addChildAt(this._boxShadow,0),this.addChildAt(this._box,1),this._previous.state=this.state)}_updateSubstitution(){"FOCUSED"===this.state?(this._dom_visible=!0,this._caret&&(this._caret.visible=!0)):this._caret&&(this._caret.visible=!1),this._updateDOMInput(),this._updatePIXIField()}_updateDOMInput(){this._canvas_bounds&&(this._dom_input.style.zIndex=-10,this._dom_input.style.top=(this._canvas_bounds.top+this.height||0)+"px",this._dom_input.style.left=(this._canvas_bounds.left||0)+"px",this._dom_input.style.transform=this._pixiMatrixToCSS(this._getDOMRelativeWorldTransform()),this._dom_input.style.opacity=this.worldAlpha,this._setDOMInputVisible(this.worldVisible&&this._dom_visible),this._dom_copy.style.zIndex=-10,this._dom_copy.style.top=(this._canvas_bounds.top+2*this.height||0)+"px",this._dom_copy.style.left=(this._canvas_bounds.left||0)+"px",this._dom_copy.style.transform=this._pixiMatrixToCSS(this._getDOMRelativeWorldTransform()),this._dom_copy.style.opacity=this.worldAlpha,this._previous.canvas_bounds=this._canvas_bounds,this._previous.world_transform=this.worldTransform.clone(),this._previous.world_alpha=this.worldAlpha,this._previous.world_visible=this.worldVisible)}_applyRestriction(){this._restrict_regex.test(this.text)?this._restrict_value=this.text:(this.text=this._restrict_value,this._dom_input.setSelectionRange(this._selection[0],this._selection[1]))}_needsUpdate(){return!this._comparePixiMatrices(this.worldTransform,this._previous.world_transform)||!this._compareClientRects(this._canvas_bounds,this._previous.canvas_bounds)||this.worldAlpha!=this._previous.world_alpha||this.worldVisible!=this._previous.world_visible}_needsNewBoxCache(){let t=this._getDOMInputBounds();return!this._previous.input_bounds||t.width!=this._previous.input_bounds.width||t.height!=this._previous.input_bounds.height}_createPIXIField(){this._pixi_field_hitbox=new PIXI.Graphics,this._pixi_field_hitbox.alpha=0,this._pixi_field_hitbox.interactive=!0,this._pixi_field_hitbox.caret="text",this._pixi_field_hitbox.buttonMode=!0,this._pixi_field_hitbox.on("pointerdown",this._onPIXIFieldFocus.bind(this)),this._pixi_field_hitbox.on("pointerupoutside",this.blur.bind(this)),this.addChild(this._pixi_field_hitbox),this._pixi_field_mask=new PIXI.Graphics,this.addChild(this._pixi_field_mask),this._pixi_field=new PIXI.Text("",{}),this.addChild(this._pixi_field),this._pixi_field.mask=this._pixi_field_mask,this._updateFontMetrics(),this._updatePIXIField()}_updatePIXIField(){let t=this._derivePIXIFieldPadding(),i=this._getDOMInputBounds();this._pixi_field.alpha="DISABLED"===this.state?.6:1,this._pixi_field.style=this._derivePIXIFieldStyle(),this._pixi_field.style.padding=Math.max.apply(Math,t),this._pixi_field.y=this._multiline?t[0]:(i.height-this._pixi_field.height)/2,this._pixi_field.text=this._derivePIXIFieldText();let e=t[3];switch(this._pixi_field.style.align){case"left":e=t[3];break;case"center":e=.5*i.width-.5*this._pixi_field.width;break;case"right":e=i.width-t[1]-this._pixi_field.width}let s=this._dom_copy.offsetWidth-this._dom_copy.scrollWidth;s<0&&this._spanDiff!==this._dom_copy.offsetWidth?(this._caret&&this._scrollDiff+this._dom_copy.offsetWidth<this._spanDiff&&(s+=this._spanDiff-(this._scrollDiff+this._dom_copy.offsetWidth)),this._pixi_field.x=e+s):this._pixi_field.x=e,this._updatePIXIFieldHitbox(i),this._updatePIXIFieldMask(i,t)}_updatePIXIFieldHitbox(t){this._pixi_field_hitbox.clear(),this._pixi_field_hitbox.beginFill(0),this._pixi_field_hitbox.drawRect(0,0,t.width,t.height),this._pixi_field_hitbox.endFill(),this._pixi_field_hitbox.interactive=!this._disabled}_updatePIXIFieldMask(t,i){this._pixi_field_mask.clear(),this._pixi_field_mask.beginFill(0),this._pixi_field_mask.drawRect(i[3],0,t.width-i[3]-i[1],t.height),this._pixi_field_mask.endFill()}_destroyPIXIField(){this._pixi_field&&(this.removeChild(this._pixi_field),this.removeChild(this._pixi_field_hitbox),this._pixi_field.destroy(),this._pixi_field_hitbox.destroy(),this._pixi_field=null,this._pixi_field_hitbox=null)}_onPIXIFieldFocus(t){this._callEventOn("pointerdown"),this._setDOMInputVisible(!0),setTimeout(this._ensureFocus.bind(this),10)}_ensureFocus(){this._hasFocus()||this.focus()}_derivePIXIFieldStyle(){let t=new PIXI.TextStyle;for(var i in this._styles)switch(i){case"color":t.fill=this._styles.color;break;case"fontFamily":case"fontSize":case"fontWeight":case"fontVariant":case"fontStyle":t[i]=this._styles[i];break;case"letterSpacing":t.letterSpacing=parseFloat(this._styles.letterSpacing);break;case"textAlign":t.align=this._styles.textAlign}return this._multiline&&(t.lineHeight=parseFloat(t.fontSize),t.wordWrap=!0,t.wordWrapWidth=this._getDOMInputBounds().width),0===this._dom_input.value.length&&(t.fill=this._placeholderColor),t}_derivePIXIFieldPadding(){let t=this._styles.textIndent?parseFloat(this._styles.textIndent):0;const i=this._styles.padding;if(i){let e="string"==typeof i?i.trim().split(" "):[i+"px"];if(1===e.length){let i=parseFloat(e[0]);return[i,i,i,i+t]}if(2===e.length){let i=parseFloat(e[0]),s=parseFloat(e[1]);return[i,s,i,s+t]}if(4===e.length){let i=e.map((t=>parseFloat(t)));return i[3]+=t,i}}return[0,0,0,t]}_derivePIXIFieldText(){return 0===this._dom_input.value.length?this._placeholder:"password"===this._dom_input.type?"•".repeat(this._dom_input.value.length):this._dom_input.value}_updateFontMetrics(){const t=this._derivePIXIFieldStyle().toFontString();this._font_metrics=PIXI.TextMetrics.measureFont(t)}_buildBoxCache(){this._destroyBoxCache();let t=["DEFAULT","FOCUSED","DISABLED","VALID","ERROR"],i=this._getDOMInputBounds();for(let e in t){const[s,h]=this._input_box.generate(i.width,i.height,t[e]);s&&(this._box_cache[t[e]]=[s,h])}this._previous.input_bounds=i}_destroyBoxCache(){this._box&&(this.removeChild(this._box),this._box=null);for(let t in this._box_cache)this._box_cache[t].forEach((t=>t.destroy())),this._box_cache[t]=null,delete this._box_cache[t]}_hasFocus(){return document.activeElement===this._dom_input}_setDOMInputVisible(t){this._dom_input.style.display=t?"block":"none",this._dom_copy.style.display=t?"block":"none"}_getCanvasBounds(){let t=this._last_renderer.view.getBoundingClientRect(),i={top:t.top,left:t.left,width:t.width,height:t.height};return i.left+=window.scrollX,i.top+=window.scrollY,i}_getDOMInputBounds(){let t=!1;this._dom_added||(document.body.appendChild(this._dom_input),t=!0);let i=this._dom_input.style.transform,e=this._dom_input.style.display;this._dom_input.style.transform="",this._dom_input.style.display="block",this._dom_copy.style.transform="",this._dom_copy.style.display="block";let s=this._dom_input.getBoundingClientRect();return this._dom_input.style.transform=i,this._dom_input.style.display=e,this._dom_copy.style.transform=i,this._dom_copy.style.display=e,t&&document.body.removeChild(this._dom_input),s}_getDOMRelativeWorldTransform(){let t=this._last_renderer.view.getBoundingClientRect(),i=this.worldTransform.clone();return i.scale(this._resolution,this._resolution),i.scale(t.width/this._last_renderer.width,t.height/this._last_renderer.height),i}_pixiMatrixToCSS(t){return"matrix("+[t.a,t.b,t.c,t.d,t.tx,t.ty].join(",")+")"}_comparePixiMatrices(t,i){return!(!t||!i)&&t.a===i.a&&t.b===i.b&&t.c===i.c&&t.d===i.d&&t.tx===i.tx&&t.ty===i.ty}_compareClientRects(t,i){return!(!t||!i)&&t.left===i.left&&t.top===i.top&&t.width===i.width&&t.height===i.height}}class n extends PIXI.Graphics{constructor(t){super(),this.offsetLeft=0,this.alpha=.8,this.beginFill(t.fill),this.drawRect(0,0,t.width,t.height),this.endFill(),this.closePath(),gsap?gsap.to(this,{alpha:0,duration:.4,ease:"power1.inOut",repeat:-1,yoyo:!0}):this._animateCaret()}_animateCaret(){this.alpha=.8,setTimeout((()=>{this.alpha=0,setTimeout((()=>{this._animateCaret()}),400)}),400)}}class _{constructor(t){if(t.default)t.focused=t.focused||t.default,t.disabled=t.disabled||t.default;else{let i=t;(t={}).default=t.focused=t.disabled=i}this.options=t}generate(t,i,e){let s=this.options[e.toLowerCase()];if(s){let e=new PIXI.Graphics;s.color&&e.beginFill(s.color),e.drawRoundedRect(0,0,t,i,s.border.radius),e.endFill();let h=null;if(s.border&&s.border.width){h=new PIXI.Graphics;let e=0,o=0,d=t,n=i;switch(s.border.position){case"all":e-=s.border.width,o-=s.border.width,d+=2*s.border.width,n+=2*s.border.width;break;case"left":e-=s.border.width;break;case"right":e+=s.border.width;break;case"top":o-=s.border.width;break;case"bottom":default:o+=s.border.width}h.beginFill(s.border.color),h.drawRoundedRect(e,o,d,n,s.border.radius+s.border.width),h.endFill()}return[e,h]}}}}},i={};function e(s){var h=i[s];if(void 0!==h)return h.exports;var o=i[s]={exports:{}};return t[s](o,o.exports,e),o.exports}e.d=(t,i)=>{for(var s in i)e.o(i,s)&&!e.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:i[s]})},e.o=(t,i)=>Object.prototype.hasOwnProperty.call(t,i),e.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e(138)})();