var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("rui/RUIEvent", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIMouseButton;
    (function (RUIMouseButton) {
        RUIMouseButton[RUIMouseButton["Left"] = 0] = "Left";
        RUIMouseButton[RUIMouseButton["Middle"] = 1] = "Middle";
        RUIMouseButton[RUIMouseButton["Right"] = 2] = "Right";
    })(RUIMouseButton = exports.RUIMouseButton || (exports.RUIMouseButton = {}));
    var RUIEventType;
    (function (RUIEventType) {
        RUIEventType[RUIEventType["MouseDown"] = 0] = "MouseDown";
        RUIEventType[RUIEventType["MouseUp"] = 1] = "MouseUp";
        RUIEventType[RUIEventType["MouseClick"] = 2] = "MouseClick";
        RUIEventType[RUIEventType["MouseEnter"] = 3] = "MouseEnter";
        RUIEventType[RUIEventType["MouseLeave"] = 4] = "MouseLeave";
        RUIEventType[RUIEventType["MouseDrag"] = 5] = "MouseDrag";
        RUIEventType[RUIEventType["MouseDrop"] = 6] = "MouseDrop";
        RUIEventType[RUIEventType["MouseMove"] = 7] = "MouseMove";
        RUIEventType[RUIEventType["MouseWheel"] = 8] = "MouseWheel";
    })(RUIEventType = exports.RUIEventType || (exports.RUIEventType = {}));
    var RUIEvent = /** @class */ (function () {
        function RUIEvent(object) {
            this.isUsed = false;
            this.m_isPrevented = false;
            this.object = object;
        }
        RUIEvent.prototype.prevent = function () {
            this.m_isPrevented = true;
        };
        RUIEvent.prototype.Use = function () {
            this.isUsed = true;
        };
        return RUIEvent;
    }());
    exports.RUIEvent = RUIEvent;
    var RUIEventEmitter = /** @class */ (function () {
        function RUIEventEmitter() {
            this.m_listener = [];
        }
        RUIEventEmitter.prototype.on = function (listener) {
            var l = this.m_listener;
            var index = l.indexOf(listener);
            if (index >= 0)
                return;
            l.push(listener);
        };
        RUIEventEmitter.prototype.removeListener = function (listener) {
            var l = this.m_listener;
            var index = l.indexOf(listener);
            if (index >= 0) {
                l.splice(index, 1);
            }
        };
        RUIEventEmitter.prototype.removeAllListener = function () {
            this.m_listener = [];
        };
        RUIEventEmitter.prototype.emit = function (e) {
            var l = this.m_listener;
            var lc = l.length;
            for (var i = 0; i < lc; i++) {
                var li = l[i];
                li(e);
                if (e['_isPrevented'])
                    return;
            }
        };
        RUIEventEmitter.prototype.emitRaw = function (e) {
            this.emit(new RUIEvent(e));
        };
        return RUIEventEmitter;
    }());
    exports.RUIEventEmitter = RUIEventEmitter;
    var RUIObjEvent = /** @class */ (function (_super) {
        __extends(RUIObjEvent, _super);
        function RUIObjEvent() {
            return _super.call(this, null) || this;
        }
        return RUIObjEvent;
    }(RUIEvent));
    exports.RUIObjEvent = RUIObjEvent;
    var RUIResizeEvent = /** @class */ (function (_super) {
        __extends(RUIResizeEvent, _super);
        function RUIResizeEvent(w, h) {
            var _this = _super.call(this, null) || this;
            _this.object = _this;
            _this.width = w;
            _this.height = h;
            return _this;
        }
        return RUIResizeEvent;
    }(RUIEvent));
    exports.RUIResizeEvent = RUIResizeEvent;
    var RUIKeyboardEvent = /** @class */ (function (_super) {
        __extends(RUIKeyboardEvent, _super);
        function RUIKeyboardEvent(e) {
            var _this = _super.call(this) || this;
            _this.object = _this;
            _this.raw = e;
            return _this;
        }
        return RUIKeyboardEvent;
    }(RUIObjEvent));
    exports.RUIKeyboardEvent = RUIKeyboardEvent;
    var RUIMouseEvent = /** @class */ (function (_super) {
        __extends(RUIMouseEvent, _super);
        function RUIMouseEvent(e, type) {
            var _this = _super.call(this) || this;
            _this.raw = e;
            _this.object = _this;
            _this.m_eventtype = type;
            _this.mousex = e.offsetX;
            _this.mousey = e.offsetY;
            _this.m_button = (e.button);
            return _this;
        }
        Object.defineProperty(RUIMouseEvent.prototype, "type", {
            get: function () {
                return this.m_eventtype;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUIMouseEvent.prototype, "button", {
            get: function () {
                return this.m_button;
            },
            enumerable: true,
            configurable: true
        });
        return RUIMouseEvent;
    }(RUIObjEvent));
    exports.RUIMouseEvent = RUIMouseEvent;
    var RUIMouseDragStage;
    (function (RUIMouseDragStage) {
        RUIMouseDragStage[RUIMouseDragStage["Begin"] = 0] = "Begin";
        RUIMouseDragStage[RUIMouseDragStage["Update"] = 1] = "Update";
        RUIMouseDragStage[RUIMouseDragStage["End"] = 2] = "End";
    })(RUIMouseDragStage = exports.RUIMouseDragStage || (exports.RUIMouseDragStage = {}));
    var RUIMouseDragEvent = /** @class */ (function (_super) {
        __extends(RUIMouseDragEvent, _super);
        function RUIMouseDragEvent(e, stage) {
            var _this = _super.call(this, e.raw, RUIEventType.MouseDrag) || this;
            _this.stage = stage;
            return _this;
        }
        return RUIMouseDragEvent;
    }(RUIMouseEvent));
    exports.RUIMouseDragEvent = RUIMouseDragEvent;
    var RUIWheelEvent = /** @class */ (function (_super) {
        __extends(RUIWheelEvent, _super);
        function RUIWheelEvent(e) {
            var _this = _super.call(this) || this;
            _this.object = _this;
            _this.delta = e.deltaY;
            return _this;
        }
        return RUIWheelEvent;
    }(RUIObjEvent));
    exports.RUIWheelEvent = RUIWheelEvent;
});
define("rui/RUIInput", ["require", "exports", "rui/RUIEvent"], function (require, exports, RUIEvent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IInputUI = /** @class */ (function () {
        function IInputUI() {
        }
        IInputUI.prototype.onKeyPress = function (e) {
        };
        IInputUI.prototype.onKeyDown = function (e) {
        };
        return IInputUI;
    }());
    exports.IInputUI = IInputUI;
    var RUIInput = /** @class */ (function () {
        function RUIInput(uicanvas) {
            this.m_target = uicanvas;
            // this.EvtMouseEnter = new RUIEventEmitter();
            // this.EvtMouseLeave = new RUIEventEmitter();
            this.RegisterEvent();
        }
        // public setActiveUI(ui:UIObject){
        //     let curActiveUI = this.m_activeMouseUI;
        //     if(ui == curActiveUI) return;
        //     if(curActiveUI != null){
        //         curActiveUI.onInactive();
        //     }
        //     ui.onActive();
        //     this.m_activeMouseUI = ui;
        // }
        RUIInput.prototype.RegisterEvent = function () {
            var c = this.m_target;
            var tar = this.m_target;
            window.addEventListener('keydown', function (e) { return c.EventOnUIEvent.emit(new RUIEvent_1.RUIKeyboardEvent(e)); });
            window.addEventListener('mousedown', function (e) { return c.EventOnUIEvent.emit(new RUIEvent_1.RUIMouseEvent(e, RUIEvent_1.RUIEventType.MouseDown)); });
            window.addEventListener('mouseup', function (e) { return c.EventOnUIEvent.emit(new RUIEvent_1.RUIMouseEvent(e, RUIEvent_1.RUIEventType.MouseUp)); });
            window.addEventListener('mousemove', function (e) { return c.EventOnUIEvent.emit(new RUIEvent_1.RUIMouseEvent(e, RUIEvent_1.RUIEventType.MouseMove)); });
            window.addEventListener('mousewheel', function (e) { return c.EventOnUIEvent.emit(new RUIEvent_1.RUIWheelEvent(e)); });
            // window.addEventListener('keypress',this.onKeyboardEvent.bind(this));
            // window.addEventListener('keydown',this.onKeyboardDown.bind(this));
            // c.addEventListener('mousedown',(e)=>{
            //     this.m_onMouseDown = true;
            //     let tar = this.m_target;
            //     let newActiveUI = tar.qtree.DispatchEvtMouseEvent(e,RUIEvent.MOUSE_DOWN);
            //     let curActiveUI = this.m_activeMouseUI;
            //     if(curActiveUI == newActiveUI) return;
            //     if(curActiveUI != null) curActiveUI.onInactive();
            //     if(newActiveUI != null){
            //         newActiveUI.onActive();
            //         this.m_activeMouseUI = newActiveUI;
            //     }
            //     this.m_activeMouseUIDrag =false;
            // });
            // c.addEventListener('mouseup',(e)=>{
            //     let tar = this.m_target;
            //     let tarui = tar.qtree.DispatchEvtMouseEvent(e,RUIEvent.MOUSE_UP);
            //     let activeUI = this.m_activeMouseUI;
            //     if(tarui && tarui == this.m_activeMouseUI){
            //         let eventClick = new RUIMouseEvent(tarui,RUIEvent.MOUSE_CLICK,e.offsetX,e.offsetY,tarui._canvas);
            //         eventClick.button = <RUIButton>e.button;
            //         tarui.onMouseClick(eventClick);
            //     }
            //     if(activeUI != null && this.m_activeMouseUIDrag){
            //         activeUI.onMouseDrag(new RUIMouseDragEvent(activeUI,RUIEvent.MOUSE_DRAG,e.offsetX,e.offsetY,true,tar));
            //     }
            //     this.m_onMouseDown = false;
            // });
            // c.addEventListener('mousemove',(e)=>{
            //     this.m_target.qtree.DispatchEvtMouseMove(e.offsetX,e.offsetY);
            //     let activeUI = this.m_activeMouseUI;
            //     if(this.m_onMouseDown && activeUI != null){
            //         activeUI.onMouseDrag(new RUIMouseDragEvent(activeUI,RUIEvent.MOUSE_DRAG,e.offsetX,e.offsetY,false,tar));
            //         this.m_activeMouseUIDrag = true;
            //     }
            // })
            // c.addEventListener('mouseenter',(e)=>{
            //     this.EvtMouseEnter.emit(new RUIEvent(this.m_target.rootui,RUIEvent.MOUSE_ENTER,tar));
            // });
            // c.addEventListener('mouseleave',(e)=>{
            //     this.EvtMouseLeave.emit(new RUIEvent(this.m_target.rootui,RUIEvent.MOUSE_LEAVE,tar));
            // });
        };
        // private onKeyboardEvent(e:KeyboardEvent){
        //     // let activeUI = this.m_target.activeUI;
        //     // if(activeUI != null) activeUI.onKeyPress(e);
        // }
        // private onKeyboardDown(e:KeyboardEvent){
        //     // let activeUI = this.m_target.activeUI;
        //     // if(activeUI != null) activeUI.onKeyDown(e);
        // }
        RUIInput.ProcessTextKeyDown = function (text, e) {
            var raw = e.raw;
            var key = raw.key;
            if (key == 'Backspace') {
                if (raw.shiftKey) {
                    return '';
                }
                if (text == null || text.length == 0)
                    return text;
                text = text.slice(0, text.length - 1);
            }
            else if (key.length == 1) {
                return text + raw.key;
            }
            return text;
        };
        // private m_activeMouseUI: UIObject = null;
        // private m_activeMouseUIDrag:boolean = false;
        // private m_onMouseDown:boolean = false;
        // public EvtMouseEnter: RUIEventEmitter;
        // public EvtMouseLeave: RUIEventEmitter;
        RUIInput.MOUSE_DOWN = "onMouseDown";
        RUIInput.MOUSE_UP = "onMouseUp";
        RUIInput.MOUSE_CLICK = "onMouseClick";
        RUIInput.MOUSE_ENTER = "onMouseEnter";
        RUIInput.MOUSE_LEAVE = "onMouseLeave";
        RUIInput.MOUSE_DRAG = "onMouseDrag";
        RUIInput.MOUSE_DROP = "onMouseDrop";
        return RUIInput;
    }());
    exports.RUIInput = RUIInput;
});
define("rui/RUICursor", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUICursorType;
    (function (RUICursorType) {
        RUICursorType["default"] = "default";
        RUICursorType["crosshair"] = "crosshair";
        RUICursorType["move"] = "move";
        RUICursorType["none"] = "none";
        RUICursorType["pointer"] = "pointer";
        RUICursorType["text"] = "text";
        RUICursorType["col_resize"] = "col-resize";
        RUICursorType["row_resize"] = "row-resize";
        RUICursorType["n_resize"] = "n-resize";
        RUICursorType["e_resize"] = "e-resize";
        RUICursorType["s_resize"] = "s-resize";
        RUICursorType["w_resize"] = "w-resize";
        RUICursorType["ne_resize"] = "ne-resize";
        RUICursorType["se_resize"] = "se-resize";
        RUICursorType["ns_resize"] = "ns-resize";
        RUICursorType["sw_resize"] = "sw-resize";
        RUICursorType["nesw_resize"] = "nesw-resize";
        RUICursorType["nwse_resize"] = "nwse-resize";
    })(RUICursorType = exports.RUICursorType || (exports.RUICursorType = {}));
    var RUICursor = /** @class */ (function () {
        function RUICursor(canvas) {
            this.Cursor = RUICursorType.default;
            this.m_input = canvas.input;
            this.m_canvas = canvas.canvas;
            //this.m_input.EvtMouseEnter.on(this.onMouseEnter.bind(this));
            //this.m_input.EvtMouseLeave.on(this.onMouseLeave.bind(this));
        }
        RUICursor.prototype.onMouseEnter = function (e) {
        };
        RUICursor.prototype.onMouseLeave = function (e) {
        };
        RUICursor.prototype.SetCursor = function (type) {
            this.Cursor = type;
            this.m_canvas.style.cursor = this.Cursor;
        };
        return RUICursor;
    }());
    exports.RUICursor = RUICursor;
});
define("rui/RUIShaderLib", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GLSL_FRAG_COLOR = '#version 300 es\nprecision lowp float;\n\nin vec4 vColor;\n\nout vec4 fragColor;\n\nvoid main(){\nfragColor = vColor;\n}';
    exports.GLSL_VERT_DEF = '#version 300 es\nprecision mediump float;\nin vec3 aPosition;\nin vec4 aColor;\nin vec4 aClip;\n\nuniform vec4 uProj;\nout vec4 vColor;\n\nvoid main(){\nvec2 pos =aPosition.xy;\npos = clamp(pos,aClip.xy,aClip.zw);\npos = pos * uProj.xy;\npos.y = 2.0 - pos.y;\npos.xy -=1.0;\ngl_Position = vec4(pos,aPosition.z,1);\nvColor = aColor;\n}';
    exports.GLSL_FRAG_TEXT = '#version 300 es\nprecision lowp float;\n\nin vec4 vColor;\nin vec2 vUV;\n\nuniform sampler2D uSampler;\n\nout vec4 fragColor;\n\nvoid main(){\nvec4 col = texture(uSampler,vUV);\nfragColor = col;\n}';
    exports.GLSL_VERT_TEXT = '#version 300 es\nprecision mediump float;\nin vec3 aPosition;\nin vec4 aColor;\nin vec2 aUV;\nin vec4 aClip;\n\nuniform vec4 uProj;\nout vec4 vColor;\nout vec2 vUV;\n\nvoid main(){\nvec2 pos = aPosition.xy;\npos = clamp(pos,aClip.xy,aClip.zw);\n\nvec2 offset = aPosition.xy - pos;\npos = pos * uProj.xy;\npos.y = 2.0 - pos.y;\npos.xy -=1.0;\ngl_Position = vec4(pos,aPosition.z,1);\nvColor = aColor;\nvUV =aUV - offset / 128.0;\n}';
    exports.GLSL_FRAG_IMAGE = '#version 300 es\nprecision lowp float;\n\n//in vec4 vColor;\nin vec2 vUV;\n\nuniform sampler2D uSampler;\n\nout vec4 fragColor;\n\nvoid main(){\nfragColor = texture(uSampler,vUV);\n}';
    exports.GLSL_VERT_IMAGE = '#version 300 es\nprecision mediump float;\nin vec3 aPosition;\n//in vec4 aColor;\n//in vec4 aClip;\nin vec2 aUV;\n\nuniform vec4 uProj;\n//out vec4 vColor;\nout vec2 vUV;\n\n\nvoid main(){\nvec2 pos =aPosition.xy;\n//pos = clamp(pos,aClip.xy,aClip.zw);\npos = pos * uProj.xy;\npos.y = 2.0 - pos.y;\npos.xy -=1.0;\ngl_Position = vec4(pos,aPosition.z,1);\n//vColor = aColor;\nvUV = aUV;\n}\n';
});
define("rui/RUIBinder", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function BIND_EMITTER(property) {
        return '_ruibind$' + property;
    }
    exports.BIND_EMITTER = BIND_EMITTER;
    function RUIBind(tar, property, f) {
        if (f == null)
            return;
        var identifier = BIND_EMITTER(property);
        var emitter = tar[identifier];
        if (emitter == undefined) {
            emitter = [f];
            tar[identifier] = emitter;
            var descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(tar), property);
            if (descriptor != null) {
                var getter = descriptor.get;
                var setter = descriptor.set;
                if (getter == null || setter == null)
                    return;
                Object.defineProperty(tar, property, {
                    enumerable: descriptor.enumerable,
                    get: function () {
                        return getter.call(tar);
                    },
                    set: function (newval) {
                        setter.call(tar, newval);
                        var val = tar[property];
                        tar[identifier].forEach(function (f) {
                            f(val);
                        });
                    }
                });
            }
            else {
                var value = tar[property];
                Object.defineProperty(tar, property, {
                    enumerable: true,
                    get: function () {
                        return value;
                    },
                    set: function (newval) {
                        value = newval;
                        var val = tar[property];
                        tar[identifier].forEach(function (f) {
                            f(val);
                        });
                    }
                });
            }
        }
        else {
            if (emitter.indexOf(f) >= 0) {
                console.warn('function alread binded');
                return;
            }
            else {
                emitter.push(f);
            }
        }
    }
    exports.RUIBind = RUIBind;
});
define("rui/RUIColor", ["require", "exports", "rui/RUIUtil"], function (require, exports, RUIUtil_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIColor = /** @class */ (function () {
        function RUIColor() {
        }
        RUIColor.RED = [1, 0, 0, 1];
        RUIColor.BLACK = [0, 0, 0, 1];
        RUIColor.WHITE = [1, 1, 1, 1];
        RUIColor.GREEN = [0, 1, 0, 1];
        RUIColor.BLUE = [0, 0, 1, 1];
        RUIColor.YELLOW = [1, 1, 0, 1];
        RUIColor.GREY = RUIUtil_1.RUIUtil.ColorUNorm(200, 200, 200, 255);
        RUIColor.COLOR_ERROR = [1, 0, 1, 1];
        return RUIColor;
    }());
    exports.RUIColor = RUIColor;
});
define("rui/widget/RUIImage", ["require", "exports", "rui/RUIObject", "rui/RUIBinder", "rui/RUIColor"], function (require, exports, RUIObject_1, RUIBinder_1, RUIColor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIImageSize;
    (function (RUIImageSize) {
        RUIImageSize[RUIImageSize["Initial"] = 0] = "Initial";
        RUIImageSize[RUIImageSize["Cover"] = 1] = "Cover";
        RUIImageSize[RUIImageSize["Contain"] = 2] = "Contain";
        RUIImageSize[RUIImageSize["ScaleToFit"] = 3] = "ScaleToFit";
    })(RUIImageSize = exports.RUIImageSize || (exports.RUIImageSize = {}));
    var RUIImage = /** @class */ (function (_super) {
        __extends(RUIImage, _super);
        function RUIImage(url, width, height, size) {
            if (width === void 0) { width = RUIObject_1.RUIAuto; }
            if (height === void 0) { height = RUIObject_1.RUIAuto; }
            if (size === void 0) { size = RUIImageSize.Initial; }
            var _this = _super.call(this) || this;
            _this.m_valid = false;
            if (url != null && url != '') {
                _this.loadImage(url);
            }
            _this.width = width;
            _this.height = height;
            _this.m_size = size;
            return _this;
        }
        Object.defineProperty(RUIImage.prototype, "src", {
            get: function () {
                return this.m_image.src;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUIImage.prototype, "isvalid", {
            get: function () {
                return this.m_valid;
            },
            set: function (v) {
                this.m_valid = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUIImage.prototype, "imageSize", {
            get: function () {
                return this.m_size;
            },
            set: function (size) {
                if (this.m_size == size)
                    return;
                this.m_size = size;
                this.updateImageSize();
            },
            enumerable: true,
            configurable: true
        });
        RUIImage.Create = function (ruiimg, width, height, size) {
            if (width === void 0) { width = RUIObject_1.RUIAuto; }
            if (height === void 0) { height = RUIObject_1.RUIAuto; }
            if (size === void 0) { size = RUIImageSize.Initial; }
            var image = new RUIImage(null, width, height, size);
            image.m_image = ruiimg.m_image;
            RUIBinder_1.RUIBind(ruiimg, 'm_valid', function (v) {
                image.m_valid = v;
                image.updateImageSize();
            });
            return image;
        };
        RUIImage.prototype.loadImage = function (url) {
            this.m_valid = false;
            var image = new Image();
            image.onload = this.onImageLoaded.bind(this);
            image.src = url;
            this.m_image = image;
        };
        RUIImage.prototype.onImageLoaded = function (image, e) {
            this.m_valid = true;
            this.updateImageSize();
        };
        RUIImage.prototype.updateImageSize = function () {
            var image = this.m_image;
            var size = this.m_size;
            switch (size) {
                case RUIImageSize.Initial:
                    {
                        this.width = image.width;
                        this.height = image.height;
                    }
                    break;
                default:
                    {
                        var w = this.width;
                        var h = this.height;
                        var aspectRatio = image.width * 1.0 / image.height;
                        if (w == RUIObject_1.RUIAuto) {
                            if (h != RUIObject_1.RUIAuto) {
                                this.width = aspectRatio * this.height;
                            }
                        }
                        else {
                            if (h == RUIObject_1.RUIAuto) {
                                this.height = this.width / aspectRatio;
                            }
                        }
                    }
                    break;
            }
            this.setDirty();
        };
        RUIImage.prototype.onDraw = function (cmd) {
            _super.prototype.onDraw.call(this, cmd);
            var cliprect = this._drawClipRect;
            if (cliprect == null) {
                return;
            }
            var rect = this._rect;
            if (this.m_valid) {
                cmd.DrawImage(this.m_image, rect, cliprect, null, this.m_size);
                if (this.imageBackground != null) {
                    cmd.DrawRectWithColor(rect, this.imageBackground, cliprect);
                }
            }
            else {
                cmd.DrawRectWithColor(cliprect, RUIColor_1.RUIColor.COLOR_ERROR);
            }
        };
        return RUIImage;
    }(RUIObject_1.RUIObject));
    exports.RUIImage = RUIImage;
});
define("rui/RUICmdList", ["require", "exports", "rui/RUIUtil", "rui/widget/RUIImage"], function (require, exports, RUIUtil_2, RUIImage_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIDrawCmdType;
    (function (RUIDrawCmdType) {
        RUIDrawCmdType[RUIDrawCmdType["rect"] = 0] = "rect";
        RUIDrawCmdType[RUIDrawCmdType["text"] = 1] = "text";
        RUIDrawCmdType[RUIDrawCmdType["border"] = 2] = "border";
        RUIDrawCmdType[RUIDrawCmdType["line"] = 3] = "line";
        RUIDrawCmdType[RUIDrawCmdType["image"] = 4] = "image";
    })(RUIDrawCmdType = exports.RUIDrawCmdType || (exports.RUIDrawCmdType = {}));
    var RUIDrawCmd = /** @class */ (function () {
        function RUIDrawCmd(rect) {
            this.Rect = [];
            this.Index = 0;
            this.type = RUIDrawCmdType.rect;
            this.Rect = rect;
        }
        RUIDrawCmd.CmdRect = function (rect, color) {
            var cmd = new RUIDrawCmd();
            cmd.Rect = rect;
            cmd.Color = color;
            return cmd;
        };
        RUIDrawCmd.CmdText = function (text, cliprect, color) {
            var cmd = new RUIDrawCmd();
            cmd.Text = text;
            cmd.Rect = cliprect;
            cmd.Color = color;
            cmd.type = RUIDrawCmdType.text;
            return cmd;
        };
        RUIDrawCmd.CmdBorder = function (rect, color) {
            var cmd = new RUIDrawCmd();
            cmd.Rect = rect;
            cmd.Color = color;
            cmd.type = RUIDrawCmdType.border;
            return cmd;
        };
        RUIDrawCmd.CmdLine = function (x1, y1, x2, y2, color) {
            var cmd = new RUIDrawCmd();
            cmd.Rect = [x1, y1, x2, y2];
            cmd.Color = color;
            cmd.type = RUIDrawCmdType.line;
            return cmd;
        };
        RUIDrawCmd.CmdImage = function (image, rect) {
            var cmd = new RUIDrawCmd();
            cmd.Rect = rect;
            cmd.type = RUIDrawCmdType.image;
            cmd.object = image;
            return cmd;
        };
        return RUIDrawCmd;
    }());
    exports.RUIDrawCmd = RUIDrawCmd;
    var RUICmdList = /** @class */ (function () {
        function RUICmdList() {
            this.drawList = [];
            this.MaxDrawCount = 1000;
            this.isDirty = false;
            this.currentOrder = 0;
        }
        RUICmdList.prototype.draw = function (root) {
            this.drawList = [];
            root.root.onDraw(this);
            this.isDirty = true;
        };
        RUICmdList.prototype.DrawRectWithColor = function (pos, color, clip, order) {
            var cmd = new RUIDrawCmd(pos);
            cmd.clip = RUIUtil_2.RUIUtil.toRectP(clip == null ? pos : clip);
            cmd.Color = color;
            if (order != null) {
                cmd.Index = order;
            }
            else {
                cmd.Index = this.currentOrder;
            }
            this.drawList.push(cmd);
        };
        RUICmdList.prototype.DrawImage = function (image, r, clip, order, size) {
            if (size === void 0) { size = RUIImage_1.RUIImageSize.Initial; }
            var rect = r.slice(0);
            var cmd = RUIDrawCmd.CmdImage(image, rect);
            cmd.clip = RUIUtil_2.RUIUtil.toRectP(clip == null ? rect : clip);
            if (order != null) {
                cmd.Index = order;
            }
            else {
                cmd.Index = this.currentOrder;
            }
            var uv = null;
            var rectwidth = rect[2];
            var rectheight = rect[3];
            var isCover = size == RUIImage_1.RUIImageSize.Cover;
            var isContain = size == RUIImage_1.RUIImageSize.Contain;
            var imgw = image.width;
            var imgh = image.height;
            if (isCover || isContain) {
                var imageRatio = imgw / imgh;
                var rectRatio = rectwidth / rectheight;
                if (imageRatio != rectRatio) {
                    var stretchWidth = true;
                    if (isCover) {
                        if (rectRatio > imageRatio) {
                            stretchWidth = false;
                        }
                    }
                    else {
                        if (rectRatio < imageRatio)
                            stretchWidth = false;
                    }
                    if (stretchWidth) {
                        var w = rectheight * imageRatio;
                        rect[0] += (rectwidth - w) / 2.0;
                        rect[2] = w;
                    }
                    else {
                        var h = rectwidth / imageRatio;
                        rect[1] += (rectheight - h) / 2.0;
                        rect[3] = h;
                    }
                }
            }
            //doclip
            var cclip = cmd.clip;
            var xmin = cclip[0];
            var xmax = cclip[2];
            var ymin = cclip[1];
            var ymax = cclip[3];
            var rx1 = rect[0];
            var rx2 = rx1 + rect[2];
            var ry1 = rect[1];
            var ry2 = ry1 + rect[3];
            var x1 = RUIUtil_2.CLAMP(rx1, xmin, xmax);
            var x2 = RUIUtil_2.CLAMP(rx2, xmin, xmax);
            var y1 = RUIUtil_2.CLAMP(ry1, ymin, ymax);
            var y2 = RUIUtil_2.CLAMP(ry2, ymin, ymax);
            cmd.Rect = [x1, y1, x2, y2];
            if (size == RUIImage_1.RUIImageSize.Cover) {
                var ux1 = (x1 - rx1) / imgw;
                var ux2 = 1.0 + (x2 - rx2) / imgw;
                var uy1 = (y1 - ry1) / imgh;
                var uy2 = 1.0 + (y2 - ry2) / imgh;
                uv = [ux1, uy1, ux2, uy1, ux2, uy2, ux1, uy2];
            }
            cmd.param = uv;
            this.drawList.push(cmd);
        };
        RUICmdList.prototype.DrawText = function (text, rect, color, cliprect, order) {
            var cmd = RUIDrawCmd.CmdText(text, rect, color);
            cmd.clip = RUIUtil_2.RUIUtil.toRectP(cliprect == null ? rect : cliprect);
            if (order != null) {
                cmd.Index = order;
            }
            else {
                cmd.Index = this.currentOrder;
            }
            this.drawList.push(cmd);
        };
        RUICmdList.prototype.DrawBorder = function (rect, color, cliprect, order) {
            if (rect == null)
                throw new Error();
            var cmd = RUIDrawCmd.CmdBorder(rect, color);
            cmd.clip = RUIUtil_2.RUIUtil.toRectP(cliprect == null ? rect : cliprect);
            if (order != null) {
                cmd.Index = order;
            }
            else {
                cmd.Index = this.currentOrder;
            }
            this.drawList.push(cmd);
        };
        /** TODO */
        RUICmdList.prototype.DrawLine = function (x1, y1, x2, y2, color, order) {
            // if(this.m_clipRectP == RUICLIP_NULL) return;
            if (order === void 0) { order = 0; }
            // let cmd = RUIDrawCmd.CmdLine(x1,y1,x2,y2,color);
            // cmd.clip = this.m_clipRectP;
            // this.drawList.push(cmd);
        };
        return RUICmdList;
    }());
    exports.RUICmdList = RUICmdList;
});
define("rui/RUIContainer", ["require", "exports", "rui/RUIObject", "rui/RUIUtil"], function (require, exports, RUIObject_2, RUIUtil_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIContainerUpdateMode;
    (function (RUIContainerUpdateMode) {
        RUIContainerUpdateMode[RUIContainerUpdateMode["None"] = 0] = "None";
        RUIContainerUpdateMode[RUIContainerUpdateMode["LayoutUpdate"] = 1] = "LayoutUpdate";
        RUIContainerUpdateMode[RUIContainerUpdateMode["LayoutFull"] = 2] = "LayoutFull";
    })(RUIContainerUpdateMode = exports.RUIContainerUpdateMode || (exports.RUIContainerUpdateMode = {}));
    var RUIContainerClipType;
    (function (RUIContainerClipType) {
        RUIContainerClipType[RUIContainerClipType["NoClip"] = 0] = "NoClip";
        RUIContainerClipType[RUIContainerClipType["Clip"] = 1] = "Clip";
        RUIContainerClipType[RUIContainerClipType["ClipSelf"] = 2] = "ClipSelf";
    })(RUIContainerClipType = exports.RUIContainerClipType || (exports.RUIContainerClipType = {}));
    var RUIContainer = /** @class */ (function (_super) {
        __extends(RUIContainer, _super);
        function RUIContainer(orit) {
            if (orit === void 0) { orit = RUIObject_2.RUIOrientation.Vertical; }
            var _this = _super.call(this) || this;
            _this.boxClip = RUIContainerClipType.Clip;
            _this.boxOverflow = RUIObject_2.RUIOverflow.Clip;
            _this.boxOrientation = RUIObject_2.RUIOrientation.Vertical;
            _this.boxBorder = null;
            _this.boxBackground = null;
            _this.boxSideExtens = false;
            _this.boxMatchWidth = false;
            _this.boxMatchHeight = false;
            _this.children = [];
            _this.layoutSkipDraw = false;
            /** mark execute for children ui of @function traversal */
            _this.skipChildTraversal = false;
            _this.boxOrientation = orit;
            _this.layouter = RUIContainerLayouter.Layouter;
            return _this;
        }
        Object.defineProperty(RUIContainer.prototype, "isVertical", {
            get: function () {
                return this.boxOrientation == RUIObject_2.RUIOrientation.Vertical;
            },
            enumerable: true,
            configurable: true
        });
        RUIContainer.prototype.addChild = function (ui) {
            if (ui == null) {
                console.warn('can not add undefined child');
                return;
            }
            var c = this.children;
            if (c.indexOf(ui) >= 0) {
                console.warn('skip add child');
                return;
            }
            ui.parent = this;
            ui.setRoot(this._root);
            c.push(ui);
            ui.setDirty();
        };
        RUIContainer.prototype.hasChild = function (ui) {
            return this.children.indexOf(ui) >= 0;
        };
        RUIContainer.prototype.removeChild = function (ui) {
            if (ui == null)
                return;
            var c = this.children;
            var index = c.indexOf(ui);
            if (index < 0)
                return;
            c.splice(index, 1);
            this.setDirty();
            ui.parent = null;
            ui.setRoot(null);
        };
        RUIContainer.prototype.removeChildByIndex = function (index) {
            var c = this.children;
            if (index < 0 || index >= c.length)
                return null;
            var ui = c[index];
            c.splice(index, 1);
            this.setDirty();
            ui.parent = null;
            ui.setRoot(null);
        };
        RUIContainer.prototype.containerUpdateCheck = function () {
            if (!this.isdirty && !this._resized) {
                var children = this.children;
                var cisdirty = false;
                var cisresize = false;
                for (var i = 0, clen = children.length; i < clen; i++) {
                    var c = children[i];
                    if (c.isdirty) {
                        cisdirty = true;
                    }
                    if (c._resized) {
                        cisresize = true;
                    }
                }
                if (!cisdirty && !cisresize) {
                    return RUIContainerUpdateMode.None;
                }
                if (!cisresize && cisdirty) {
                    return RUIContainerUpdateMode.LayoutUpdate;
                }
            }
            return RUIContainerUpdateMode.LayoutFull;
        };
        RUIContainer.prototype.LayoutRelativeUI = function (container, children) {
            var root = container._root.root;
            var rw = root.rCalWidth;
            var rh = root.rCalHeight;
            var cw = container.rCalWidth;
            var ch = container.rCalHeight;
            var layoutRelative = RUIObject_2.RUIDefaultLayouter.LayoutRelative;
            for (var i = 0, clen = children.length; i < clen; i++) {
                var c = children[i];
                if (c.isOnFlow)
                    continue;
                var isrelative = c.position == RUIObject_2.RUIPosition.Relative;
                if (isrelative) {
                    layoutRelative(c, cw, ch);
                }
                else {
                    layoutRelative(c, rw, rh);
                }
            }
        };
        RUIContainer.prototype.onDraw = function (cmd) {
            this.onDrawPre(cmd);
            if (this.clipMask == null)
                return;
            var children = this.children;
            for (var i = 0, clen = children.length; i < clen; i++) {
                var c = children[i];
                if (!c.enable)
                    continue;
                cmd.currentOrder = c._order;
                if (c.visible) {
                    if (c.isClip) {
                        c.clipMask = c.isOnFlow ? this.layoutClipRectPadded : this.layoutClipRect;
                        c.onDraw(cmd);
                    }
                    else {
                        var parent_1 = this.parent;
                        if (parent_1 == null) {
                            c.clipMask = this._root.rootRect;
                        }
                        else {
                            c.clipMask = c.isOnFlow ? parent_1.layoutClipRectPadded : parent_1.layoutClipRect;
                        }
                        c.onDraw(cmd);
                    }
                }
            }
            this.onDrawPost(cmd);
        };
        RUIContainer.prototype.onDrawPre = function (cmd) {
            var boxclip = this.boxClip;
            var rect = this.calculateRect();
            this._rect = rect;
            var paddingrect = this.RectMinusePadding(rect, this.padding);
            if (this.clipMask == null) {
                this._drawClipRect = null;
                return;
            }
            switch (boxclip) {
                case RUIContainerClipType.NoClip:
                    this.layoutClipRect = this.parent.layoutClipRect;
                    this.layoutClipRect = this.parent.layoutClipRectPadded;
                    break;
                case RUIContainerClipType.Clip:
                    var parent_2 = this.parent;
                    var rootrect = this._root.rootRect;
                    this.layoutClipRect = RUIUtil_3.RUIUtil.RectClip(rect, parent_2 == null ? rootrect : parent_2.layoutClipRect);
                    this.layoutClipRectPadded = RUIUtil_3.RUIUtil.RectClip(paddingrect, parent_2 == null ? rootrect : (this.isOnFlow ? parent_2.layoutClipRectPadded : parent_2.layoutClipRect));
                    break;
                case RUIContainerClipType.ClipSelf:
                    this.layoutClipRect = rect;
                    this.layoutClipRectPadded = paddingrect;
                    break;
            }
            var cliprect = this.layoutClipRect;
            this._drawClipRect = cliprect;
            cmd.currentOrder = this._order;
            //background
            if (this.boxBackground != null && cliprect != null)
                cmd.DrawRectWithColor(rect, this.boxBackground, cliprect);
        };
        RUIContainer.prototype.onDrawPost = function (cmd) {
            var rect = this._rect;
            var clipRect = this._drawClipRect;
            if (clipRect == null)
                return;
            //cmd.currentOrder = this._order;
            if (this.boxBorder != null && rect != RUIObject_2.RUICLIP_NULL)
                cmd.DrawBorder(rect, this.boxBorder, clipRect);
        };
        RUIContainer.prototype.RectMinusePadding = function (recta, offset) {
            var pleft = Math.max(offset[3], 0);
            var ptop = Math.max(offset[0], 0);
            return [
                recta[0] + pleft,
                recta[1] + ptop,
                recta[2] - Math.max(offset[1], 0) - pleft,
                recta[3] - Math.max(offset[2], 0) - ptop
            ];
        };
        RUIContainer.prototype.setRoot = function (root) {
            if (this._root == root)
                return;
            this._root = root;
            var children = this.children;
            for (var i = 0, clen = children.length; i < clen; i++) {
                var c = children[i];
                c.setRoot(root);
            }
        };
        RUIContainer.prototype.onMouseWheel = function (e) {
        };
        RUIContainer.prototype.traversal = function (f) {
            if (f == null)
                return;
            f(this);
            if (this.skipChildTraversal)
                return;
            var children = this.children;
            for (var i = 0, clen = children.length; i < clen; i++) {
                var c = children[i];
                if (c instanceof RUIContainer) {
                    c.traversal(f);
                }
                else {
                    f(c);
                }
            }
        };
        return RUIContainer;
    }(RUIObject_2.RUIObject));
    exports.RUIContainer = RUIContainer;
    var RUIContainerLayouter = /** @class */ (function () {
        function RUIContainerLayouter() {
        }
        Object.defineProperty(RUIContainerLayouter, "Layouter", {
            get: function () {
                return this.s_layouter;
            },
            enumerable: true,
            configurable: true
        });
        RUIContainerLayouter.prototype.Layout = function (ui) {
            var cui = ui;
            var children = cui.children;
            var clen = children.length;
            var flowChildren = [];
            for (var i = 0; i < clen; i++) {
                var c = children[i];
                if (c.isOnFlow)
                    flowChildren.push(c);
            }
            children = flowChildren;
            clen = children.length;
            var isvertical = cui.isVertical;
            cui.layoutSideChildMax = null;
            var f = function (c) { return c.Layout(); };
            var maxsize = -1;
            if (isvertical && cui.rWidth == RUIObject_2.RUIAuto) {
                f = function (c) {
                    c.Layout();
                    var clayoutwidth = c.layoutWidth;
                    if (clayoutwidth != RUIObject_2.RUIAuto)
                        maxsize = Math.max(maxsize, clayoutwidth);
                };
            }
            else if (!isvertical && cui.rHeight == RUIObject_2.RUIAuto) {
                f = function (c) {
                    c.Layout();
                    if (c.layoutHeight != RUIObject_2.RUIAuto)
                        maxsize = Math.max(maxsize, c.layoutHeight);
                };
            }
            for (var i = 0; i < clen; i++) {
                var c = children[i];
                f(c);
            }
            cui.layoutSideChildMax = maxsize;
            var parent = cui.parent;
            var exten = cui.boxSideExtens && (parent == null || (parent != null && parent.boxOrientation == cui.boxOrientation));
            //width
            if (cui.rWidth != RUIObject_2.RUIAuto) {
                cui.layoutWidth = cui.rWidth;
            }
            else {
                //exten
                if (isvertical) {
                    if (exten) {
                        cui.layoutWidth = RUIObject_2.RUIAuto;
                    }
                    else {
                        if (maxsize != -1) {
                            cui.layoutWidth = maxsize;
                        }
                        else {
                            cui.layoutWidth = RUIObject_2.RUIAuto;
                        }
                    }
                }
                else {
                    cui.layoutWidth = RUIObject_2.RUIAuto;
                }
            }
            //height
            if (cui.rHeight != RUIObject_2.RUIAuto) {
                cui.layoutHeight = cui.rHeight;
            }
            else {
                //exten
                if (isvertical) {
                    cui.layoutHeight = RUIObject_2.RUIAuto;
                }
                else {
                    if (exten) {
                        cui.layoutHeight = RUIObject_2.RUIAuto;
                    }
                    else {
                        if (maxsize != -1) {
                            cui.layoutHeight = maxsize;
                        }
                        else {
                            cui.layoutHeight = RUIObject_2.RUIAuto;
                        }
                    }
                }
            }
        };
        RUIContainerLayouter.prototype.LayoutPost = function (ui, data) {
            if (ui.layoutHeight == null) {
                console.error(ui);
                throw new Error();
            }
            if (ui.layoutWidth == null) {
                throw new Error();
            }
            var cui = ui;
            var children = cui.children;
            var clen = children.length;
            var flowChildren = [];
            for (var i = 0; i < clen; i++) {
                var c = children[i];
                if (c.isOnFlow)
                    flowChildren.push(c);
            }
            children = flowChildren;
            clen = children.length;
            if (data.containerHeight == null) {
                throw new Error();
            }
            if (data.containerWidth == null) {
                throw new Error();
            }
            var isFlexWidth = false;
            var isFlexHeight = false;
            //Fill flex
            var dataFlexWidth = data.flexWidth;
            var dataFlexHeight = data.flexHeight;
            if (dataFlexWidth != null && dataFlexWidth != RUIObject_2.RUIAuto) {
                cui.layoutWidth = data.flexWidth;
                isFlexWidth = true;
            }
            if (dataFlexHeight != null && dataFlexHeight != RUIObject_2.RUIAuto) {
                cui.layoutHeight = data.flexHeight;
                isFlexHeight = true;
            }
            //Fill auto
            var isvertical = cui.isVertical;
            if (isvertical) {
                if (cui.layoutWidth == RUIObject_2.RUIAuto) {
                    cui.layoutWidth = data.containerWidth;
                }
            }
            else {
                if (cui.layoutHeight == RUIObject_2.RUIAuto) {
                    cui.layoutHeight = data.containerHeight;
                }
            }
            //padding
            var padding = cui.padding;
            var paddingleft = padding[3];
            var paddingtop = padding[0];
            var paddingright = padding[1];
            var paddingbottom = padding[2];
            var paddinghorizontal = paddingleft + paddingright;
            var paddingvertical = paddingtop + paddingbottom;
            //Fixed Size
            if (cui.layoutWidth != RUIObject_2.RUIAuto && cui.layoutHeight != RUIObject_2.RUIAuto) {
                cui.rCalWidth = cui.layoutWidth;
                cui.rCalHeight = cui.layoutHeight;
                var cdata = new RUIObject_2.RUILayoutData();
                cdata.containerWidth = RUIUtil_3.SIZE(cui.rCalWidth - paddinghorizontal);
                cdata.containerHeight = RUIUtil_3.SIZE(cui.rCalHeight - paddingvertical);
                var accuSize = isvertical ? paddingtop : paddingleft;
                if (clen != 0) {
                    if (isvertical) {
                        var marginSize = children[0].margin[RUIObject_2.RUIConst.TOP];
                        for (var i = 0; i < clen; i++) {
                            var c = children[i];
                            var cmargin = c.margin;
                            accuSize += Math.max(marginSize, cmargin[RUIObject_2.RUIConst.TOP]);
                            c.LayoutPost(cdata);
                            c.rOffx = paddingleft + cmargin[RUIObject_2.RUIConst.LEFT];
                            c.rOffy = accuSize;
                            accuSize += c.rCalHeight;
                            marginSize = cmargin[RUIObject_2.RUIConst.BOTTOM];
                            if (c.isPositionOffset) {
                                c.rOffx += c.positionOffsetX;
                                c.rOffy += c.positionOffsetY;
                            }
                        }
                    }
                    else {
                        var marginSize = children[0].margin[RUIObject_2.RUIConst.LEFT];
                        for (var i = 0; i < clen; i++) {
                            var c = children[i];
                            var cmargin = c.margin;
                            c.LayoutPost(cdata);
                            accuSize += Math.max(marginSize, cmargin[RUIObject_2.RUIConst.LEFT]);
                            c.rOffy = paddingtop + cmargin[RUIObject_2.RUIConst.TOP];
                            c.rOffx = accuSize;
                            accuSize += c.rCalWidth;
                            marginSize = cmargin[RUIObject_2.RUIConst.RIGHT];
                            if (c.isPositionOffset) {
                                c.rOffx += c.positionOffsetX;
                                c.rOffy += c.positionOffsetY;
                            }
                        }
                    }
                }
                cui.LayoutRelativeUI(cui, cui.children);
                return;
            }
            //orientation auto
            console.assert((cui.isVertical ? cui.layoutHeight : cui.layoutWidth) == RUIObject_2.RUIAuto);
            if (cui.isVertical) {
                var cdata = new RUIObject_2.RUILayoutData();
                cdata.containerWidth = RUIUtil_3.SIZE(cui.layoutWidth - paddinghorizontal);
                cdata.containerHeight = RUIUtil_3.SIZE(data.containerHeight - paddingvertical);
                var maxChildWidth = 0;
                var accuChildHeight = paddingtop;
                if (clen > 0) {
                    var marginSize = children[0].margin[RUIObject_2.RUIConst.TOP];
                    for (var i = 0; i < clen; i++) {
                        var c = children[i];
                        var cmargin = c.margin;
                        c.LayoutPost(cdata);
                        var cmarginleft = cmargin[RUIObject_2.RUIConst.LEFT];
                        accuChildHeight += Math.max(marginSize, cmargin[RUIObject_2.RUIConst.TOP]);
                        c.rOffx = paddingleft + cmarginleft;
                        c.rOffy = accuChildHeight;
                        maxChildWidth = Math.max(maxChildWidth, c.rCalWidth + cmarginleft + cmargin[RUIObject_2.RUIConst.RIGHT]);
                        accuChildHeight += c.rCalHeight;
                        marginSize = cmargin[RUIObject_2.RUIConst.BOTTOM];
                        if (c.isPositionOffset) {
                            c.rOffx += c.positionOffsetX;
                            c.rOffy += c.positionOffsetY;
                        }
                    }
                    accuChildHeight += marginSize;
                }
                if (!isFlexWidth) {
                    if (cui.layoutWidth == cui.width || cui.boxMatchWidth) {
                        cui.rCalWidth = cui.layoutWidth;
                    }
                    else {
                        var paddinghorizontalFixed = RUIUtil_3.SIZE(paddingleft) + RUIUtil_3.SIZE(paddingright);
                        if (cui.boxSideExtens) {
                            if (maxChildWidth < data.containerWidth) {
                                cui.rCalWidth = data.containerWidth;
                            }
                            else {
                                cui.rCalWidth = maxChildWidth + paddinghorizontalFixed;
                            }
                        }
                        else {
                            cui.rCalWidth = maxChildWidth + paddinghorizontalFixed;
                        }
                    }
                }
                else {
                    cui.rCalWidth = cui.layoutWidth;
                }
                if (!isFlexHeight) {
                    if (cui.boxMatchHeight) {
                        cui.rCalHeight = data.containerHeight;
                    }
                    else {
                        cui.rCalHeight = accuChildHeight - paddingtop + RUIUtil_3.SIZE(paddingtop) + RUIUtil_3.SIZE(paddingbottom);
                    }
                }
                else {
                    cui.rCalHeight = cui.layoutHeight;
                }
            }
            else {
                var cdata = new RUIObject_2.RUILayoutData();
                cdata.containerWidth = data.containerWidth;
                cdata.containerHeight = cui.layoutHeight;
                var maxChildHeight = 0;
                var accuChildWidth = paddingleft;
                if (clen > 0) {
                    var marginSize = children[0].margin[RUIObject_2.RUIConst.LEFT];
                    for (var i = 0; i < clen; i++) {
                        var c = children[i];
                        var cmargin = c.margin;
                        c.LayoutPost(cdata);
                        var cmargintop = cmargin[RUIObject_2.RUIConst.TOP];
                        accuChildWidth += Math.max(marginSize, cmargin[RUIObject_2.RUIConst.LEFT]);
                        c.rOffy = paddingtop + cmargintop;
                        c.rOffx = accuChildWidth;
                        maxChildHeight = Math.max(maxChildHeight, c.rCalHeight + cmargintop + cmargin[RUIObject_2.RUIConst.BOTTOM]);
                        accuChildWidth += c.rCalWidth;
                        marginSize = cmargin[RUIObject_2.RUIConst.RIGHT];
                        if (c.isPositionOffset) {
                            c.rOffx += c.positionOffsetX;
                            c.rOffy += c.positionOffsetY;
                        }
                    }
                    accuChildWidth += marginSize;
                }
                if (!isFlexHeight) {
                    if (cui.layoutHeight == cui.height || cui.boxMatchHeight) {
                        cui.rCalHeight = cui.height;
                    }
                    else {
                        var paddingverticalFix = RUIUtil_3.SIZE(paddingtop) + RUIUtil_3.SIZE(paddingbottom);
                        if (cui.boxSideExtens) {
                            if (maxChildHeight < data.containerHeight) {
                                cui.rCalHeight = data.containerHeight;
                            }
                            else {
                                cui.rCalHeight = maxChildHeight + paddingverticalFix;
                            }
                        }
                        else {
                            cui.rCalHeight = maxChildHeight + paddingverticalFix;
                        }
                    }
                }
                else {
                    cui.rCalHeight = cui.layoutHeight;
                }
                if (!isFlexWidth) {
                    if (cui.boxMatchWidth) {
                        cui.rCalWidth = data.containerHeight;
                    }
                    else {
                        cui.rCalWidth = accuChildWidth - paddingleft + RUIUtil_3.SIZE(paddingleft) + RUIUtil_3.SIZE(paddingright);
                    }
                }
                else {
                    cui.rCalWidth = cui.layoutWidth;
                }
            }
            cui.LayoutRelativeUI(cui, cui.children);
            return;
        };
        RUIContainerLayouter.s_layouter = new RUIContainerLayouter();
        return RUIContainerLayouter;
    }());
    exports.RUIContainerLayouter = RUIContainerLayouter;
});
define("rui/RUIRoot", ["require", "exports", "rui/RUIObject", "rui/RUIEvent", "rui/RUIContainer", "rui/RUIObject"], function (require, exports, RUIObject_3, RUIEvent_2, RUIContainer_1, RUIObject_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIRoot = /** @class */ (function () {
        function RUIRoot(ui, expandSize) {
            if (expandSize === void 0) { expandSize = false; }
            this.isdirty = true;
            this.expandSize = false;
            this.m_onMouseDown = false;
            this.m_activeUIonDrag = false;
            this.m_hoverUI = [];
            if (ui.parent != null)
                throw new Error("root ui must have no parent.");
            this.expandSize = expandSize;
            this.root = ui;
            ui.setRoot(this);
        }
        Object.defineProperty(RUIRoot.prototype, "rootRect", {
            get: function () {
                return this.m_rootRect;
            },
            enumerable: true,
            configurable: true
        });
        RUIRoot.prototype.resizeRoot = function (width, height) {
            if (this.m_rootSizeWidth == width && this.m_rootSizeHeight == height) {
                return;
            }
            this.root.setDirty(true);
            if (this.expandSize) {
                var rootui = this.root;
                var uiwidth = rootui.width;
                if (uiwidth != width)
                    rootui.width = width;
                var uiheight = rootui.height;
                if (uiheight != height)
                    rootui.height = height;
            }
            this.m_rootSizeWidth = width;
            this.m_rootSizeHeight = height;
            this.m_rootRect = [0, 0, width, height];
        };
        RUIRoot.prototype.dispatchEvent = function (event) {
            var target = event.object;
            if (event instanceof RUIEvent_2.RUIKeyboardEvent) {
                var activeUI = this.m_activeUI;
                if (activeUI != null) {
                    activeUI.onKeyPress(event);
                }
            }
            else if (event instanceof RUIEvent_2.RUIWheelEvent) {
                var hoverUI = this.m_hoverUI;
                var wheele = event;
                for (var i = 0, clen = hoverUI.length; i < clen; i++) {
                    var c = hoverUI[i];
                    if (c instanceof RUIContainer_1.RUIContainer) {
                        c.onMouseWheel(wheele);
                        if (wheele.isUsed)
                            break;
                    }
                }
            }
            else if (event instanceof RUIEvent_2.RUIMouseEvent) {
                this.dispatchMouseEvent(event);
            }
        };
        RUIRoot.prototype.dispatchMouseEvent = function (e) {
            var etype = e.type;
            if (etype == RUIEvent_2.RUIEventType.MouseMove) {
                this.dispatchMouseMove(e.mousex, e.mousey);
                if (this.m_onMouseDown && this.m_activeUI != null) {
                    //drag move
                    if (!this.m_activeUIonDrag) {
                        this.m_activeUIonDrag = true;
                        this.m_activeUI.onMouseDrag(new RUIEvent_2.RUIMouseDragEvent(e, RUIEvent_2.RUIMouseDragStage.Begin));
                    }
                    else {
                        this.m_activeUI.onMouseDrag(new RUIEvent_2.RUIMouseDragEvent(e, RUIEvent_2.RUIMouseDragStage.Update));
                    }
                }
            }
            else {
                var newActiveUI = this.traversalNormal(e.mousex, e.mousey);
                var curActiveUI = this.m_activeUI;
                switch (etype) {
                    case RUIEvent_2.RUIEventType.MouseDown:
                        {
                            this.m_onMouseDown = true;
                            if (curActiveUI != null && curActiveUI != newActiveUI) {
                                curActiveUI.onInactive();
                            }
                            if (newActiveUI != null) {
                                newActiveUI.onMouseDown(e);
                                if (newActiveUI != curActiveUI)
                                    newActiveUI.onActive();
                            }
                            this.m_activeUI = newActiveUI;
                        }
                        break;
                    case RUIEvent_2.RUIEventType.MouseUp:
                        {
                            this.m_onMouseDown = false;
                            if (newActiveUI != null) {
                                newActiveUI.onMouseUp(e);
                                if (newActiveUI == curActiveUI) {
                                    newActiveUI.onMouseClick(e);
                                }
                            }
                            if (curActiveUI != null && this.m_activeUIonDrag) {
                                curActiveUI.onMouseDrag(new RUIEvent_2.RUIMouseDragEvent(e, RUIEvent_2.RUIMouseDragStage.End));
                            }
                            this.m_activeUIonDrag = false;
                        }
                        break;
                }
            }
        };
        RUIRoot.prototype.layout = function () {
            var root = this.root;
            root.isdirty = false;
            this.isdirty = false;
            if (root.isOnFlow) {
                root.Layout();
                var data = new RUIObject_3.RUILayoutData();
                data.containerHeight = this.m_rootSizeHeight;
                data.containerWidth = this.m_rootSizeWidth;
                root.LayoutPost(data);
            }
            else {
                RUIObject_4.RUIDefaultLayouter.LayoutRelative(root, this.m_rootSizeWidth, this.m_rootSizeHeight);
            }
            if (root instanceof RUIContainer_1.RUIContainer) {
                this.calculateFinalOffset(root);
            }
            else {
                root.rCalx = root.rOffx;
                root.rCaly = root.rOffy;
            }
        };
        RUIRoot.prototype.calculateFinalOffset = function (cui, order) {
            if (order === void 0) { order = 0; }
            var children = cui.children;
            var clen = children.length;
            var isVertical = cui.boxOrientation == RUIObject_3.RUIOrientation.Vertical;
            var corder = order;
            if (clen > 0) {
                var offx = cui.rCalx;
                var offy = cui.rCaly;
                var clevel = cui._level + 1;
                var corder = cui._order + 1;
                for (var i = 0; i < clen; i++) {
                    var c = children[i];
                    c._level = clevel;
                    c._order = corder;
                    corder++;
                    //console.log('o '+c._order);
                    c.rCalx = offx + c.rOffx;
                    c.rCaly = offy + c.rOffy;
                    if (c instanceof RUIContainer_1.RUIContainer) {
                        corder = this.calculateFinalOffset(c, corder);
                    }
                    //c.onLayoutPost();
                }
            }
            return corder;
        };
        RUIRoot.prototype.dispatchMouseMove = function (x, y) {
            var newList = this.traversalAll(x, y);
            var curList = this.m_hoverUI;
            for (var i = curList.length - 1; i >= 0; i--) {
                var c = curList[i];
                if (newList.indexOf(c) == -1) {
                    c.onMouseLeave();
                    curList.splice(i, 1);
                }
            }
            curList.sort(function (x, y) {
                return y._order - x._order;
            });
            for (var i = 0, len = newList.length; i < len; i++) {
                var c = newList[i];
                if (curList.indexOf(c) >= 0)
                    continue;
                c.onMouseEnter();
                curList.push(c);
            }
        };
        RUIRoot.prototype.traversalAll = function (x, y) {
            var list = [];
            var f = function (ui) {
                if (!ui.enable)
                    return;
                if (ui.rectContains(x, y)) {
                    list.push(ui);
                }
            };
            var root = this.root;
            if (root instanceof RUIContainer_1.RUIContainer) {
                root.traversal(f);
            }
            else {
                f(root);
            }
            return list;
        };
        RUIRoot.prototype.traversalNormal = function (x, y) {
            var target = null;
            var f = function (ui) {
                if (!ui.enable)
                    return;
                if (!ui.responseToMouseEvent)
                    return;
                if (ui.rectContains(x, y)) {
                    if (target == null) {
                        target = ui;
                    }
                    else {
                        if (ui._order >= target._order)
                            target = ui;
                    }
                }
            };
            var root = this.root;
            if (root instanceof RUIContainer_1.RUIContainer) {
                root.traversal(f);
            }
            else {
                f(root);
            }
            return target;
        };
        return RUIRoot;
    }());
    exports.RUIRoot = RUIRoot;
});
define("rui/RUIObject", ["require", "exports", "rui/RUIUtil"], function (require, exports, RUIUtil_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RUIAuto = -Infinity;
    exports.RUICLIP_MAX = [0, 0, 5000, 5000];
    exports.RUICLIP_NULL = null;
    function ROUND(x) {
        return Math.round(x);
    }
    exports.ROUND = ROUND;
    function CLAMP(val, min, max) {
        return Math.min(Math.max(min, val), max);
    }
    exports.CLAMP = CLAMP;
    var RUIConst = /** @class */ (function () {
        function RUIConst() {
        }
        RUIConst.TOP = 0;
        RUIConst.RIGHT = 1;
        RUIConst.BOTTOM = 2;
        RUIConst.LEFT = 3;
        return RUIConst;
    }());
    exports.RUIConst = RUIConst;
    var RUIPosition;
    (function (RUIPosition) {
        RUIPosition[RUIPosition["Default"] = 0] = "Default";
        RUIPosition[RUIPosition["Relative"] = 1] = "Relative";
        RUIPosition[RUIPosition["Absolute"] = 2] = "Absolute";
        RUIPosition[RUIPosition["Offset"] = 3] = "Offset";
    })(RUIPosition = exports.RUIPosition || (exports.RUIPosition = {}));
    var RUIBoxFlow;
    (function (RUIBoxFlow) {
        RUIBoxFlow[RUIBoxFlow["Flow"] = 0] = "Flow";
        RUIBoxFlow[RUIBoxFlow["Flex"] = 1] = "Flex";
    })(RUIBoxFlow = exports.RUIBoxFlow || (exports.RUIBoxFlow = {}));
    var RUIOverflow;
    (function (RUIOverflow) {
        RUIOverflow[RUIOverflow["Clip"] = 0] = "Clip";
        RUIOverflow[RUIOverflow["Scroll"] = 1] = "Scroll";
    })(RUIOverflow = exports.RUIOverflow || (exports.RUIOverflow = {}));
    var RUIOrientation;
    (function (RUIOrientation) {
        RUIOrientation[RUIOrientation["Vertical"] = 0] = "Vertical";
        RUIOrientation[RUIOrientation["Horizontal"] = 1] = "Horizontal";
    })(RUIOrientation = exports.RUIOrientation || (exports.RUIOrientation = {}));
    var RUIObject = /** @class */ (function () {
        function RUIObject() {
            this.maxwidth = exports.RUIAuto;
            this.maxheight = exports.RUIAuto;
            this.minwidth = 70;
            this.minheight = 23;
            this.margin = [0, 0, 0, 0]; // top right bottom left
            this.padding = [0, 0, 0, 0];
            this.position = RUIPosition.Default;
            this.left = exports.RUIAuto;
            this.right = exports.RUIAuto;
            this.top = exports.RUIAuto;
            this.bottom = exports.RUIAuto;
            this.visible = true;
            this.zorder = 0;
            this.parent = null;
            this.isdirty = true;
            this.isClip = true;
            this._enable = true;
            this._level = 0;
            this._order = 0;
            this._resized = true;
            /* Refactoring Start*/
            this.rWidth = exports.RUIAuto;
            this.rHeight = exports.RUIAuto;
            //Layouter
            this.layouter = RUIDefaultLayouter.Layouter;
            this.rOffx = 0;
            this.rOffy = 0;
            this.rCalx = 0;
            this.rCaly = 0;
            this.clipMask = exports.RUICLIP_MAX;
            this.responseToMouseEvent = true;
        }
        RUIObject.prototype.Layout = function () {
            this.layoutWidth = null;
            this.layoutHeight = null;
            this.layouter.Layout(this);
            if (Number.isNaN(this.layoutWidth) || Number.isNaN(this.layoutHeight)) {
                console.error(this);
                throw new Error('layout data is NaN');
            }
        };
        RUIObject.prototype.LayoutPost = function (data) {
            if (data == null)
                throw new Error('layout data is null!');
            data.verify();
            this.layouter.LayoutPost(this, data);
        };
        RUIObject.prototype.Update = function () {
        };
        //Layouter end
        /* Refactoring end */
        RUIObject.prototype.onDraw = function (cmd) {
            var rect = this.calculateRect();
            this._rect = rect;
            var cliprect = RUIUtil_4.RUIUtil.RectClip(rect, this.clipMask);
            this._drawClipRect = cliprect;
        };
        Object.defineProperty(RUIObject.prototype, "width", {
            get: function () {
                return this.rWidth;
            },
            set: function (val) {
                if (val != this.rWidth) {
                    this.rWidth = val;
                    this._resized = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUIObject.prototype, "height", {
            get: function () {
                return this.rHeight;
            },
            set: function (val) {
                if (val != this.rHeight) {
                    this.rHeight = val;
                    this._resized = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUIObject.prototype, "isRoot", {
            get: function () {
                return this._root.root === this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUIObject.prototype, "isOnFlow", {
            get: function () {
                var pos = this.position;
                return (pos == RUIPosition.Default || pos == RUIPosition.Offset);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUIObject.prototype, "isPositionOffset", {
            get: function () {
                return this.position == RUIPosition.Offset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUIObject.prototype, "positionOffsetX", {
            get: function () {
                var coffx = this.left;
                if (coffx == exports.RUIAuto)
                    return 0;
                return coffx;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUIObject.prototype, "positionOffsetY", {
            get: function () {
                var coffy = this.top;
                if (coffy == exports.RUIAuto)
                    return 0;
                return coffy;
            },
            enumerable: true,
            configurable: true
        });
        RUIObject.prototype.setRoot = function (root) {
            this._root = root;
        };
        Object.defineProperty(RUIObject.prototype, "enable", {
            get: function () {
                return this._enable;
            },
            set: function (val) {
                if (this._enable == val)
                    return;
                this._enable = val;
                this.setDirty();
            },
            enumerable: true,
            configurable: true
        });
        RUIObject.prototype.setDirty = function (resize) {
            if (resize === void 0) { resize = false; }
            this.isdirty = true;
            var root = this._root;
            if (root != null) {
                root.isdirty = true;
            }
            if (this.parent != null) {
                this.parent.popupDirty();
            }
            if (resize)
                this._resized = true;
        };
        RUIObject.prototype.popupDirty = function () {
            this.isdirty = true;
            if (this.parent != null)
                this.parent.popupDirty();
        };
        RUIObject.prototype.onMouseDown = function (e) { };
        RUIObject.prototype.onMouseUp = function (e) { };
        RUIObject.prototype.onActive = function () { };
        RUIObject.prototype.onInactive = function () { };
        RUIObject.prototype.onMouseLeave = function () { };
        RUIObject.prototype.onMouseEnter = function () { };
        RUIObject.prototype.onMouseClick = function (e) { };
        RUIObject.prototype.onMouseDrag = function (e) { };
        RUIObject.prototype.onKeyPress = function (e) { };
        RUIObject.prototype.calculateRect = function (cliprect) {
            if (this.rCalWidth == exports.RUIAuto || this.rCalHeight == exports.RUIAuto) {
                console.error(this);
                throw new Error('calculated size is auto!');
            }
            //let rect =  [this._calx,this._caly,this._calwidth,this._calheight];
            var rect = [this.rCalx, this.rCaly, this.rCalWidth, this.rCalHeight];
            if (cliprect != null) {
                return RUIUtil_4.RUIUtil.RectClip(rect, cliprect);
            }
            return rect;
        };
        RUIObject.prototype.rectContains = function (x, y) {
            var rect = this._drawClipRect;
            if (rect == null)
                return false;
            var calx = rect[0];
            var caly = rect[1];
            if (x < calx || x > calx + rect[2])
                return false;
            if (y < caly || y > caly + rect[3])
                return false;
            return true;
        };
        return RUIObject;
    }());
    exports.RUIObject = RUIObject;
    var RUIDefaultLayouter = /** @class */ (function () {
        function RUIDefaultLayouter() {
        }
        Object.defineProperty(RUIDefaultLayouter, "Layouter", {
            get: function () {
                return this.s_layouter;
            },
            enumerable: true,
            configurable: true
        });
        RUIDefaultLayouter.prototype.Layout = function (ui) {
            ui.layoutWidth = ui.rWidth;
            ui.layoutHeight = ui.rHeight;
        };
        RUIDefaultLayouter.prototype.LayoutPost = function (ui, data) {
            if (data.flexWidth != null) {
                ui.rCalWidth = data.flexWidth;
            }
            else {
                if (ui.layoutWidth == exports.RUIAuto) {
                    ui.rCalWidth = data.containerWidth;
                }
                else {
                    ui.rCalWidth = ui.layoutWidth;
                }
            }
            if (data.flexHeight != null) {
                ui.rCalHeight = data.flexHeight;
            }
            else {
                if (ui.layoutHeight == exports.RUIAuto) {
                    ui.rCalHeight = data.containerHeight;
                }
                else {
                    ui.rCalHeight = ui.layoutHeight;
                }
            }
        };
        RUIDefaultLayouter.LayoutRelative = function (c, cpw, cph) {
            var cleft = c.left;
            var cright = c.right;
            var ctop = c.top;
            var cbottom = c.bottom;
            var constraintHori = cleft != exports.RUIAuto && cright != exports.RUIAuto;
            var constraintVert = ctop != exports.RUIAuto && cbottom != exports.RUIAuto;
            var cwidth = exports.RUIAuto;
            var cheight = exports.RUIAuto;
            var coffx = cleft;
            var coffy = ctop;
            c.Layout();
            if (constraintHori) {
                cwidth = Math.max(0, cpw - cleft - cright);
            }
            else {
                if (c.layoutWidth != exports.RUIAuto) {
                    cwidth = c.layoutWidth;
                    if (cleft != exports.RUIAuto) {
                    }
                    else if (cright != exports.RUIAuto) {
                        coffx = cpw - cright - cwidth;
                    }
                    else {
                        coffx = ROUND((cpw - cwidth) / 2);
                    }
                }
                else {
                    // console.error(c);
                    // throw new Error();
                    coffx = cleft;
                }
            }
            if (constraintVert) {
                cheight = Math.max(0, cph - ctop - cbottom);
            }
            else {
                if (c.layoutHeight != exports.RUIAuto) {
                    cheight = c.layoutHeight;
                    if (ctop != exports.RUIAuto) {
                    }
                    else if (cbottom != exports.RUIAuto) {
                        coffy = cph - cbottom - cheight;
                    }
                    else {
                        coffy = ROUND((cph - cheight) / 2);
                    }
                }
                else {
                    // console.error(c);
                    // throw new Error();
                    coffy = ctop;
                }
            }
            var data = new RUILayoutData();
            data.flexWidth = cwidth;
            data.flexHeight = cheight;
            data.containerWidth = cpw;
            data.containerHeight = cph;
            c.LayoutPost(data);
            // c.rCalWidth = cwidth;
            // c.rCalHeight = cheight;
            c.rOffx = coffx;
            c.rOffy = coffy;
        };
        RUIDefaultLayouter.s_layouter = new RUIDefaultLayouter();
        return RUIDefaultLayouter;
    }());
    exports.RUIDefaultLayouter = RUIDefaultLayouter;
    var RUILayoutData = /** @class */ (function () {
        function RUILayoutData() {
        }
        RUILayoutData.prototype.verify = function () {
            if (Number.isNaN(this.containerWidth))
                throw new Error('container width is NaN');
            if (Number.isNaN(this.containerHeight))
                throw new Error('container height is NaN');
            if (this.containerWidth == exports.RUIAuto || this.containerHeight == exports.RUIAuto)
                throw new Error('coantiner size can not be RUIAuto');
        };
        return RUILayoutData;
    }());
    exports.RUILayoutData = RUILayoutData;
});
define("rui/RUIUtil", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    if (Array.prototype['includes'] == null) {
        Array.prototype['includes'] = function (o) {
            if (o == null)
                return false;
            var index = this.indexOf(o);
            if (index < 0)
                return false;
            return true;
        };
    }
    function ROUND(x) {
        return Math.round(x);
    }
    exports.ROUND = ROUND;
    function CLAMP(val, min, max) {
        return Math.min(Math.max(min, val), max);
    }
    exports.CLAMP = CLAMP;
    function SATURATE(val) {
        return Math.max(0, Math.min(1, val));
    }
    exports.SATURATE = SATURATE;
    function SIZE(val) {
        return Math.max(0, val);
    }
    exports.SIZE = SIZE;
    var RUIUtil = /** @class */ (function () {
        function RUIUtil() {
        }
        RUIUtil.RectClip = function (content, clip) {
            if (clip == null || content == null)
                return null;
            var x2 = content[0] + content[2];
            var y2 = content[1] + content[3];
            if (x2 <= clip[0])
                return null;
            if (y2 <= clip[1])
                return null;
            var cx2 = clip[0] + clip[2];
            var cy2 = clip[1] + clip[3];
            if (cx2 <= content[0])
                return null;
            if (cy2 <= content[1])
                return null;
            var x = Math.max(content[0], clip[0]);
            var y = Math.max(content[1], clip[1]);
            return [x, y, Math.min(x2, cx2) - x, Math.min(y2, cy2) - y];
        };
        RUIUtil.RectClipP = function (content, clip) {
            if (content == null || clip == null)
                return null;
            if (content[2] <= clip[0])
                return null;
            if (content[3] <= clip[1])
                return null;
            if (clip[2] <= content[0])
                return null;
            if (clip[3] <= content[1])
                return null;
            return [
                Math.max(content[0], clip[0]),
                Math.max(content[1], clip[1]),
                Math.min(content[2], clip[2]),
                Math.min(content[3], clip[3]),
            ];
        };
        RUIUtil.toRect = function (rect) {
            return [rect[0], rect[1], rect[2] - rect[0], rect[3] - rect[1]];
        };
        RUIUtil.toRectP = function (rect) {
            if (rect == null)
                return null;
            var x1 = rect[0];
            var y1 = rect[1];
            return [x1, y1, rect[2] + x1, rect[3] + y1];
        };
        RUIUtil.Vector = function (v) {
            return [v, v, v, v];
        };
        RUIUtil.ColorUNorm = function (r, g, b, a) {
            if (a === void 0) { a = 255; }
            return [r / 255.0, g / 255.0, b / 255.0, a / 255.0];
        };
        RUIUtil.RandomColor = function () {
            return [Math.random(), Math.random(), Math.random(), 1.0];
        };
        RUIUtil.RectContains = function (rect, x, y) {
            if (x < rect[0] || y < rect[1])
                return false;
            if (x > (rect[0] + rect[2]) || y > (rect[1] + rect[3]))
                return false;
            return true;
        };
        RUIUtil.IntersectNull = function (a, b) {
            if (a[0] > b[0] + b[2])
                return true;
            if (a[1] > b[1] + b[3])
                return true;
            if (b[0] > a[0] + a[2])
                return true;
            if (b[1] > a[1] + a[3])
                return true;
            return false;
        };
        RUIUtil.RectIndent = function (r, off) {
            var off2 = off * 2;
            return [r[0] + off, r[1] + off, r[2] - off2, r[3] - off2];
        };
        RUIUtil.ALIGN_CENTER = 0;
        RUIUtil.ALIGN_LEFT = 1;
        RUIUtil.ALIGN_RIGHT = 2;
        RUIUtil.LINE_HEIGHT_DEFAULT = 23;
        return RUIUtil;
    }());
    exports.RUIUtil = RUIUtil;
});
define("rui/RUIContext", ["require", "exports", "rui/RUIEvent"], function (require, exports, RUIEvent_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RUIEVENT_ONFRAME = new RUIEvent_3.RUIEventEmitter();
    var RUI_INITED = false;
    function RUIInitContext(config) {
        console.log('init');
        exports.RUI_CONFIG = config;
        if (!RUI_INITED) {
            console.log('init rui');
            RUI_INITED = true;
            window.requestAnimationFrame(onRequestAnimationFrame);
        }
    }
    exports.RUIInitContext = RUIInitContext;
    function onRequestAnimationFrame(f) {
        exports.RUIEVENT_ONFRAME.emitRaw(f);
        window.requestAnimationFrame(onRequestAnimationFrame);
    }
});
define("rui/RUIFontTexture", ["require", "exports", "rui/RUIEvent", "rui/RUIContext", "opentype.js"], function (require, exports, RUIEvent_4, RUIContext_1, opentype_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIGlyph = /** @class */ (function () {
        function RUIGlyph() {
        }
        return RUIGlyph;
    }());
    exports.RUIGlyph = RUIGlyph;
    var RUIFontTexture = /** @class */ (function () {
        function RUIFontTexture() {
            this.m_textureValid = false;
            this.glyphs = {};
            this.glyphsWidth = [];
            this.m_isDirty = false;
            this.fontSize = 16;
            this.CrateTexture();
            this.LoadFont();
        }
        Object.defineProperty(RUIFontTexture.prototype, "isTextureValid", {
            get: function () {
                return this.m_textureValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUIFontTexture.prototype, "isDirty", {
            get: function () {
                return this.m_isDirty;
            },
            set: function (d) {
                this.m_isDirty = d;
            },
            enumerable: true,
            configurable: true
        });
        RUIFontTexture.Init = function (gl) {
            if (RUIFontTexture.s_inited)
                return;
            RUIFontTexture.s_gl = gl;
            RUIFontTexture.ASIICTexture = new RUIFontTexture();
            RUIFontTexture.s_inited = true;
        };
        RUIFontTexture.prototype.LoadFont = function () {
            var _this = this;
            opentype_js_1.default.load(RUIContext_1.RUI_CONFIG.fontPath, function (e, f) {
                _this.m_font = f;
                _this.FillTexture();
            });
        };
        RUIFontTexture.prototype.MeasureTextWith = function (content) {
            var w = 0;
            var gw = this.glyphsWidth;
            for (var i = 0, len = content.length; i < len; i++) {
                w += gw[content.charCodeAt(i)];
            }
            return w;
        };
        RUIFontTexture.prototype.FillTexture = function () {
            var _this = this;
            var f = this.m_font;
            var ctx2d = this.m_ctx2d;
            var fontsize = this.fontSize;
            var upx = fontsize / f.unitsPerEm;
            var linh = 0;
            var linw = 0;
            var maxh = 0;
            var uvunit = 1.0 / this.m_textureWidth;
            var glyphWidth = this.glyphsWidth;
            for (i = 0; i < 33; i++) {
                glyphWidth.push(5);
            }
            for (var i = 33; i <= 126; i++) {
                var c = String.fromCharCode(i);
                var g = f.charToGlyph(c);
                var m = g.getMetrics();
                var y = Math.ceil(upx * (m.yMax - m.yMin));
                var ybase = Math.ceil(upx * (m.yMax));
                var x = Math.ceil(upx * (m.xMax - m.xMin));
                if (linw + x > 126) {
                    linw = 0;
                    linh += fontsize;
                    maxh = 0;
                }
                var glyph = new RUIGlyph();
                glyph.width = x;
                glyph.height = y;
                glyph.advancex = g.advanceWidth * upx;
                glyph.offsetY = ybase;
                glyphWidth.push(x);
                var uvx1 = linw * uvunit;
                var uvx2 = (linw + x) * uvunit;
                var uvy1 = linh * uvunit;
                var uvy2 = (linh + y) * uvunit;
                glyph.uv = [uvx1, uvy1, uvx2, uvy1, uvx2, uvy2, uvx1, uvy2];
                this.glyphs[i] = glyph;
                var p = g.getPath(linw - 1, linh + ybase, fontsize);
                p['fill'] = "white";
                p.draw(ctx2d);
                linw += x + 2;
                maxh = Math.max(maxh, y);
            }
            var url = ctx2d.canvas.toDataURL('image/png');
            var glctx = RUIFontTexture.s_gl;
            var gl = glctx.gl;
            var gltex = this.createTextureImage(glctx, gl.RGBA, gl.RGBA, url, true, true, function () {
                _this.m_textureValid = true;
                _this.m_isDirty = true;
                RUIFontTexture.EventOnTextureLoaded.emitRaw(_this);
            });
            this.m_glTexture = gltex;
        };
        RUIFontTexture.prototype.createTextureImage = function (glctx, internalFmt, format, src, linear, mipmap, callback) {
            if (linear === void 0) { linear = true; }
            if (mipmap === void 0) { mipmap = true; }
            var gl = glctx.gl;
            var img = new Image();
            var tex = gl.createTexture();
            img.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.texImage2D(gl.TEXTURE_2D, 0, internalFmt, format, gl.UNSIGNED_BYTE, img);
                if (mipmap)
                    gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, linear ? gl.LINEAR : gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, linear ? (mipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR) : gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
                if (callback != null)
                    callback();
            };
            img.src = src;
            return tex;
        };
        RUIFontTexture.prototype.CrateTexture = function () {
            var texw = 128;
            var texh = 128;
            var canvas2d = document.createElement("canvas");
            canvas2d.style.backgroundColor = "#00000000";
            canvas2d.width = texw;
            canvas2d.height = texh;
            var h = this.fontSize;
            var lineh = h;
            var linew = 0;
            var ctx = canvas2d.getContext('2d');
            this.m_ctx2d = ctx;
            //document.body.appendChild(canvas2d);
            this.m_textureWidth = texw;
            this.m_textureHeight = texh;
        };
        RUIFontTexture.s_inited = false;
        RUIFontTexture.EventOnTextureLoaded = new RUIEvent_4.RUIEventEmitter();
        return RUIFontTexture;
    }());
    exports.RUIFontTexture = RUIFontTexture;
});
define("rui/RUIDrawCallBuffer", ["require", "exports", "rui/RUIShaderLib", "rui/RUIFontTexture", "rui/RUICmdList", "rui/RUIColor"], function (require, exports, RUIShaderLib_1, RUIFontTexture_1, RUICmdList_1, RUIColor_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var COLOR_ERROR = [1, 0, 1, 1];
    var MAX_RECT_COUNT = 512;
    var RUIArrayBuffer = /** @class */ (function () {
        function RUIArrayBuffer(TCtor, size) {
            if (size === void 0) { size = 512; }
            this.pos = 0;
            this.m_size = size;
            this.m_tctor = TCtor;
            this.buffer = new this.m_tctor(size);
        }
        RUIArrayBuffer.prototype.push = function (ary) {
            var len = ary.length;
            var newpos = this.pos + len;
            this.checkExten(newpos);
            this.buffer.set(ary, this.pos);
            this.pos = newpos;
        };
        RUIArrayBuffer.prototype.checkExten = function (size) {
            var cursize = this.m_size;
            if (size >= cursize) {
                var newbuffer = new this.m_tctor(cursize * 2);
                newbuffer.set(this.buffer, 0);
                this.buffer = newbuffer;
                this.m_size = cursize * 2;
            }
        };
        RUIArrayBuffer.prototype.resetPos = function () {
            this.pos = 0;
            return this;
        };
        return RUIArrayBuffer;
    }());
    var RUIArrayBufferF32 = /** @class */ (function (_super) {
        __extends(RUIArrayBufferF32, _super);
        function RUIArrayBufferF32() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return RUIArrayBufferF32;
    }(RUIArrayBuffer));
    var RUIArrayBufferUI16 = /** @class */ (function (_super) {
        __extends(RUIArrayBufferUI16, _super);
        function RUIArrayBufferUI16() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return RUIArrayBufferUI16;
    }(RUIArrayBuffer));
    var RUITextureDrawData = /** @class */ (function () {
        function RUITextureDrawData() {
            this.data = [];
            this.uv = [];
            this.count = 0;
        }
        return RUITextureDrawData;
    }());
    exports.RUITextureDrawData = RUITextureDrawData;
    var RUIDrawCallBuffer = /** @class */ (function () {
        function RUIDrawCallBuffer(glctx, drawcall) {
            this.drawCountRect = 0;
            this.drawCountText = 0;
            this.isDirty = true;
            this.m_indicesBufferArray = new RUIArrayBufferUI16(Uint16Array);
            this.m_aryBufferRectColor = new RUIArrayBufferF32(Float32Array);
            this.m_aryBufferRectPos = new RUIArrayBufferF32(Float32Array);
            this.m_aryBufferRectClip = new RUIArrayBufferF32(Float32Array);
            this.m_aryBufferTextPos = new RUIArrayBufferF32(Float32Array);
            this.m_aryBufferTextUV = new RUIArrayBufferF32(Float32Array);
            this.m_aryBufferTextClip = new RUIArrayBufferF32(Float32Array);
            this.textureDrawData = [];
            var gl = glctx.gl;
            this.m_drawcall = drawcall;
            if (drawcall == null)
                return;
            //Shaders
            this.programRect = glctx.createProgram(RUIShaderLib_1.GLSL_VERT_DEF, RUIShaderLib_1.GLSL_FRAG_COLOR);
            this.programText = glctx.createProgram(RUIShaderLib_1.GLSL_VERT_TEXT, RUIShaderLib_1.GLSL_FRAG_TEXT);
            this.programImage = glctx.createProgram(RUIShaderLib_1.GLSL_VERT_IMAGE, RUIShaderLib_1.GLSL_FRAG_IMAGE);
            //IndicesBuffer
            {
                var ibuffer = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuffer);
                var idata = this.m_indicesBufferArray;
                var ic = 0;
                for (var i = 0; i < MAX_RECT_COUNT; i++) {
                    idata.push([ic, ic + 2, ic + 1, ic, ic + 3, ic + 2]);
                    ic += 4;
                }
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idata.buffer, gl.STATIC_DRAW);
                this.indicesBuffer = ibuffer;
            }
            //Rect
            {
                var program = this.programRect;
                var vao = gl.createVertexArray();
                this.vaoRect = vao;
                gl.bindVertexArray(vao);
                //position
                var vbuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
                this.vertexBufferRect = vbuffer;
                gl.vertexAttribPointer(program.aPosition, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(program.aPosition);
                //color
                var cbuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, cbuffer);
                this.colorBufferRect = cbuffer;
                gl.vertexAttribPointer(program.aColor, 4, gl.FLOAT, true, 0, 0);
                gl.enableVertexAttribArray(program.aColor);
                //clip
                var clipbuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, clipbuffer);
                this.clipBufferRect = clipbuffer;
                gl.vertexAttribPointer(program.aClip, 4, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(program.aClip);
                //indices buffer
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
                gl.bindVertexArray(null);
            }
            //Text
            {
                var program = this.programText;
                var vao = gl.createVertexArray();
                this.vaoText = vao;
                gl.bindVertexArray(vao);
                //Position
                var vbuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
                this.vertexBufferText = vbuffer;
                gl.vertexAttribPointer(program.aPosition, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(program.aPosition);
                //Color
                gl.disableVertexAttribArray(program.aColor);
                //UV
                var uvbuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, uvbuffer);
                this.uvBufferText = uvbuffer;
                gl.vertexAttribPointer(program.aUV, 2, gl.FLOAT, true, 0, 0);
                gl.enableVertexAttribArray(program.aUV);
                //Clip
                var clipbuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, clipbuffer);
                this.clipBufferText = clipbuffer;
                gl.vertexAttribPointer(program.aClip, 4, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(program.aClip);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
                gl.bindVertexArray(null);
            }
            //Image
            {
                var program = this.programImage;
                var vao = gl.createVertexArray();
                this.vaoImage = vao;
                gl.bindVertexArray(vao);
                //position
                var vbuffer = gl.createBuffer();
                this.vertexBufferImage = vbuffer;
                gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
                gl.vertexAttribPointer(program.aPosition, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(program.aPosition);
                //uv
                var uvbuffer = gl.createBuffer();
                this.uvBufferImage = uvbuffer;
                gl.bindBuffer(gl.ARRAY_BUFFER, uvbuffer);
                gl.vertexAttribPointer(program.aUV, 2, gl.FLOAT, true, 0, 0);
                gl.enableVertexAttribArray(program.aUV);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
                gl.bindVertexArray(null);
            }
        }
        RUIDrawCallBuffer.prototype.SyncBuffer = function (gl, textureStorage) {
            this.isDirty = true;
            var drawcall = this.m_drawcall;
            var drawlist = drawcall.drawList;
            var fonttex = RUIFontTexture_1.RUIFontTexture.ASIICTexture;
            if (drawlist.length == 0) {
                return;
            }
            var textureDraw = [];
            this.textureDrawData = textureDraw;
            var drawDepthMax = drawcall.MaxDrawCount;
            var rect_vert = this.m_aryBufferRectPos.resetPos();
            var rect_color = this.m_aryBufferRectColor.resetPos();
            var rect_clip = this.m_aryBufferRectClip.resetPos();
            var text_vert = this.m_aryBufferTextPos.resetPos();
            var text_uv = this.m_aryBufferTextUV.resetPos();
            var text_clip = this.m_aryBufferTextClip.resetPos();
            var rectCount = 0;
            var textCount = 0;
            var maxClip = [0, 0, 2000, 1000];
            maxClip[2] = maxClip[0] + maxClip[2];
            maxClip[3] = maxClip[1] + maxClip[3];
            var cmdlen = drawlist.length;
            for (var i = cmdlen - 1; i >= 0; i--) {
                var cmd = drawlist[i];
                var rect = cmd.Rect;
                var color = cmd.Color;
                var d = 1.0 - cmd.Index * 1.0 / drawDepthMax;
                var clip = cmd.clip == null ? maxClip : cmd.clip;
                switch (cmd.type) {
                    case RUICmdList_1.RUIDrawCmdType.rect:
                        {
                            if (color == null)
                                color = COLOR_ERROR;
                            rect_color.push(color);
                            rect_color.push(color);
                            rect_color.push(color);
                            rect_color.push(color);
                            var x = rect[0];
                            var y = rect[1];
                            var w = rect[2];
                            var h = rect[3];
                            rect_vert.push([x, y, d, x + w, y, d, x + w, y + h, d, x, y + h, d]);
                            rect_clip.push(clip);
                            rect_clip.push(clip);
                            rect_clip.push(clip);
                            rect_clip.push(clip);
                            rectCount++;
                        }
                        break;
                    case RUICmdList_1.RUIDrawCmdType.line:
                        {
                            if (color == null)
                                color = RUIColor_2.RUIColor.GREY;
                            rect_color.push(color);
                            rect_color.push(color);
                            rect_color.push(color);
                            rect_color.push(color);
                            var x1 = rect[0];
                            var y1 = rect[1];
                            var x2 = rect[2];
                            var y2 = rect[3];
                            var dx = x2 - x1;
                            var dy = y2 - y1;
                            var len_1 = Math.sqrt(dx * dx + dy * dy) * 2;
                            dx = dx / len_1;
                            dy = dy / len_1;
                            rect_vert.push([x1 + dx, y1 + dy, d, x2 + dx, y2 + dy, d, x2 - dx, y2 - dy, d, x1 - dx, y1 - dy, d]);
                            rect_clip.push(clip);
                            rect_clip.push(clip);
                            rect_clip.push(clip);
                            rect_clip.push(clip);
                            rectCount++;
                        }
                        break;
                    case RUICmdList_1.RUIDrawCmdType.border:
                        {
                            if (color == null)
                                color = COLOR_ERROR;
                            for (var n = 0; n < 16; n++) {
                                rect_color.push(color);
                                rect_clip.push(clip);
                            }
                            var x1 = rect[0];
                            var y1 = rect[1];
                            var x2 = x1 + rect[2];
                            var y2 = y1 + rect[3];
                            rect_vert.push([x1, y1, d, x2, y1, d, x2, y1 + 1, d, x1, y1 + 1, d]);
                            rect_vert.push([x2 - 1, y1, d, x2, y1, d, x2, y2, d, x2 - 1, y2, d]);
                            rect_vert.push([x1, y2 - 1, d, x2, y2 - 1, d, x2, y2, d, x1, y2, d]);
                            rect_vert.push([x1, y1, d, x1 + 1, y1, d, x1 + 1, y2, d, x1, y2, d]);
                            rectCount += 4;
                        }
                        break;
                    case RUICmdList_1.RUIDrawCmdType.text:
                        {
                            var content = cmd.Text;
                            if (content == null || content === '')
                                break;
                            var x = rect[0];
                            var y = rect[1];
                            var w = rect[2];
                            var h = rect[3];
                            //clip = cmd.Rect;
                            // clip[2]+= clip[0];
                            // clip[3]+=clip[1];
                            var contentW = fonttex.MeasureTextWith(content);
                            x += Math.max(3, Math.floor((w - contentW) / 2.0));
                            y = y + fonttex.fontSize;
                            for (var j = 0, len = content.length; j < len; j++) {
                                var glyph = fonttex.glyphs[content.charCodeAt(j)];
                                if (glyph == null) {
                                    // text_vert.push(x, y, x + w, y, x + w, y + h, x, y + h);
                                    // text_uv.push(0, 0, 1, 0, 1, 1, 0, 1);
                                    x += 8;
                                }
                                else {
                                    var drawy = y - glyph.offsetY;
                                    var drawy1 = drawy + glyph.height;
                                    var drawx1 = x + glyph.width;
                                    text_vert.push([x, drawy, d, drawx1, drawy, d, drawx1, drawy1, d, x, drawy1, d]);
                                    text_uv.push(glyph.uv);
                                    text_clip.push(clip);
                                    text_clip.push(clip);
                                    text_clip.push(clip);
                                    text_clip.push(clip);
                                    x += glyph.width + 1;
                                    textCount++;
                                }
                            }
                        }
                        break;
                    case RUICmdList_1.RUIDrawCmdType.image:
                        {
                            var image = cmd.object;
                            var tex = textureStorage.getTexture(image);
                            var drawData = void 0;
                            for (var j = 0, len = textureDraw.length; j < len; j++) {
                                var tempdrawdata = textureDraw[j];
                                if (tempdrawdata.texture == tex) {
                                    drawData = tempdrawdata;
                                    break;
                                }
                            }
                            if (drawData == null) {
                                drawData = new RUITextureDrawData();
                                drawData.texture = tex;
                                textureDraw.push(drawData);
                            }
                            var rect_1 = cmd.Rect;
                            var x = rect_1[0];
                            var y = rect_1[1];
                            var x1 = rect_1[2];
                            var y1 = rect_1[3];
                            drawData.data.push(x, y, d, x1, y, d, x1, y1, d, x, y1, d);
                            if (cmd.param == null) {
                                drawData.uv.push(0, 0, 1, 0, 1, 1, 0, 1);
                            }
                            else {
                                var uv = drawData.uv;
                                uv = uv.concat(cmd.param);
                                drawData.uv = uv;
                            }
                            drawData.count++;
                        }
                        break;
                }
            }
            //Rect
            {
                this.drawCountRect = rectCount;
                if (rectCount != 0) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferRect);
                    gl.bufferData(gl.ARRAY_BUFFER, rect_vert.buffer, gl.STATIC_DRAW);
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBufferRect);
                    gl.bufferData(gl.ARRAY_BUFFER, rect_color.buffer, gl.STATIC_DRAW);
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.clipBufferRect);
                    gl.bufferData(gl.ARRAY_BUFFER, rect_clip.buffer, gl.STATIC_DRAW);
                }
            }
            //Text{
            this.drawCountText = textCount;
            if (textCount != 0) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferText);
                gl.bufferData(gl.ARRAY_BUFFER, text_vert.buffer, gl.STATIC_DRAW);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBufferText);
                gl.bufferData(gl.ARRAY_BUFFER, text_uv.buffer, gl.STATIC_DRAW);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.clipBufferText);
                gl.bufferData(gl.ARRAY_BUFFER, text_clip.buffer, gl.STATIC_DRAW);
            }
        };
        return RUIDrawCallBuffer;
    }());
    exports.RUIDrawCallBuffer = RUIDrawCallBuffer;
});
define("rui/RUIStyle", ["require", "exports", "rui/RUIUtil"], function (require, exports, RUIUtil_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIStyle = /** @class */ (function () {
        function RUIStyle() {
            this.background0 = RUIUtil_5.RUIUtil.ColorUNorm(15, 15, 15, 255);
            this.background1 = RUIUtil_5.RUIUtil.ColorUNorm(30, 30, 30, 255);
            this.background2 = RUIUtil_5.RUIUtil.ColorUNorm(37, 37, 38);
            this.background3 = RUIUtil_5.RUIUtil.ColorUNorm(51, 51, 51);
            this.primary = RUIUtil_5.RUIUtil.ColorUNorm(0, 122, 204);
            this.primary0 = RUIUtil_5.RUIUtil.ColorUNorm(9, 71, 113);
            this.inactive = RUIUtil_5.RUIUtil.ColorUNorm(63, 63, 70);
            this.border0 = RUIUtil_5.RUIUtil.ColorUNorm(3, 3, 3);
        }
        RUIStyle.Default = new RUIStyle();
        return RUIStyle;
    }());
    exports.RUIStyle = RUIStyle;
});
define("rui/RUIRenderer", ["require", "exports", "rui/RUIDrawCallBuffer", "rui/RUIFontTexture", "rui/RUIStyle", "wglut"], function (require, exports, RUIDrawCallBuffer_1, RUIFontTexture_2, RUIStyle_1, wglut) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIRenderer = /** @class */ (function () {
        function RUIRenderer(uicanvas) {
            this.m_drawcallBuffer = null;
            this.m_projectParam = [0, 0, 0, 0];
            this.m_isvalid = false;
            this.m_isResized = false;
            this.m_needRedraw = false;
            this.m_uicanvas = uicanvas;
            this.glctx = wglut.GLContext.createFromCanvas(uicanvas.canvas);
            this.m_textureStorage = new RUITextureStorage(this.glctx);
            if (!this.glctx) {
                return;
            }
            this.m_isvalid = true;
            this.gl = this.glctx.gl;
            var self = this;
            RUIFontTexture_2.RUIFontTexture.EventOnTextureLoaded.on(function (ft) {
                self.m_needRedraw = true;
            });
            RUIFontTexture_2.RUIFontTexture.Init(this.glctx);
            this.SetupGL();
            var canvas = uicanvas.canvas;
            this.resizeCanvas(window.innerWidth, window.innerHeight);
        }
        RUIRenderer.prototype.resizeCanvas = function (w, h) {
            this.gl.canvas.width = w;
            this.gl.canvas.height = h;
            this.m_uicanvas.setSize(w, h);
            this.m_projectParam = [2.0 / w, 2.0 / h, 0, 0];
            this.gl.viewport(0, 0, w, h);
            this.m_isResized = true;
        };
        Object.defineProperty(RUIRenderer.prototype, "isResized", {
            get: function () {
                return this.m_isResized;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUIRenderer.prototype, "needRedraw", {
            get: function () {
                return this.m_needRedraw;
            },
            enumerable: true,
            configurable: true
        });
        RUIRenderer.prototype.useResized = function () {
            this.m_isResized = false;
        };
        RUIRenderer.prototype.isValid = function () {
            return true;
        };
        RUIRenderer.prototype.SetupGL = function () {
            var gl = this.gl;
            if (gl == null)
                return;
            var glctx = this.glctx;
            //pipeline
            gl.enable(gl.DEPTH_TEST);
            gl.depthMask(true);
            gl.depthFunc(gl.LEQUAL);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            //gl.blendFunc(gl.SRC_ALPHA,gl.ONE);    //overdraw test
            var clearColor = RUIStyle_1.RUIStyle.Default.background1;
            gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
        };
        RUIRenderer.prototype.DrawCmdList = function (cmdlist) {
            if (cmdlist == null)
                return;
            if (this.m_drawcallBuffer == null) {
                this.m_drawcallBuffer = new RUIDrawCallBuffer_1.RUIDrawCallBuffer(this.glctx, cmdlist);
            }
            var fonttex = RUIFontTexture_2.RUIFontTexture.ASIICTexture;
            if (cmdlist.isDirty || fonttex.isDirty) {
                this.m_drawcallBuffer.SyncBuffer(this.gl, this.m_textureStorage);
                cmdlist.isDirty = false;
                fonttex.isDirty = false;
            }
            //do draw
            var drawbuffer = this.m_drawcallBuffer;
            if (!drawbuffer.isDirty)
                return;
            drawbuffer.isDirty = false;
            var gl = this.gl;
            gl.clear(gl.COLOR_BUFFER_BIT);
            //draw rect
            var drawRectCount = drawbuffer.drawCountRect;
            if (drawRectCount > 0) {
                var programRect = drawbuffer.programRect;
                gl.useProgram(programRect.Program);
                gl.uniform4fv(programRect.uProj, this.m_projectParam);
                gl.bindVertexArray(drawbuffer.vaoRect);
                gl.drawElements(gl.TRIANGLES, drawRectCount * 6, gl.UNSIGNED_SHORT, 0);
            }
            //draw text
            var drawTextCount = drawbuffer.drawCountText;
            if (drawTextCount > 0) {
                if (fonttex.isTextureValid) {
                    var programText = drawbuffer.programText;
                    gl.useProgram(programText.Program);
                    gl.uniform4fv(programText.uProj, this.m_projectParam);
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, fonttex.m_glTexture);
                    gl.uniform1i(programText.uSampler, 0);
                    gl.bindVertexArray(drawbuffer.vaoText);
                    gl.drawElements(gl.TRIANGLES, drawTextCount * 6, gl.UNSIGNED_SHORT, 0);
                }
                else {
                    console.log('texture not valid');
                    drawbuffer.isDirty = true;
                }
            }
            //draw image
            var drawTextureData = drawbuffer.textureDrawData;
            if (drawTextureData.length > 0) {
                var programImage = drawbuffer.programImage;
                gl.useProgram(programImage.Program);
                gl.uniform4fv(programImage.uProj, this.m_projectParam);
                gl.bindVertexArray(drawbuffer.vaoImage);
                for (var i = 0, len = drawTextureData.length; i < len; i++) {
                    var data = drawTextureData[i];
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, data.texture);
                    gl.uniform1i(programImage.uSampler, 0);
                    gl.bindBuffer(gl.ARRAY_BUFFER, drawbuffer.vertexBufferImage);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.data), gl.DYNAMIC_DRAW);
                    gl.bindBuffer(gl.ARRAY_BUFFER, drawbuffer.uvBufferImage);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.uv), gl.DYNAMIC_DRAW);
                    gl.drawElements(gl.TRIANGLES, data.count * 6, gl.UNSIGNED_SHORT, 0);
                }
            }
            this.m_needRedraw = false;
        };
        return RUIRenderer;
    }());
    exports.RUIRenderer = RUIRenderer;
    var RUITextureStorage = /** @class */ (function () {
        function RUITextureStorage(glctx) {
            this.m_map = [];
            this.m_glctx = glctx;
        }
        RUITextureStorage.prototype.getTexture = function (image) {
            var map = this.m_map;
            var tex = null;
            for (var i = 0, len = map.length; i < len; i++) {
                var pair = map[i];
                if (pair.key == image) {
                    tex = pair.value;
                    break;
                }
            }
            if (tex == null) {
                var gl = this.m_glctx.gl;
                tex = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
                gl.generateMipmap(gl.TEXTURE_2D);
                map.push({ key: image, value: tex });
            }
            return tex;
        };
        return RUITextureStorage;
    }());
    exports.RUITextureStorage = RUITextureStorage;
});
define("rui/RUIDOMCanvas", ["require", "exports", "rui/RUIInput", "rui/RUICursor", "rui/RUIRenderer", "rui/RUIEvent", "rui/RUIContainer", "rui/RUIRoot", "rui/RUIContext"], function (require, exports, RUIInput_1, RUICursor_1, RUIRenderer_1, RUIEvent_5, RUIContainer_2, RUIRoot_1, RUIContext_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIDOMCanvas = /** @class */ (function () {
        function RUIDOMCanvas(canvas, baseui) {
            if (baseui === void 0) { baseui = new RUIContainer_2.RUIContainer(); }
            this.m_isResized = false;
            this.EventOnResize = new RUIEvent_5.RUIEventEmitter();
            this.EventOnUIEvent = new RUIEvent_5.RUIEventEmitter();
            this.m_canvas = canvas;
            this.m_renderer = new RUIRenderer_1.RUIRenderer(this);
            this.m_input = new RUIInput_1.RUIInput(this);
            this.m_cursor = new RUICursor_1.RUICursor(this);
            this.registerEvent();
            if (baseui != null) {
                var root = new RUIRoot_1.RUIRoot(baseui, true);
                this.m_root = root;
                this.rootInit();
            }
            RUIContext_2.RUIEVENT_ONFRAME.on(this.onFrame.bind(this));
        }
        RUIDOMCanvas.prototype.rootInit = function () {
            var root = this.root;
            root.resizeRoot(this.canvasWidth, this.canvasHeight);
            this.EventOnResize.on(function (e) {
                root.resizeRoot(e.object.width, e.object.height);
            });
        };
        RUIDOMCanvas.prototype.registerEvent = function () {
            //disable context menu
            var ruicanvas = this;
            this.m_canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); return false; });
            window.addEventListener('resize', function () {
                ruicanvas.onResizeCanvas(window.innerWidth, window.innerHeight);
            });
        };
        RUIDOMCanvas.prototype.onFrame = function (f) {
        };
        RUIDOMCanvas.prototype.onResizeCanvas = function (width, height) {
            this.m_renderer.resizeCanvas(width, height);
            this.EventOnResize.emit(new RUIEvent_5.RUIResizeEvent(width, height));
        };
        Object.defineProperty(RUIDOMCanvas.prototype, "root", {
            get: function () {
                return this.m_root;
            },
            set: function (val) {
                if (val == null)
                    return;
                this.m_root = this.root;
                this.rootInit();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUIDOMCanvas.prototype, "canvasWidth", {
            get: function () {
                return this.m_canvas.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUIDOMCanvas.prototype, "canvasHeight", {
            get: function () {
                return this.m_canvas.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUIDOMCanvas.prototype, "canvas", {
            get: function () {
                return this.m_canvas;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUIDOMCanvas.prototype, "renderer", {
            get: function () {
                return this.m_renderer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUIDOMCanvas.prototype, "input", {
            get: function () {
                return this.m_input;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUIDOMCanvas.prototype, "cursor", {
            get: function () {
                return this.m_cursor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUIDOMCanvas.prototype, "canvasRect", {
            get: function () {
                return [0, 0, this.m_width, this.m_height];
            },
            enumerable: true,
            configurable: true
        });
        RUIDOMCanvas.prototype.setSize = function (w, h) {
            this.m_width = w;
            this.m_height = h;
        };
        return RUIDOMCanvas;
    }());
    exports.RUIDOMCanvas = RUIDOMCanvas;
});
define("rui/RUIRectangle", ["require", "exports", "rui/RUIObject", "rui/RUIUtil"], function (require, exports, RUIObject_5, RUIUtil_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIRectangle = /** @class */ (function (_super) {
        __extends(RUIRectangle, _super);
        function RUIRectangle(w, h) {
            if (w === void 0) { w = RUIObject_5.RUIAuto; }
            if (h === void 0) { h = RUIObject_5.RUIAuto; }
            var _this = _super.call(this) || this;
            _this.m_debugColor = RUIUtil_6.RUIUtil.RandomColor();
            _this.responseToMouseEvent = false;
            _this.width = w;
            _this.height = h;
            return _this;
        }
        RUIRectangle.create = function (color) {
            var rect = new RUIRectangle();
            rect.m_debugColor = color;
            return rect;
        };
        RUIRectangle.prototype.onDraw = function (cmd) {
            _super.prototype.onDraw.call(this, cmd);
            var cliprect = this._drawClipRect;
            if (cliprect == null) {
                return;
            }
            cmd.DrawRectWithColor(cliprect, this.m_debugColor);
        };
        RUIRectangle.prototype.onMouseUp = function () {
            //console.log('mouseup');
        };
        RUIRectangle.prototype.onMouseDown = function () {
            //console.log('mousedown');
        };
        RUIRectangle.prototype.onActive = function () {
            //console.log('onactive');
        };
        RUIRectangle.prototype.onInactive = function () {
            //console.log('inactive');
        };
        RUIRectangle.prototype.onMouseEnter = function () {
            //console.log('enter');
        };
        RUIRectangle.prototype.onMouseLeave = function () {
            //console.log('leave');
        };
        RUIRectangle.prototype.onMouseClick = function (e) {
            //console.log('click');
        };
        RUIRectangle.prototype.onMouseDrag = function (e) {
            //console.log('ondrag:' + e.ondrag);
        };
        return RUIRectangle;
    }(RUIObject_5.RUIObject));
    exports.RUIRectangle = RUIRectangle;
});
define("rui/RUIFlexContainer", ["require", "exports", "rui/RUIObject", "rui/RUIContainer"], function (require, exports, RUIObject_6, RUIContainer_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIFlexContainer = /** @class */ (function (_super) {
        __extends(RUIFlexContainer, _super);
        function RUIFlexContainer() {
            var _this = _super.call(this) || this;
            _this.layouter = RUIFlexLayouter.Default;
            return _this;
        }
        return RUIFlexContainer;
    }(RUIContainer_3.RUIContainer));
    exports.RUIFlexContainer = RUIFlexContainer;
    var RUIFlexLayouter = /** @class */ (function () {
        function RUIFlexLayouter() {
        }
        Object.defineProperty(RUIFlexLayouter, "Default", {
            get: function () {
                return this.s_default;
            },
            enumerable: true,
            configurable: true
        });
        RUIFlexLayouter.prototype.AccuFlex = function (flex, ui, isvertical) {
            if (ui.flex != null) {
                flex.layoutFlexAccu += ui.flex;
            }
            else {
                if (flex.isVertical) {
                    if (ui.layoutHeight == RUIObject_6.RUIAuto) {
                        throw new Error();
                    }
                    else {
                        flex.layoutFixedAccu += ui.layoutHeight;
                    }
                }
                else {
                    if (ui.layoutWidth == RUIObject_6.RUIAuto) {
                        throw new Error();
                    }
                    else {
                        flex.layoutFixedAccu += ui.layoutWidth;
                    }
                }
            }
        };
        RUIFlexLayouter.prototype.Layout = function (ui) {
            if (!(ui instanceof RUIFlexContainer))
                throw new Error();
            var cui = ui;
            var children = cui.children;
            var clen = children.length;
            var flowChildren = [];
            for (var i = 0; i < clen; i++) {
                var c = children[i];
                if (c.isOnFlow)
                    flowChildren.push(c);
            }
            children = flowChildren;
            var self = this;
            cui.layoutWidth = cui.rWidth;
            cui.layoutHeight = cui.rHeight;
            cui.layoutFlexAccu = 0;
            cui.layoutFixedAccu = 0;
            if (cui.isVertical) {
                if (cui.layoutWidth == RUIObject_6.RUIAuto) {
                    var maxwidth_1 = -1;
                    children.forEach(function (c) {
                        c.Layout();
                        if (c.layoutWidth != RUIObject_6.RUIAuto) {
                            maxwidth_1 = Math.max(maxwidth_1, c.layoutWidth);
                        }
                        self.AccuFlex(cui, c, true);
                    });
                    cui.layoutWidth = maxwidth_1 == -1 ? RUIObject_6.RUIAuto : maxwidth_1;
                    return;
                }
                else {
                    children.forEach(function (c) {
                        c.Layout();
                        self.AccuFlex(cui, c, true);
                    });
                    return;
                }
            }
            else {
                if (cui.layoutHeight == RUIObject_6.RUIAuto) {
                    var maxheight_1 = -1;
                    children.forEach(function (c) {
                        c.Layout();
                        if (c.layoutHeight != RUIObject_6.RUIAuto) {
                            maxheight_1 = Math.max(maxheight_1, c.layoutHeight);
                        }
                        self.AccuFlex(cui, c, false);
                    });
                    cui.layoutHeight = maxheight_1 == -1 ? RUIObject_6.RUIAuto : maxheight_1;
                    return;
                }
                else {
                    children.forEach(function (c) {
                        c.Layout();
                        self.AccuFlex(cui, c, false);
                    });
                    return;
                }
            }
        };
        RUIFlexLayouter.prototype.LayoutPost = function (ui, data) {
            if (!(ui instanceof RUIFlexContainer))
                throw new Error();
            var cui = ui;
            var children = cui.children;
            var isvertical = cui.isVertical;
            //Fill flex
            var dataFlexWidth = data.flexWidth;
            var dataFlexHeight = data.flexHeight;
            if (dataFlexWidth != null && dataFlexWidth != RUIObject_6.RUIAuto) {
                cui.layoutWidth = data.flexWidth;
            }
            if (dataFlexHeight != null && dataFlexHeight != RUIObject_6.RUIAuto) {
                cui.layoutHeight = data.flexHeight;
            }
            if (ui.layoutWidth === RUIObject_6.RUIAuto) {
                ui.layoutWidth = data.containerWidth;
            }
            if (ui.layoutHeight == RUIObject_6.RUIAuto) {
                ui.layoutHeight = data.containerHeight;
            }
            //start flex calculate
            var sizePerFlex = 0;
            if (isvertical) {
                sizePerFlex = (cui.layoutHeight - cui.layoutFixedAccu) / cui.layoutFlexAccu;
            }
            else {
                sizePerFlex = (cui.layoutWidth - cui.layoutFixedAccu) / cui.layoutFlexAccu;
            }
            var containerHeight = cui.layoutHeight;
            var containerWidth = cui.layoutWidth;
            cui.rCalWidth = cui.layoutWidth;
            cui.rCalHeight = cui.layoutHeight;
            if (cui.boxSideExtens) {
                if (isvertical) {
                    if (cui.width == RUIObject_6.RUIAuto) {
                        containerWidth = data.containerWidth;
                        cui.rCalWidth = containerWidth;
                    }
                }
                else {
                    if (cui.height == RUIObject_6.RUIAuto) {
                        containerHeight = data.containerHeight;
                        cui.rCalHeight = containerHeight;
                    }
                }
            }
            var offset = 0;
            children.forEach(function (c) {
                if (!c.isOnFlow)
                    return;
                var csize = 0;
                if (c.flex != null) {
                    csize = RUIObject_6.ROUND(c.flex * sizePerFlex);
                }
                else {
                    csize = isvertical ? c.layoutHeight : c.layoutWidth;
                }
                var cdata = new RUIObject_6.RUILayoutData();
                cdata.containerWidth = containerWidth;
                cdata.containerHeight = containerHeight;
                if (isvertical) {
                    cdata.flexWidth = null;
                    cdata.flexHeight = csize;
                }
                else {
                    cdata.flexHeight = null;
                    cdata.flexWidth = csize;
                }
                c.LayoutPost(cdata);
                if (isvertical) {
                    c.rOffx = 0;
                    c.rOffy = offset;
                    offset += c.rCalHeight;
                }
                else {
                    c.rOffx = offset;
                    c.rOffy = 0;
                    offset += c.rCalWidth;
                }
            });
            //Process relative
            cui.LayoutRelativeUI(cui, children);
        };
        RUIFlexLayouter.s_default = new RUIFlexLayouter();
        return RUIFlexLayouter;
    }());
    exports.RUIFlexLayouter = RUIFlexLayouter;
});
define("rui/widget/RUIButton", ["require", "exports", "rui/RUIObject", "rui/RUIStyle", "rui/RUIUtil"], function (require, exports, RUIObject_7, RUIStyle_2, RUIUtil_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIButton = /** @class */ (function (_super) {
        __extends(RUIButton, _super);
        function RUIButton(label, f) {
            var _this = _super.call(this) || this;
            _this.m_color = RUIStyle_2.RUIStyle.Default.background3;
            _this.m_onhover = false;
            _this.label = label;
            _this.clickFunction = f;
            _this.height = RUIUtil_7.RUIUtil.LINE_HEIGHT_DEFAULT;
            return _this;
        }
        RUIButton.prototype.onDraw = function (cmd) {
            var rect = this.calculateRect();
            this._rect = rect;
            var cliprect = RUIUtil_7.RUIUtil.RectClip(rect, this.clipMask);
            this._drawClipRect = cliprect;
            if (cliprect == null) {
                return;
            }
            cmd.DrawRectWithColor(rect, this.m_color, cliprect);
            cmd.DrawText(this.label, rect, null, cliprect);
        };
        RUIButton.prototype.onMouseEnter = function () {
            this.m_color = RUIStyle_2.RUIStyle.Default.primary;
            this.setDirty();
            this.m_onhover = true;
        };
        RUIButton.prototype.onMouseLeave = function () {
            this.m_color = RUIStyle_2.RUIStyle.Default.background3;
            this.setDirty();
            this.m_onhover = false;
        };
        RUIButton.prototype.onMouseClick = function (e) {
            var f = this.clickFunction;
            if (f != null)
                f(this);
        };
        RUIButton.prototype.onMouseDown = function () {
            this.m_color = RUIStyle_2.RUIStyle.Default.primary0;
            this.setDirty();
        };
        RUIButton.prototype.onMouseUp = function () {
            if (this.m_onhover) {
                this.m_color = RUIStyle_2.RUIStyle.Default.primary;
            }
            else {
                this.m_color = RUIStyle_2.RUIStyle.Default.background3;
            }
            this.setDirty();
        };
        return RUIButton;
    }(RUIObject_7.RUIObject));
    exports.RUIButton = RUIButton;
});
define("rui/widget/RUIButtonGroup", ["require", "exports", "rui/RUIContainer", "rui/RUIObject", "rui/RUIStyle"], function (require, exports, RUIContainer_4, RUIObject_8, RUIStyle_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIButtonGroup = /** @class */ (function (_super) {
        __extends(RUIButtonGroup, _super);
        function RUIButtonGroup(buttons, orientation) {
            var _this = _super.call(this) || this;
            _this.m_buttons = buttons;
            _this.boxBorder = RUIStyle_3.RUIStyle.Default.border0;
            _this.boxBackground = RUIStyle_3.RUIStyle.Default.background0;
            _this.boxOrientation = orientation;
            buttons.forEach(function (b) {
                _this.addChild(b);
            });
            return _this;
        }
        RUIButtonGroup.prototype.getButtonIndex = function (btn) {
            return this.m_buttons.indexOf(btn);
        };
        RUIButtonGroup.prototype.LayoutPost = function (data) {
            if (!this.isVertical) {
                var clen = this.m_buttons.length;
                if (clen == 0)
                    return;
                if (this.layoutWidth == RUIObject_8.RUIAuto) {
                    this.layoutWidth = data.containerWidth;
                }
                var csize_1 = this.layoutWidth / clen;
                this.m_buttons.forEach(function (b) {
                    b.layoutWidth = csize_1;
                });
            }
            _super.prototype.LayoutPost.call(this, data);
        };
        return RUIButtonGroup;
    }(RUIContainer_4.RUIContainer));
    exports.RUIButtonGroup = RUIButtonGroup;
});
define("rui/widget/RUILabel", ["require", "exports", "rui/RUIObject", "rui/RUIUtil", "rui/RUIFontTexture"], function (require, exports, RUIObject_9, RUIUtil_8, RUIFontTexture_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUILabel = /** @class */ (function (_super) {
        __extends(RUILabel, _super);
        function RUILabel(label) {
            var _this = _super.call(this) || this;
            _this.m_label = label;
            _this.width = 100;
            _this.height = RUIUtil_8.RUIUtil.LINE_HEIGHT_DEFAULT;
            _this.responseToMouseEvent = false;
            return _this;
        }
        Object.defineProperty(RUILabel.prototype, "label", {
            get: function () {
                return this.m_label;
            },
            set: function (l) {
                if (l === this.m_label)
                    return;
                this.m_label = l;
                this.setDirty();
            },
            enumerable: true,
            configurable: true
        });
        RUILabel.prototype.Layout = function () {
            _super.prototype.Layout.call(this);
            var ftw = RUIFontTexture_3.RUIFontTexture.ASIICTexture.MeasureTextWith(this.m_label) + 20;
            if (!Number.isNaN(ftw)) {
                this.width = ftw;
                this.layoutWidth = ftw;
            }
        };
        RUILabel.prototype.onDraw = function (cmd) {
            _super.prototype.onDraw.call(this, cmd);
            var label = this.m_label;
            if (label == null || label === '') {
                return;
            }
            var cliprect = this._drawClipRect;
            if (cliprect == null) {
                return;
            }
            cmd.DrawText(this.m_label, this._rect, null, cliprect);
        };
        return RUILabel;
    }(RUIObject_9.RUIObject));
    exports.RUILabel = RUILabel;
});
define("rui/widget/RUICanvas", ["require", "exports", "rui/RUIContainer", "rui/RUIObject", "rui/RUIUtil", "rui/RUIStyle", "rui/RUIEvent", "rui/widget/RUILabel"], function (require, exports, RUIContainer_5, RUIObject_10, RUIUtil_9, RUIStyle_4, RUIEvent_6, RUILabel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // import { RUIObject, RUIPosition } from "../RUIObject";
    // import { RUIRoot } from "../RUIRoot";
    // import { RUIContainer } from "../RUIContainer";
    // import { RUICmdList } from "../RUICmdList";
    // import { RUIRectangle } from "../RUIRectangle";
    // import { RUIMouseDragEvent, RUIMouseDragStage } from "../RUIEvent";
    // export class RUICanvas extends RUIObject {
    //     private m_canvasRoot: RUIRoot;
    //     private m_canvasContianer: RUIContainer;
    //     private m_layouter: RUILayout;
    //     private m_rect1: RUIObject;
    //     private m_canvasOriginX: number = 0;
    //     private m_canvasOriginY: number = 0;
    //     public constructor() {
    //         super();
    //         this.init();
    //     }
    //     private init() {
    //         this.m_layouter = new RUILayout();
    //         this.height = 300;
    //         let container = new RUIContainer();
    //         let rect1 = new RUIRectangle();
    //         rect1.width = 20;
    //         rect1.height = 20;
    //         rect1.position = RUIPosition.Offset;
    //         this.m_rect1 = rect1;
    //         container.addChild(rect1);
    //         let canvasroot = new RUIRoot(container, true);
    //         this.m_canvasContianer = container;
    //         this.m_canvasRoot = canvasroot;
    //     }
    //     private m_dragStartX: number;
    //     private m_dragStartY: number;
    //     public onMouseDrag(e: RUIMouseDragEvent) {
    //         if (e.stage == RUIMouseDragStage.Begin) {
    //             this.m_dragStartX = e.mousex;
    //             this.m_dragStartY = e.mousey;
    //         }
    //         else if (e.stage == RUIMouseDragStage.Update) {
    //             let offx = e.mousex - this.m_dragStartX;
    //             let offy = e.mousey - this.m_dragStartY;
    //             this.m_rect1.left = this.m_canvasOriginX + offx;
    //             this.m_rect1.top = this.m_canvasOriginY + offy;
    //             this.setDirty();
    //             this.m_rect1.setDirty();
    //         }
    //         else {
    //             this.m_canvasOriginX += (e.mousex - this.m_dragStartX);
    //             this.m_canvasOriginY += (e.mousey - this.m_dragStartY);
    //         }
    //     }
    //     public onLayoutPost() {
    //         //sync uiobject
    //         let container = this.m_canvasContianer;
    //         container._calx = this._calx;
    //         container._caly = this._caly;
    //         this.m_canvasRoot.resizeRoot(this._calwidth, this._calheight);
    //         this.m_layouter.build(this.m_canvasRoot);
    //     }
    //     public onDraw(cmd: RUICmdList) {
    //         this.m_canvasContianer.onDraw(cmd);
    //     }
    // }
    var RUICanvas = /** @class */ (function (_super) {
        __extends(RUICanvas, _super);
        function RUICanvas() {
            var _this = _super.call(this) || this;
            _this.boxBackground = RUIStyle_4.RUIStyle.Default.background3;
            return _this;
        }
        return RUICanvas;
    }(RUIContainer_5.RUIContainer));
    exports.RUICanvas = RUICanvas;
    var RUICanvasNode = /** @class */ (function (_super) {
        __extends(RUICanvasNode, _super);
        function RUICanvasNode() {
            var _this = _super.call(this) || this;
            _this.m_draggable = true;
            _this.position = RUIObject_10.RUIPosition.Relative;
            _this.left = 0;
            _this.top = 0;
            return _this;
        }
        RUICanvasNode.prototype.onMouseDrag = function (e) {
            if (!this.m_draggable)
                return;
            if (e.stage == RUIEvent_6.RUIMouseDragStage.Begin) {
                this.m_dragStartPosX = this.left - e.mousex;
                this.m_dragStartPosY = this.top - e.mousey;
            }
            else {
                this.left = this.m_dragStartPosX + e.mousex;
                this.top = this.m_dragStartPosY + e.mousey;
                this.setDirty();
            }
        };
        return RUICanvasNode;
    }(RUIContainer_5.RUIContainer));
    exports.RUICanvasNode = RUICanvasNode;
    var RUICanvasContainerNode = /** @class */ (function (_super) {
        __extends(RUICanvasContainerNode, _super);
        function RUICanvasContainerNode(title) {
            var _this = _super.call(this) || this;
            _this.m_onactive = false;
            _this.padding = RUIUtil_9.RUIUtil.Vector(3);
            _this.boxBorder = RUIStyle_4.RUIStyle.Default.border0;
            _this.boxBackground = RUIStyle_4.RUIStyle.Default.background1;
            _this.addChild(new RUILabel_1.RUILabel(title));
            return _this;
        }
        RUICanvasContainerNode.prototype.onActive = function () {
            this.m_onactive = true;
        };
        RUICanvasContainerNode.prototype.onInactive = function () {
            this.m_onactive = false;
        };
        return RUICanvasContainerNode;
    }(RUICanvasNode));
    exports.RUICanvasContainerNode = RUICanvasContainerNode;
});
define("rui/widget/RUICheckBox", ["require", "exports", "rui/RUIObject", "rui/RUIUtil", "rui/RUIStyle", "rui/RUIContainer", "rui/RUIEvent"], function (require, exports, RUIObject_11, RUIUtil_10, RUIStyle_5, RUIContainer_6, RUIEvent_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CHECKBOX_SIZE = 15;
    var CHECKBOX_SIZE2X = CHECKBOX_SIZE * 2;
    var RUICheckBoxInner = /** @class */ (function (_super) {
        __extends(RUICheckBoxInner, _super);
        function RUICheckBoxInner(checked) {
            var _this = _super.call(this) || this;
            _this.EventOnClick = new RUIEvent_7.RUIEventEmitter();
            _this.width = CHECKBOX_SIZE;
            _this.height = CHECKBOX_SIZE;
            _this.m_checked = checked;
            return _this;
        }
        Object.defineProperty(RUICheckBoxInner.prototype, "checked", {
            get: function () { return this.m_checked; },
            set: function (c) {
                if (c == this.m_checked)
                    return;
                this.m_checked = c;
                this.setDirty();
            },
            enumerable: true,
            configurable: true
        });
        RUICheckBoxInner.prototype.onMouseClick = function () {
            var checked = !this.checked;
            this.checked = checked;
            this
                .EventOnClick
                .emitRaw(checked);
        };
        RUICheckBoxInner.prototype.onDraw = function (cmd) {
            _super.prototype.onDraw.call(this, cmd);
            var cliprect = this._drawClipRect;
            if (cliprect == null) {
                return;
            }
            var rect = this._rect;
            cmd.DrawBorder(rect, RUIStyle_5.RUIStyle.Default.primary0, cliprect);
            if (this.m_checked) {
                var crect = RUIUtil_10.RUIUtil.RectIndent(rect, 2);
                cmd.DrawRectWithColor(crect, RUIStyle_5.RUIStyle.Default.primary, cliprect);
            }
        };
        return RUICheckBoxInner;
    }(RUIObject_11.RUIObject));
    var RUICheckBox = /** @class */ (function (_super) {
        __extends(RUICheckBox, _super);
        function RUICheckBox(checked, align) {
            if (align === void 0) { align = RUIUtil_10.RUIUtil.ALIGN_CENTER; }
            var _this = _super.call(this) || this;
            _this.m_align = RUIUtil_10.RUIUtil.ALIGN_CENTER;
            _this.height = RUIUtil_10.RUIUtil.LINE_HEIGHT_DEFAULT;
            var inner = new RUICheckBoxInner(checked);
            inner.position = RUIObject_11.RUIPosition.Relative;
            _this.m_inner = inner;
            _this.addChild(inner);
            _this.updateAlign(align);
            return _this;
        }
        Object.defineProperty(RUICheckBox.prototype, "EventOnClick", {
            get: function () {
                return this.m_inner.EventOnClick;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUICheckBox.prototype, "isChecked", {
            get: function () { return this.m_inner.checked; },
            set: function (c) {
                this.m_inner.checked = c;
            },
            enumerable: true,
            configurable: true
        });
        RUICheckBox.prototype.updateAlign = function (align) {
            if (align == this.m_align)
                return;
            this.m_align = align;
            var inner = this.m_inner;
            if (align == RUIUtil_10.RUIUtil.ALIGN_CENTER) {
                inner.left = RUIObject_11.RUIAuto;
                inner.right = RUIObject_11.RUIAuto;
            }
            else if (align = RUIUtil_10.RUIUtil.ALIGN_LEFT) {
                inner.right = RUIObject_11.RUIAuto;
                inner.left = CHECKBOX_SIZE;
            }
            else {
                inner.right = CHECKBOX_SIZE;
                inner.left = RUIObject_11.RUIAuto;
            }
            this.setDirty();
        };
        return RUICheckBox;
    }(RUIContainer_6.RUIContainer));
    exports.RUICheckBox = RUICheckBox;
});
define("rui/widget/RUICollapsibleContainer", ["require", "exports", "rui/RUIContainer", "rui/widget/RUIButton", "rui/RUIObject", "rui/RUIStyle"], function (require, exports, RUIContainer_7, RUIButton_1, RUIObject_12, RUIStyle_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUICollapsibleContainer = /** @class */ (function (_super) {
        __extends(RUICollapsibleContainer, _super);
        function RUICollapsibleContainer(label, show, orientation) {
            if (orientation === void 0) { orientation = RUIObject_12.RUIOrientation.Vertical; }
            var _this = _super.call(this) || this;
            _this.m_show = show;
            _this.boxBorder = RUIStyle_6.RUIStyle.Default.border0;
            _this.boxBackground = RUIStyle_6.RUIStyle.Default.background1;
            _this.boxOrientation = orientation;
            var button = new RUIButton_1.RUIButton(label, _this.onButtonClick.bind(_this));
            button.margin = [1, 0, 1, 0];
            _super.prototype.addChild.call(_this, button);
            var container = new RUIContainer_7.RUIContainer();
            container.boxSideExtens = true;
            _this.m_container = container;
            if (_this.m_show)
                _super.prototype.addChild.call(_this, container);
            return _this;
        }
        RUICollapsibleContainer.prototype.onButtonClick = function (b) {
            if (this.m_show) {
                _super.prototype.removeChild.call(this, this.m_container);
                this.m_show = false;
            }
            else {
                _super.prototype.addChild.call(this, this.m_container);
                this.m_show = true;
            }
        };
        RUICollapsibleContainer.prototype.addChild = function (ui) {
            this.m_container.addChild(ui);
        };
        RUICollapsibleContainer.prototype.removeChild = function (ui) {
            this.m_container.removeChild(ui);
        };
        return RUICollapsibleContainer;
    }(RUIContainer_7.RUIContainer));
    exports.RUICollapsibleContainer = RUICollapsibleContainer;
});
define("rui/widget/RUITextInput", ["require", "exports", "rui/RUIObject", "rui/RUIStyle", "rui/RUIEvent", "rui/RUIInput", "rui/RUIUtil", "rui/RUIColor"], function (require, exports, RUIObject_13, RUIStyle_7, RUIEvent_8, RUIInput_2, RUIUtil_11, RUIColor_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUITextInputFormat = /** @class */ (function () {
        function RUITextInputFormat(r) {
            this.m_regexp = r;
        }
        RUITextInputFormat.prototype.verify = function (text) {
            if (this.m_regexp == null)
                return true;
            return this.m_regexp.test(text);
        };
        RUITextInputFormat.NUMBER = new RUITextInputFormat(/^[\d]+[.[\d]+]*$/);
        RUITextInputFormat.DEFAULT = new RUITextInputFormat(null);
        RUITextInputFormat.EMAIL = new RUITextInputFormat(/\S+@\S+\.\S+/);
        return RUITextInputFormat;
    }());
    exports.RUITextInputFormat = RUITextInputFormat;
    var RUITextInput = /** @class */ (function (_super) {
        __extends(RUITextInput, _super);
        function RUITextInput(content, format) {
            if (format === void 0) { format = RUITextInputFormat.DEFAULT; }
            var _this = _super.call(this) || this;
            _this.m_isError = false;
            _this.m_onActive = false;
            _this.EventOnTextChange = new RUIEvent_8.RUIEventEmitter();
            _this.m_content = content;
            _this.inputFormat = format;
            _this.height = RUIUtil_11.RUIUtil.LINE_HEIGHT_DEFAULT;
            _this.width = 200;
            _this.m_isError = !format.verify(_this.m_content);
            return _this;
        }
        Object.defineProperty(RUITextInput.prototype, "content", {
            get: function () {
                return this.m_content;
            },
            set: function (content) {
                var curcontent = this.m_content;
                if (content === curcontent)
                    return;
                this.m_content = content;
                this.setDirty();
            },
            enumerable: true,
            configurable: true
        });
        RUITextInput.prototype.onActive = function () {
            this.m_onActive = true;
            this.setDirty();
        };
        RUITextInput.prototype.onInactive = function () {
            this.m_onActive = false;
            this.setDirty();
        };
        RUITextInput.prototype.onDraw = function (cmd) {
            _super.prototype.onDraw.call(this, cmd);
            var cliprect = this._drawClipRect;
            if (cliprect == null)
                return;
            cmd.DrawText(this.m_content, this._rect, null, cliprect);
            var color = RUIStyle_7.RUIStyle.Default.primary0;
            if (this.m_isError) {
                color = RUIColor_3.RUIColor.RED;
            }
            else if (this.m_onActive) {
                color = RUIStyle_7.RUIStyle.Default.primary;
            }
            cmd.DrawBorder(this._rect, color, cliprect);
        };
        RUITextInput.prototype.onKeyPress = function (e) {
            var newcontent = RUIInput_2.RUIInput.ProcessTextKeyDown(this.m_content, e);
            if (newcontent === this.m_content) {
                return;
            }
            this.m_content = newcontent;
            this.m_isError = !this.inputFormat.verify(this.m_content);
            this.setDirty();
            this.EventOnTextChange.emitRaw(newcontent);
        };
        return RUITextInput;
    }(RUIObject_13.RUIObject));
    exports.RUITextInput = RUITextInput;
});
define("rui/widget/RUISlider", ["require", "exports", "rui/RUIObject", "rui/RUIStyle", "rui/RUIUtil", "rui/RUIEvent"], function (require, exports, RUIObject_14, RUIStyle_8, RUIUtil_12, RUIEvent_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUISlider = /** @class */ (function (_super) {
        __extends(RUISlider, _super);
        function RUISlider(val, height) {
            if (height === void 0) { height = RUISlider.SLIDER_HEIGHT; }
            var _this = _super.call(this) || this;
            _this.m_value = 0;
            _this.EventOnValue = new RUIEvent_9.RUIEventEmitter();
            _this.value = val;
            _this.height = height;
            return _this;
        }
        Object.defineProperty(RUISlider.prototype, "value", {
            get: function () {
                return this.m_value;
            },
            set: function (val) {
                if (val === NaN)
                    return;
                val = RUIUtil_12.SATURATE(val);
                if (this.m_value == val)
                    return;
                this.m_value = val;
                this.setDirty();
                this.EventOnValue.emitRaw(val);
            },
            enumerable: true,
            configurable: true
        });
        RUISlider.prototype.setValue = function (val) {
            if (val === NaN)
                return;
            val = RUIUtil_12.SATURATE(val);
            if (this.m_value == val)
                return;
            this.m_value = val;
            this.setDirty();
        };
        RUISlider.prototype.onMouseDown = function (e) {
            e.Use();
            var val = (e.mousex - this.rCalx) / this.rCalWidth;
            if (val === NaN)
                return;
            this.value = val;
        };
        RUISlider.prototype.onMouseDrag = function (e) {
            e.Use();
            var stage = e.stage;
            if (stage == RUIEvent_9.RUIMouseDragStage.Update) {
                var val = (e.mousex - this.rCalx) / this.rCalWidth;
                if (val === NaN)
                    return;
                this.value = val;
            }
        };
        RUISlider.prototype.onDraw = function (cmd) {
            _super.prototype.onDraw.call(this, cmd);
            var cliprect = this._drawClipRect;
            if (cliprect == null)
                return;
            var rect = this._rect;
            var val = this.m_value;
            if (val != 0) {
                var vrect = rect.slice(0);
                vrect[2] *= val;
                cmd.DrawRectWithColor(vrect, RUIStyle_8.RUIStyle.Default.primary0, cliprect);
            }
            cmd.DrawRectWithColor(rect, RUIStyle_8.RUIStyle.Default.background0, cliprect);
        };
        RUISlider.SLIDER_HEIGHT = 10;
        return RUISlider;
    }(RUIObject_14.RUIObject));
    exports.RUISlider = RUISlider;
});
define("rui/widget/RUISliderInput", ["require", "exports", "rui/RUIFlexContainer", "rui/RUIUtil", "rui/widget/RUISlider", "rui/widget/RUITextInput", "rui/RUIObject"], function (require, exports, RUIFlexContainer_1, RUIUtil_13, RUISlider_1, RUITextInput_1, RUIObject_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUISliderInput = /** @class */ (function (_super) {
        __extends(RUISliderInput, _super);
        function RUISliderInput(val, min, max, isInteger) {
            if (min === void 0) { min = 0; }
            if (max === void 0) { max = 1.0; }
            if (isInteger === void 0) { isInteger = false; }
            var _this = _super.call(this) || this;
            _this.m_isinteger = false;
            _this.height = RUIUtil_13.RUIUtil.LINE_HEIGHT_DEFAULT;
            _this.boxOrientation = RUIObject_15.RUIOrientation.Horizontal;
            _this.m_isinteger = isInteger;
            _this.m_min = min;
            _this.m_max = max;
            var slider = new RUISlider_1.RUISlider(val, RUIUtil_13.RUIUtil.LINE_HEIGHT_DEFAULT);
            slider.EventOnValue.on(_this.onValue.bind(_this));
            slider.flex = 1;
            _this.addChild(slider);
            _this.m_slider = slider;
            var input = new RUITextInput_1.RUITextInput(val.toString(), RUITextInput_1.RUITextInputFormat.NUMBER);
            input.width = 60;
            input.EventOnTextChange.on(_this.onInputChange.bind(_this));
            _this.addChild(input);
            _this.m_input = input;
            return _this;
        }
        Object.defineProperty(RUISliderInput.prototype, "value", {
            get: function () {
                return Number(this.m_input.content);
            },
            enumerable: true,
            configurable: true
        });
        RUISliderInput.prototype.onInputChange = function (e) {
            var text = e.object;
            var val = Number(text);
            if (val === NaN)
                return;
            var min = this.m_min;
            val = (val - min) / (this.m_max - min);
            this.m_slider.setValue(val);
        };
        RUISliderInput.prototype.onValue = function (e) {
            var val = e.object;
            var min = this.m_min;
            var fval = val * (this.m_max - min) + min;
            var str = null;
            if (this.m_isinteger) {
                str = Math.round(fval).toFixed(0);
            }
            else {
                str = fval.toString();
            }
            if (str === 'NaN')
                return;
            this.m_input.content = str;
        };
        return RUISliderInput;
    }(RUIFlexContainer_1.RUIFlexContainer));
    exports.RUISliderInput = RUISliderInput;
});
define("rui/widget/RUIField", ["require", "exports", "rui/RUIObject", "rui/RUIFlexContainer", "rui/widget/RUILabel", "rui/widget/RUITextInput", "rui/widget/RUICheckBox", "rui/RUIUtil", "rui/widget/RUISliderInput"], function (require, exports, RUIObject_16, RUIFlexContainer_2, RUILabel_2, RUITextInput_2, RUICheckBox_1, RUIUtil_14, RUISliderInput_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FIELD_LABEL_WIDTH = 100;
    var RUIField = /** @class */ (function (_super) {
        __extends(RUIField, _super);
        function RUIField(label, t) {
            var _this = _super.call(this) || this;
            _this.boxOrientation = RUIObject_16.RUIOrientation.Horizontal;
            _this.margin = [1, 0, 1, 0];
            var clabel = new RUILabel_2.RUILabel(label);
            clabel.width = FIELD_LABEL_WIDTH;
            _this.m_label = clabel;
            _this.addChild(clabel);
            var cwidget = t;
            cwidget.flex = 1;
            _this.m_widget = cwidget;
            _this.addChild(cwidget);
            return _this;
        }
        return RUIField;
    }(RUIFlexContainer_2.RUIFlexContainer));
    exports.RUIField = RUIField;
    var RUITextField = /** @class */ (function (_super) {
        __extends(RUITextField, _super);
        function RUITextField(label, content, format) {
            if (format === void 0) { format = RUITextInput_2.RUITextInputFormat.DEFAULT; }
            var _this = this;
            var textinput = new RUITextInput_2.RUITextInput(content, format);
            _this = _super.call(this, label, textinput) || this;
            return _this;
        }
        Object.defineProperty(RUITextField.prototype, "label", {
            get: function () {
                return this.m_label.label;
            },
            set: function (l) {
                this.m_label.label = l;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUITextField.prototype, "content", {
            get: function () {
                return this.m_widget.content;
            },
            set: function (content) {
                this.m_widget.content = content;
            },
            enumerable: true,
            configurable: true
        });
        return RUITextField;
    }(RUIField));
    exports.RUITextField = RUITextField;
    var RUICheckBoxField = /** @class */ (function (_super) {
        __extends(RUICheckBoxField, _super);
        function RUICheckBoxField(label, checked, align) {
            if (align === void 0) { align = RUIUtil_14.RUIUtil.ALIGN_LEFT; }
            var _this = this;
            var checkbox = new RUICheckBox_1.RUICheckBox(checked, align);
            _this = _super.call(this, label, checkbox) || this;
            return _this;
        }
        Object.defineProperty(RUICheckBoxField.prototype, "isChecked", {
            get: function () { return this.m_widget.isChecked; },
            set: function (c) { this.m_widget.isChecked = c; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUICheckBoxField.prototype, "EventOnClick", {
            get: function () {
                return this.m_widget.EventOnClick;
            },
            enumerable: true,
            configurable: true
        });
        return RUICheckBoxField;
    }(RUIField));
    exports.RUICheckBoxField = RUICheckBoxField;
    var RUIIntegerField = /** @class */ (function (_super) {
        __extends(RUIIntegerField, _super);
        function RUIIntegerField(label, value, min, max) {
            if (min === void 0) { min = 0; }
            if (max === void 0) { max = 100; }
            var _this = this;
            var sliderinput = new RUISliderInput_1.RUISliderInput(value, min, max, true);
            _this = _super.call(this, label, sliderinput) || this;
            return _this;
        }
        return RUIIntegerField;
    }(RUIField));
    exports.RUIIntegerField = RUIIntegerField;
    var RUIFloatField = /** @class */ (function (_super) {
        __extends(RUIFloatField, _super);
        function RUIFloatField(label, value, min, max) {
            if (min === void 0) { min = 0; }
            if (max === void 0) { max = 1.0; }
            var _this = this;
            var sliderinput = new RUISliderInput_1.RUISliderInput(value, min, max, false);
            _this = _super.call(this, label, sliderinput) || this;
            return _this;
        }
        return RUIFloatField;
    }(RUIField));
    exports.RUIFloatField = RUIFloatField;
});
define("rui/widget/RUIOverlay", ["require", "exports", "rui/RUIContainer", "rui/RUIObject", "rui/RUIColor"], function (require, exports, RUIContainer_8, RUIObject_17, RUIColor_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIOverlay = /** @class */ (function (_super) {
        __extends(RUIOverlay, _super);
        function RUIOverlay() {
            var _this = _super.call(this) || this;
            _this.position = RUIObject_17.RUIPosition.Relative;
            _this.boxBackground = RUIColor_4.RUIColor.RED;
            _this.width = 100;
            _this.height = 100;
            _this.boxClip = RUIContainer_8.RUIContainerClipType.ClipSelf;
            return _this;
        }
        return RUIOverlay;
    }(RUIContainer_8.RUIContainer));
    exports.RUIOverlay = RUIOverlay;
});
define("rui/widget/RUIScrollBar", ["require", "exports", "rui/RUIObject", "rui/RUIContainer", "rui/RUIStyle", "rui/RUIRectangle", "rui/RUIEvent", "rui/RUIUtil"], function (require, exports, RUIObject_18, RUIContainer_9, RUIStyle_9, RUIRectangle_1, RUIEvent_10, RUIUtil_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIScrollBarThumb = /** @class */ (function (_super) {
        __extends(RUIScrollBarThumb, _super);
        function RUIScrollBarThumb(scrollbar) {
            var _this = _super.call(this) || this;
            _this.m_hoverColor = RUIStyle_9.RUIStyle.Default.primary0;
            _this.m_defaultColor = RUIStyle_9.RUIStyle.Default.background3;
            _this.m_onDrag = false;
            _this.m_onHover = false;
            _this.m_scrollbar = scrollbar;
            _this.m_debugColor = _this.m_defaultColor;
            _this.position = RUIObject_18.RUIPosition.Offset;
            _this.responseToMouseEvent = true;
            _this.left = 0;
            _this.top = 0;
            _this.width = 10;
            _this.height = 10;
            return _this;
        }
        RUIScrollBarThumb.prototype.onMouseEnter = function () {
            this.m_onHover = true;
            this.setDirty();
        };
        RUIScrollBarThumb.prototype.onMouseLeave = function () {
            this.m_onHover = false;
            this.setDirty();
        };
        RUIScrollBarThumb.prototype.Layout = function () {
            _super.prototype.Layout.call(this);
            if (this.m_onHover || this.m_onDrag) {
                this.m_debugColor = this.m_hoverColor;
            }
            else {
                this.m_debugColor = this.m_defaultColor;
            }
        };
        RUIScrollBarThumb.prototype.onDraw = function (cmd) {
            _super.prototype.onDraw.call(this, cmd);
        };
        RUIScrollBarThumb.prototype.onMouseDrag = function (e) {
            var isvertical = this.m_scrollbar.isVerticalScroll;
            if (e.stage == RUIEvent_10.RUIMouseDragStage.Begin) {
                this.m_dragStartOffset = (isvertical ? e.mousey - this.top : e.mousex - this.left);
                this.m_onDrag = true;
            }
            else if (e.stage == RUIEvent_10.RUIMouseDragStage.Update) {
                var pos = (isvertical ? e.mousey : e.mousex) - this.m_dragStartOffset;
                var bar = this.m_scrollbar;
                var off = isvertical ? this.top : this.left;
                if (pos == off)
                    return;
                bar.onThumbDrag(pos);
                this.m_onDrag = true;
            }
            else {
                this.m_onDrag = false;
            }
            e.Use();
        };
        return RUIScrollBarThumb;
    }(RUIRectangle_1.RUIRectangle));
    exports.RUIScrollBarThumb = RUIScrollBarThumb;
    var RUIScrollBar = /** @class */ (function (_super) {
        __extends(RUIScrollBar, _super);
        function RUIScrollBar(orientation) {
            if (orientation === void 0) { orientation = RUIObject_18.RUIOrientation.Horizontal; }
            var _this = _super.call(this) || this;
            _this.m_scrollPosVal = 0;
            _this.m_sizeVal = 0;
            _this.EventOnScroll = new RUIEvent_10.RUIEventEmitter();
            var thumb = new RUIScrollBarThumb(_this);
            _this.addChild(thumb);
            _this.m_thumb = thumb;
            _this.m_scrollOrientation = orientation;
            _this.boxOrientation = _this.isVerticalScroll ? RUIObject_18.RUIOrientation.Horizontal : RUIObject_18.RUIOrientation.Vertical;
            _this.boxBackground = RUIStyle_9.RUIStyle.Default.background0;
            _this.boxSideExtens = true;
            if (orientation == RUIObject_18.RUIOrientation.Horizontal) {
                thumb.height = 10;
            }
            else {
                thumb.width = 10;
            }
            return _this;
        }
        Object.defineProperty(RUIScrollBar.prototype, "isVerticalScroll", {
            get: function () {
                return this.m_scrollOrientation == RUIObject_18.RUIOrientation.Vertical;
            },
            enumerable: true,
            configurable: true
        });
        RUIScrollBar.prototype.Layout = function () {
            _super.prototype.Layout.call(this);
            if (this.isVerticalScroll) {
                this.layoutWidth = 10;
            }
            else {
                this.layoutHeight = 10;
            }
        };
        RUIScrollBar.prototype.LayoutPost = function (data) {
            _super.prototype.LayoutPost.call(this, data);
            var size = this.isVerticalScroll ? this.rCalHeight : this.rCalWidth;
            this.m_size = size;
            //set thumb size
            var thumbsize = this.m_sizeVal * size;
            var thumb = this.m_thumb;
            if (this.isVerticalScroll) {
                thumb.rCalWidth = this.rCalWidth;
                thumb.rCalHeight = thumbsize;
                thumb.rOffx = 0;
                thumb.rOffy = this.m_scrollPosVal * size;
                thumb.left = 0;
                thumb.top = thumb.rOffy;
            }
            else {
                thumb.rCalWidth = thumbsize;
                thumb.rCalHeight = this.rCalHeight;
                thumb.rOffx = this.m_scrollPosVal * size;
                thumb.rOffy = 0;
                thumb.top = 0;
                thumb.left = thumb.rOffx;
            }
            thumb.width = thumb.rCalWidth;
            thumb.height = thumb.rCalHeight;
        };
        Object.defineProperty(RUIScrollBar.prototype, "scrollPosVal", {
            get: function () {
                return this.m_scrollPosVal;
            },
            set: function (val) {
                if (val === NaN)
                    return;
                val = RUIObject_18.CLAMP(val, 0, 1.0 - this.m_sizeVal);
                if (val == this.m_scrollPosVal)
                    return;
                this.m_scrollPosVal = val;
                this.setDirty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUIScrollBar.prototype, "sizeVal", {
            get: function () {
                return this.m_sizeVal;
            },
            set: function (val) {
                if (val === NaN)
                    return;
                val = RUIUtil_15.SATURATE(val);
                if (val == this.sizeVal)
                    return;
                this.m_sizeVal = val;
                this.setDirty();
            },
            enumerable: true,
            configurable: true
        });
        RUIScrollBar.prototype.onThumbDrag = function (pos) {
            var val = pos / this.m_size;
            var prev = this.scrollPosVal;
            this.scrollPosVal = val;
            val = this.scrollPosVal;
            if (prev != val) {
                this.EventOnScroll.emitRaw(val);
            }
        };
        Object.defineProperty(RUIScrollBar.prototype, "scrollOrientation", {
            get: function () {
                return this.m_scrollOrientation;
            },
            set: function (orientation) {
                if (this.m_scrollOrientation == orientation) {
                    return;
                }
                this.m_scrollOrientation = orientation;
                this.setDirty(true);
            },
            enumerable: true,
            configurable: true
        });
        return RUIScrollBar;
    }(RUIContainer_9.RUIContainer));
    exports.RUIScrollBar = RUIScrollBar;
});
define("rui/widget/RUIScrollView", ["require", "exports", "rui/RUIContainer", "rui/widget/RUIScrollBar", "rui/RUIObject", "rui/RUIStyle", "rui/RUIUtil"], function (require, exports, RUIContainer_10, RUIScrollBar_1, RUIObject_19, RUIStyle_10, RUIUtil_16) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIScrollView = /** @class */ (function (_super) {
        __extends(RUIScrollView, _super);
        function RUIScrollView() {
            var _this = _super.call(this) || this;
            _this.scrollVertical = true;
            _this.scrollHorizontal = true;
            _this.m_scrollbarVShow = false;
            _this.m_scrollbarHShow = false;
            _this.m_overflowH = false;
            _this.m_overflowV = false;
            _this.m_contentH = 0;
            _this.m_contentV = 0;
            _this.m_viewH = 0;
            _this.m_viewV = 0;
            _this.boxOrientation = RUIObject_19.RUIOrientation.Vertical;
            _this.boxSideExtens = true;
            _this.boxMatchWidth = true;
            _this.boxMatchHeight = true;
            var contentWrap = new RUIContainer_10.RUIContainer();
            contentWrap.boxBackground = RUIStyle_10.RUIStyle.Default.background1;
            contentWrap.boxSideExtens = true;
            contentWrap.position = RUIObject_19.RUIPosition.Offset;
            contentWrap.left = 0;
            contentWrap.top = 0;
            _this.m_contentWrap = contentWrap;
            _super.prototype.addChild.call(_this, contentWrap);
            var scrollbar = new RUIScrollBar_1.RUIScrollBar(RUIObject_19.RUIOrientation.Vertical);
            scrollbar.sizeVal = 0.5;
            scrollbar.position = RUIObject_19.RUIPosition.Relative;
            scrollbar.right = 0;
            scrollbar.top = 0;
            scrollbar.bottom = 0;
            scrollbar
                .EventOnScroll
                .on(_this.onScrollVertical.bind(_this));
            _this.m_sliderVertical = scrollbar;
            var scrollbarh = new RUIScrollBar_1.RUIScrollBar(RUIObject_19.RUIOrientation.Horizontal);
            scrollbarh.position = RUIObject_19.RUIPosition.Relative;
            scrollbarh.sizeVal = 0.5;
            scrollbarh.left = 0;
            scrollbarh.right = 10;
            scrollbarh.bottom = 0;
            scrollbarh.height = 10;
            scrollbarh
                .EventOnScroll
                .on(_this.onScrollHorizontal.bind(_this));
            _this.m_sliderHorizontal = scrollbarh;
            return _this;
        }
        RUIScrollView.prototype.onScrollHorizontal = function (e) {
            var val = -e.object * this.m_contentH;
            this.setScrollH(val);
        };
        RUIScrollView.prototype.onScrollVertical = function (e) {
            var val = -e.object * this.m_contentV;
            this.setScrollV(val);
        };
        RUIScrollView.prototype.setScrollV = function (pos) {
            pos = RUIUtil_16.CLAMP(pos, this.m_viewV - this.m_contentV, 0);
            var wrap = this.m_contentWrap;
            if (wrap.top == pos)
                return;
            wrap.top = pos;
        };
        RUIScrollView.prototype.setScrollH = function (pos) {
            pos = RUIUtil_16.CLAMP(pos, this.m_viewH - this.m_contentH, 0);
            var wrap = this.m_contentWrap;
            if (wrap.left == pos)
                return;
            wrap.left = pos;
        };
        RUIScrollView.prototype.Layout = function () {
            _super.prototype.Layout.call(this);
        };
        RUIScrollView.prototype.LayoutPost = function (data) {
            _super.prototype.LayoutPost.call(this, data);
            var contentH = this.m_contentWrap.rCalWidth;
            var contentV = this.m_contentWrap.rCalHeight;
            this.m_contentH = contentH;
            this.m_contentV = contentV;
            {
                var viewH = this.rCalWidth - this.padding[RUIObject_19.RUIConst.RIGHT];
                this.m_viewH = viewH;
                var overflowH = viewH < contentH;
                this.m_overflowH = overflowH;
                this.scrollBarShowH(overflowH);
                if (overflowH) {
                    this.m_sliderHorizontal.sizeVal = viewH / contentH;
                }
                else {
                    this.m_contentWrap.left = 0;
                }
            }
            {
                var viewV = this.rCalHeight - this.padding[RUIObject_19.RUIConst.BOTTOM];
                this.m_viewV = viewV;
                var overflowV = viewV < contentV;
                this.m_overflowV = overflowV;
                this.scrollBarShowV(overflowV);
                if (overflowV) {
                    this.m_sliderVertical.sizeVal = viewV / contentV;
                }
                else {
                    this.m_contentWrap.top = 0;
                }
            }
        };
        RUIScrollView.prototype.onMouseWheel = function (e) {
            var size = e.delta / 2;
            if (this.m_overflowV) {
                var scrollbarV = this.m_sliderVertical;
                var contentV = this.m_contentV;
                scrollbarV.scrollPosVal += (size / contentV);
                this.setScrollV(scrollbarV.scrollPosVal * -contentV);
            }
            else if (this.m_overflowH) {
                var scrollbarH = this.m_sliderHorizontal;
                var contentH = this.m_contentH;
                scrollbarH.scrollPosVal += (size / this.m_contentV);
                this.setScrollH(scrollbarH.scrollPosVal * -contentH);
            }
            else {
                return;
            }
            e.Use();
            e.prevent();
        };
        RUIScrollView.prototype.addChild = function (ui) {
            this.m_contentWrap.addChild(ui);
        };
        RUIScrollView.prototype.removeChild = function (ui) {
            this.m_contentWrap.removeChild(ui);
        };
        RUIScrollView.prototype.removeChildByIndex = function (index) {
            return this
                .m_contentWrap
                .removeChildByIndex(index);
        };
        RUIScrollView.prototype.scrollBarShowV = function (show) {
            if (show == this.m_scrollbarVShow)
                return;
            this.m_scrollbarVShow = show;
            if (show) {
                _super.prototype.addChild.call(this, this.m_sliderVertical);
                if (this.m_scrollbarHShow) {
                    this.padding = [0, 10, 10, 0];
                    this.m_sliderHorizontal.right = 10;
                }
                else {
                    this.padding = [0, 10, 0, 0];
                }
            }
            else {
                _super.prototype.removeChild.call(this, this.m_sliderVertical);
                if (this.m_scrollbarHShow) {
                    this.padding = [0, 0, 10, 0];
                    this.m_sliderHorizontal.right = 0;
                }
                else {
                    this.padding = [0, 0, 0, 0];
                }
            }
            this.setDirty(true);
        };
        RUIScrollView.prototype.scrollBarShowH = function (show) {
            if (show == this.m_scrollbarHShow)
                return;
            this.m_scrollbarHShow = show;
            var vshow = this.m_scrollbarVShow;
            if (show) {
                _super.prototype.addChild.call(this, this.m_sliderHorizontal);
                if (vshow) {
                    this.padding = [0, 10, 10, 0];
                    this.m_sliderHorizontal.right = 10;
                }
                else {
                    this.padding = [0, 0, 10, 0];
                    this.m_sliderHorizontal.right = 0;
                }
            }
            else {
                _super.prototype.removeChild.call(this, this.m_sliderHorizontal);
                if (vshow) {
                    this.padding = [0, 10, 0, 0];
                }
                else {
                    this.padding = [0, 0, 0, 0];
                }
            }
        };
        return RUIScrollView;
    }(RUIContainer_10.RUIContainer));
    exports.RUIScrollView = RUIScrollView;
});
define("rui/widget/RUITabView", ["require", "exports", "rui/RUIObject", "rui/widget/RUIButtonGroup", "rui/widget/RUIButton", "rui/RUIStyle", "rui/widget/RUIScrollView", "rui/RUIFlexContainer", "rui/RUIUtil"], function (require, exports, RUIObject_20, RUIButtonGroup_1, RUIButton_2, RUIStyle_11, RUIScrollView_1, RUIFlexContainer_3, RUIUtil_17) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUITabView = /** @class */ (function (_super) {
        __extends(RUITabView, _super);
        function RUITabView(pages, tabpos) {
            if (tabpos === void 0) { tabpos = RUIObject_20.RUIConst.TOP; }
            var _this = _super.call(this) || this;
            _this.boxBorder = RUIStyle_11.RUIStyle.Default.border0;
            var self = _this;
            _this.m_pages = pages;
            var buttons;
            if (pages != null) {
                buttons = [];
                pages.forEach(function (page) {
                    buttons.push(new RUIButton_2.RUIButton(page.label, _this.onMenuClick.bind(self)));
                });
            }
            var pagewrap = new RUIScrollView_1.RUIScrollView();
            pagewrap.flex = 1;
            pagewrap.boxBorder = RUIStyle_11.RUIStyle.Default.border0;
            pagewrap.boxBackground = RUIStyle_11.RUIStyle.Default.background1;
            var menu;
            if (tabpos == RUIObject_20.RUIConst.TOP || tabpos == RUIObject_20.RUIConst.BOTTOM) {
                _this.boxOrientation = RUIObject_20.RUIOrientation.Vertical;
                pagewrap.boxMatchWidth = true;
                menu.height = RUIUtil_17.RUIUtil.LINE_HEIGHT_DEFAULT;
                menu = new RUIButtonGroup_1.RUIButtonGroup(buttons, RUIObject_20.RUIOrientation.Horizontal);
                if (tabpos == RUIObject_20.RUIConst.TOP) {
                    _super.prototype.addChild.call(_this, menu);
                    _super.prototype.addChild.call(_this, pagewrap);
                }
                else {
                    _super.prototype.addChild.call(_this, pagewrap);
                    _super.prototype.addChild.call(_this, menu);
                }
            }
            else {
                _this.boxOrientation = RUIObject_20.RUIOrientation.Horizontal;
                pagewrap.boxMatchHeight = true;
                menu = new RUIButtonGroup_1.RUIButtonGroup(buttons, RUIObject_20.RUIOrientation.Vertical);
                menu.width = 100;
                if (tabpos == RUIObject_20.RUIConst.LEFT) {
                    _super.prototype.addChild.call(_this, menu);
                    _super.prototype.addChild.call(_this, pagewrap);
                }
                else {
                    _super.prototype.addChild.call(_this, pagewrap);
                    _super.prototype.addChild.call(_this, menu);
                }
            }
            _this.m_menu = menu;
            _this.m_pageWrap = pagewrap;
            _this.setPageIndex(0);
            return _this;
        }
        RUITabView.prototype.onMenuClick = function (b) {
            var index = this.m_menu.getButtonIndex(b);
            if (index >= 0)
                this.setPageIndex(index);
        };
        RUITabView.prototype.setPageIndex = function (index) {
            if (this.m_pageIndex == index)
                return;
            var ui = this.m_pages[index].ui;
            if (ui != null) {
                var wrap = this.m_pageWrap;
                //wrap.setScrollPosition(0,0);
                wrap.removeChildByIndex(0);
                wrap.addChild(ui);
                this.m_pageIndex = index;
            }
        };
        RUITabView.prototype.addChild = function (ui) {
        };
        RUITabView.prototype.removeChild = function (ui) {
        };
        return RUITabView;
    }(RUIFlexContainer_3.RUIFlexContainer));
    exports.RUITabView = RUITabView;
});
define("rui/widget/RUIToolTip", ["require", "exports", "rui/RUIRectangle", "rui/RUIColor"], function (require, exports, RUIRectangle_2, RUIColor_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIToolTip = /** @class */ (function (_super) {
        __extends(RUIToolTip, _super);
        function RUIToolTip() {
            var _this = _super.call(this, 10, 10) || this;
            _this.m_onHover = false;
            return _this;
        }
        RUIToolTip.prototype.onMouseEnter = function () {
            this.m_onHover = true;
            this.setDirty();
        };
        RUIToolTip.prototype.onMouseLeave = function () {
            this.m_onHover = false;
            this.setDirty();
        };
        RUIToolTip.prototype.onDraw = function (cmd) {
            _super.prototype.onDraw.call(this, cmd);
            var cliprect = this._drawClipRect;
            if (cliprect == null)
                return;
            if (this.m_onHover) {
                var rect = this._rect.slice(0);
                rect[1] -= 20;
                cmd.DrawRectWithColor(rect, RUIColor_5.RUIColor.RED, null, 500);
            }
        };
        return RUIToolTip;
    }(RUIRectangle_2.RUIRectangle));
    exports.RUIToolTip = RUIToolTip;
});
/// <reference path='../../node_modules/@types/webgl2/index.d.ts'/>
define("rui", ["require", "exports", "rui/RUIDOMCanvas", "rui/RUIUtil", "rui/RUIBinder", "rui/RUICmdList", "rui/RUIRoot", "rui/RUICursor", "rui/RUIDrawCallBuffer", "rui/RUIEvent", "rui/RUIFontTexture", "rui/RUIInput", "rui/RUIRectangle", "rui/RUIRenderer", "rui/RUIStyle", "rui/RUIContext", "rui/RUIContainer", "rui/RUIFlexContainer", "rui/widget/RUIButton", "rui/widget/RUIButtonGroup", "rui/widget/RUICanvas", "rui/widget/RUICheckBox", "rui/widget/RUICollapsibleContainer", "rui/widget/RUIField", "rui/widget/RUIImage", "rui/widget/RUILabel", "rui/widget/RUIOverlay", "rui/widget/RUIScrollBar", "rui/widget/RUIScrollView", "rui/widget/RUISlider", "rui/widget/RUISliderInput", "rui/widget/RUITabView", "rui/widget/RUITextInput", "rui/widget/RUIToolTip", "rui/RUIShaderLib"], function (require, exports, RUIDOMCanvas_1, RUIUtil_18, RUIBinder_2, RUICmdList_2, RUIRoot_2, RUICursor_2, RUIDrawCallBuffer_2, RUIEvent_11, RUIFontTexture_4, RUIInput_3, RUIRectangle_3, RUIRenderer_2, RUIStyle_12, RUIContext_3, RUIContainer_11, RUIFlexContainer_4, RUIButton_3, RUIButtonGroup_2, RUICanvas_1, RUICheckBox_2, RUICollapsibleContainer_1, RUIField_1, RUIImage_2, RUILabel_3, RUIOverlay_1, RUIScrollBar_2, RUIScrollView_2, RUISlider_2, RUISliderInput_2, RUITabView_1, RUITextInput_3, RUIToolTip_1, RUIShaderLib_2) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(RUIDOMCanvas_1);
    __export(RUIUtil_18);
    __export(RUIBinder_2);
    __export(RUICmdList_2);
    __export(RUIRoot_2);
    __export(RUICursor_2);
    __export(RUIDrawCallBuffer_2);
    __export(RUIEvent_11);
    __export(RUIFontTexture_4);
    __export(RUIInput_3);
    __export(RUIRectangle_3);
    __export(RUIRenderer_2);
    __export(RUIStyle_12);
    __export(RUIContext_3);
    __export(RUIContainer_11);
    __export(RUIFlexContainer_4);
    __export(RUIButton_3);
    __export(RUIButtonGroup_2);
    __export(RUICanvas_1);
    __export(RUICheckBox_2);
    __export(RUICollapsibleContainer_1);
    __export(RUIField_1);
    __export(RUIImage_2);
    __export(RUILabel_3);
    __export(RUIOverlay_1);
    __export(RUIScrollBar_2);
    __export(RUIScrollView_2);
    __export(RUISlider_2);
    __export(RUISliderInput_2);
    __export(RUITabView_1);
    __export(RUITextInput_3);
    __export(RUIToolTip_1);
    __export(RUIShaderLib_2);
});
// import { UIObject, UIDisplayMode, UIPosition } from "../UIObject";
// import { RUIDrawCall } from "../RUIDrawCall";
// import { RUIStyle } from "../RUIStyle";
// import { UIButton } from "./UIButton";
// type UIMenuItemFunc = ()=>void;
// type UIMenuItemList = {[key:string]:UIMenuItemFunc};
// export class UIContextMenu extends UIObject{
//     private m_isshow:boolean =false;
//     private m_attatchUI:UIObject;
//     public constructor(items?:UIMenuItemList){
//         super();
//         if(items) this.setMenuItems(items);
//     }
//     public onBuild(){
//         this.visibleSelf =false;
//         this.position = UIPosition.Absolute;
//         this.floatLeft = 0;
//         this.floatTop = 0;
//         this.zorder = RUIDrawCall.LAYER_OVERLAY;
//         this.displayMode= UIDisplayMode.None;
//     }
//     public onActive(){
//     }
//     public onInactive(){
//         this.m_isshow =false;
//         this.visibleSelf =false;
//         this.displayMode = UIDisplayMode.None;
//         this.setDirty(true);
//     }
//     public setMenuItems(items:UIMenuItemList){
//         this.children = [];
//         for (const key in items) {
//             if (items.hasOwnProperty(key)) {
//                 const item = items[key];
//                 let btn = new UIButton(key);
//                 if(item != null)
//                     btn.EvtMouseClick.on((f)=>item());
//                 this.addChild(btn);
//             }
//         }
//         this.setDirty(true);
//     }
//     public show(e:UIObject){
//         this.m_isshow = true;
//         this.m_attatchUI = e;
//         this.floatLeft = e._calculateX;
//         this.floatTop = e._calculateY+ e._height;
//         this.visibleSelf =true;
//         this.displayMode = UIDisplayMode.Default;
//         //this._canvas.setActiveUI(this);
//         this.setDirty(true);
//     }
//     public onDraw(cmd:RUIDrawCall){
//         if(this.m_isshow){
//             let attui = this.m_attatchUI;
//             let rect = [this._calculateX,this._calculateY,this._width,this._height];
//             cmd.DrawBorder(rect,RUIStyle.Default.primary0);
//         }
//     }
// }
//# sourceMappingURL=rui.js.map