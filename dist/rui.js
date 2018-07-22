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
define("rui/UIUtil", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIUtil = /** @class */ (function () {
        function UIUtil() {
        }
        UIUtil.RandomColor = function () {
            return [Math.random(), Math.random(), Math.random(), 1.0];
        };
        UIUtil.ColorUNorm = function (r, g, b, a) {
            if (a === void 0) { a = 255; }
            return [r / 255.0, g / 255.0, b / 255.0, a / 255.0];
        };
        return UIUtil;
    }());
    exports.UIUtil = UIUtil;
});
define("rui/RUIEventSys", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIEvent = /** @class */ (function () {
        function RUIEvent(tar, type, canvas) {
            this.isUsed = false;
            this._isPrevented = false;
            this.target = tar;
            this.eventType = type;
            this.canvas = canvas;
        }
        RUIEvent.prototype.prevent = function () {
            this._isPrevented = true;
        };
        RUIEvent.prototype.Use = function () {
            this.isUsed = true;
        };
        RUIEvent.MOUSE_DOWN = "EvtMouseDown";
        RUIEvent.MOUSE_UP = "EvtMouseUp";
        RUIEvent.MOUSE_CLICK = "EvtMouseClick";
        RUIEvent.MOUSE_ENTER = "EvtMouseEnter";
        RUIEvent.MOUSE_LEAVE = "EvtMouseLeave";
        return RUIEvent;
    }());
    exports.RUIEvent = RUIEvent;
    var RUIMouseEvent = /** @class */ (function (_super) {
        __extends(RUIMouseEvent, _super);
        function RUIMouseEvent(tar, type, x, y, canvas) {
            var _this = _super.call(this, tar, type, canvas) || this;
            _this.mousex = x;
            _this.mousey = y;
            return _this;
        }
        return RUIMouseEvent;
    }(RUIEvent));
    exports.RUIMouseEvent = RUIMouseEvent;
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
        return RUIEventEmitter;
    }());
    exports.RUIEventEmitter = RUIEventEmitter;
});
define("rui/UIObject", ["require", "exports", "rui/UIUtil"], function (require, exports, UIUtil_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIDisplayMode;
    (function (UIDisplayMode) {
        UIDisplayMode[UIDisplayMode["Default"] = 0] = "Default";
        UIDisplayMode[UIDisplayMode["Flex"] = 1] = "Flex";
        UIDisplayMode[UIDisplayMode["Floating"] = 2] = "Floating";
    })(UIDisplayMode = exports.UIDisplayMode || (exports.UIDisplayMode = {}));
    var UIOrientation;
    (function (UIOrientation) {
        UIOrientation[UIOrientation["Vertical"] = 0] = "Vertical";
        UIOrientation[UIOrientation["Horizontal"] = 1] = "Horizontal";
    })(UIOrientation = exports.UIOrientation || (exports.UIOrientation = {}));
    var UIObject = /** @class */ (function () {
        function UIObject() {
            this.parent = null;
            this.children = [];
            this.isDirty = true;
            this.visible = false;
            this.displayMode = UIDisplayMode.Default;
            this.orientation = UIOrientation.Vertical;
            this.color = UIUtil_1.UIUtil.RandomColor();
            this.width = null;
            this.height = null;
            this.extra = {};
        }
        UIObject.prototype.onBuild = function () {
        };
        UIObject.prototype._dispatchOnBuild = function () {
            this.onBuild();
            var clen = this.children.length;
            for (var i = 0; i < clen; i++) {
                this.children[i]._dispatchOnBuild();
            }
        };
        UIObject.prototype.addChild = function (ui) {
            if (ui == null || ui == this || ui == this.parent)
                return;
            var index = this.children.indexOf(ui);
            if (index >= 0)
                return;
            ui.parent = this;
            this.children.push(ui);
            ui.isDirty = true;
            this.isDirty = true;
        };
        UIObject.prototype.removeChild = function (ui) {
            if (ui == null)
                return;
            var index = this.children.indexOf(ui);
            if (index < 0)
                return;
            this.children.splice(index, 1);
            ui.parent = null;
            this.isDirty = true;
        };
        UIObject.prototype.execRecursive = function (f) {
            f(this);
            var clen = this.children.length;
            var children = this.children;
            for (var i = 0; i < clen; i++) {
                var c = children[i];
                c.execRecursive(f);
            }
        };
        UIObject.prototype.onMouseEnter = function (e) {
        };
        UIObject.prototype.onMouseLeave = function (e) {
        };
        UIObject.prototype.onMouseDown = function () {
        };
        UIObject.prototype.onMouseUp = function () {
        };
        UIObject.prototype.onMouseClick = function (e) {
        };
        UIObject.prototype.rectContains = function (x, y) {
            if (x < this._calculateX || x > this._calculateX + this._width)
                return false;
            if (y < this._calculateY || y > this._calculateY + this._height)
                return false;
            return true;
        };
        UIObject.prototype.setDirty = function (isdirty) {
            if (!isdirty) {
                this.isDirty = false;
            }
            else {
                this.isDirty = true;
                this.bubbleDirty();
            }
        };
        UIObject.prototype.bubbleDirty = function () {
            if (this.parent == null) {
                this.isDirty = true;
            }
            else {
                this.parent.bubbleDirty();
            }
        };
        return UIObject;
    }());
    exports.UIObject = UIObject;
});
define("rui/RUIDrawCall", ["require", "exports", "rui/UIObject"], function (require, exports, UIObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DrawCmdType;
    (function (DrawCmdType) {
        DrawCmdType[DrawCmdType["rect"] = 0] = "rect";
        DrawCmdType[DrawCmdType["text"] = 1] = "text";
    })(DrawCmdType = exports.DrawCmdType || (exports.DrawCmdType = {}));
    var DrawCmd = /** @class */ (function () {
        function DrawCmd(rect) {
            this.Rect = [];
            this.type = DrawCmdType.rect;
            this.Rect = rect;
        }
        DrawCmd.CmdRect = function (rect, color) {
            var cmd = new DrawCmd();
            cmd.Rect = rect;
            cmd.Color = color;
            return cmd;
        };
        DrawCmd.CmdText = function (text, cliprect, color) {
            var cmd = new DrawCmd();
            cmd.Text = text;
            cmd.Rect = cliprect;
            cmd.Color = color;
            cmd.type = DrawCmdType.text;
            return cmd;
        };
        return DrawCmd;
    }());
    exports.DrawCmd = DrawCmd;
    var RUIDrawCall = /** @class */ (function () {
        function RUIDrawCall() {
            this.drawList = [];
            this.isDirty = true;
        }
        RUIDrawCall.prototype.Rebuild = function (ui) {
            this.drawList = [];
            this.RebuildUINode(ui);
            this.ExecNodes(ui, this.PostRebuild.bind(this));
            ui.isDirty = false;
            this.isDirty = true;
        };
        RUIDrawCall.prototype.ExecNodes = function (uiobj, f) {
            f(uiobj);
            var c = uiobj.children;
            var cc = c.length;
            for (var i = 0; i < cc; i++) {
                var cu = c[i];
                this.ExecNodes(cu, f);
            }
        };
        RUIDrawCall.prototype.RebuildUINode = function (ui) {
            var children = ui.children;
            var childCount = children.length;
            var isVertical = ui.orientation == UIObject_1.UIOrientation.Vertical;
            var maxsize = isVertical ? ui.width : ui.height;
            var offset = 0;
            if (childCount != 0) {
                for (var i = 0; i < childCount; i++) {
                    var c = children[i];
                    if (c.isDirty) {
                        this.RebuildUINode(c);
                        c._offsetX = isVertical ? 0 : offset;
                        c._offsetY = isVertical ? offset : 0;
                    }
                    offset += isVertical ? c._height : c._width;
                    maxsize = Math.max(maxsize, isVertical ? c._width : c._height);
                }
                if (ui.width == undefined)
                    ui._width = isVertical ? maxsize : offset;
                if (ui.height == undefined)
                    ui._height = isVertical ? offset : maxsize;
            }
            else {
                ui._width = ui.width == null ? 20 : ui.width;
                ui._height = ui.height == null ? 20 : ui.height;
            }
            ui.isDirty = false;
        };
        RUIDrawCall.prototype.PostRebuild = function (ui) {
            var p = ui.parent;
            if (p == null) {
                ui._calculateX = 0;
                ui._calculateY = 0;
                ui._level = 0;
            }
            else {
                ui._calculateX = p._calculateX + ui._offsetX;
                ui._calculateY = p._calculateY + ui._offsetY;
                ui._level = p._level + 1;
            }
            if (ui.visible) {
                var onDraw = ui['onDraw'];
                if (onDraw != null) {
                    ui['onDraw'](this);
                }
                else {
                    var rect = [ui._calculateX, ui._calculateY, ui._width, ui._height];
                    this.DrawRectWithColor(rect, ui.color);
                }
            }
        };
        RUIDrawCall.prototype.DrawRect = function (x, y, w, h) {
            this.drawList.push(new DrawCmd([x, y, w, h]));
        };
        RUIDrawCall.prototype.DrawRectWithColor = function (pos, color) {
            var cmd = new DrawCmd(pos);
            cmd.Color = color;
            this.drawList.push(cmd);
        };
        RUIDrawCall.prototype.DrawText = function (text, clirect, color) {
            var cmd = DrawCmd.CmdText(text, clirect, color);
            this.drawList.push(cmd);
        };
        return RUIDrawCall;
    }());
    exports.RUIDrawCall = RUIDrawCall;
});
define("rui/RUIInput", ["require", "exports", "rui/RUIEventSys"], function (require, exports, RUIEventSys_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIInput = /** @class */ (function () {
        function RUIInput(uicanvas) {
            this.m_activeMouseUI = null;
            this.m_target = uicanvas;
            this.EvtMouseEnter = new RUIEventSys_1.RUIEventEmitter();
            this.EvtMouseLeave = new RUIEventSys_1.RUIEventEmitter();
            this.RegisterEvent();
        }
        RUIInput.prototype.RegisterEvent = function () {
            var _this = this;
            var c = this.m_target.canvas;
            var tar = this.m_target;
            c.addEventListener('mousedown', function (e) {
                var tar = _this.m_target;
                _this.m_activeMouseUI = tar.qtree.DispatchEvtMouseEvent(e.offsetX, e.offsetY, RUIEventSys_1.RUIEvent.MOUSE_DOWN);
            });
            c.addEventListener('mouseup', function (e) {
                var tar = _this.m_target;
                var tarui = tar.qtree.DispatchEvtMouseEvent(e.offsetX, e.offsetY, RUIEventSys_1.RUIEvent.MOUSE_UP);
                if (tarui && tarui == _this.m_activeMouseUI) {
                    tarui.onMouseClick(new RUIEventSys_1.RUIMouseEvent(tarui, RUIEventSys_1.RUIEvent.MOUSE_CLICK, e.offsetX, e.offsetY, tar));
                }
            });
            c.addEventListener('mousemove', function (e) {
                _this.m_target.qtree.DispatchEvtMouseMove(e.offsetX, e.offsetY);
            });
            c.addEventListener('mouseenter', function (e) {
                _this.EvtMouseEnter.emit(new RUIEventSys_1.RUIEvent(_this.m_target.rootui, RUIEventSys_1.RUIEvent.MOUSE_ENTER, tar));
            });
            c.addEventListener('mouseleave', function (e) {
                _this.EvtMouseLeave.emit(new RUIEventSys_1.RUIEvent(_this.m_target.rootui, RUIEventSys_1.RUIEvent.MOUSE_LEAVE, tar));
            });
        };
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
            this.m_input.EvtMouseEnter.on(this.onMouseEnter.bind(this));
            this.m_input.EvtMouseLeave.on(this.onMouseLeave.bind(this));
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
define("rui/RUIStyle", ["require", "exports", "rui/UIUtil"], function (require, exports, UIUtil_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIStyle = /** @class */ (function () {
        function RUIStyle() {
            this.background0 = UIUtil_2.UIUtil.ColorUNorm(30, 30, 30, 255);
            this.background1 = UIUtil_2.UIUtil.ColorUNorm(37, 37, 38);
            this.background2 = UIUtil_2.UIUtil.ColorUNorm(51, 51, 51);
            this.primary = UIUtil_2.UIUtil.ColorUNorm(0, 122, 204);
            this.primary0 = UIUtil_2.UIUtil.ColorUNorm(9, 71, 113);
            this.inactive = UIUtil_2.UIUtil.ColorUNorm(63, 63, 70);
            this.border0 = UIUtil_2.UIUtil.ColorUNorm(3, 3, 3);
        }
        RUIStyle.Default = new RUIStyle();
        return RUIStyle;
    }());
    exports.RUIStyle = RUIStyle;
});
define("rui/UIWidgets", ["require", "exports", "rui/UIObject", "rui/RUIEventSys", "rui/RUICursor", "rui/RUIStyle"], function (require, exports, UIObject_2, RUIEventSys_2, RUICursor_1, RUIStyle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIButton = /** @class */ (function (_super) {
        __extends(UIButton, _super);
        function UIButton() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.EvtMouseDown = new RUIEventSys_2.RUIEventEmitter();
            _this.EvtMouseClick = new RUIEventSys_2.RUIEventEmitter();
            return _this;
        }
        UIButton.prototype.onBuild = function () {
            this.visible = true;
            this.width = 100;
            this.height = 23;
            this.color = RUIStyle_1.RUIStyle.Default.background1;
        };
        UIButton.prototype.onMouseEnter = function (e) {
            e.canvas.cursor.SetCursor(RUICursor_1.RUICursorType.pointer);
            this.color = RUIStyle_1.RUIStyle.Default.background2;
            this.setDirty(true);
        };
        UIButton.prototype.onMouseLeave = function (e) {
            e.canvas.cursor.SetCursor(RUICursor_1.RUICursorType.default);
            this.color = RUIStyle_1.RUIStyle.Default.background1;
            this.setDirty(true);
        };
        UIButton.prototype.onMouseClick = function (e) {
            this.EvtMouseClick.emit(e);
        };
        UIButton.prototype.onDraw = function (drawcall) {
            var rect = [this._calculateX, this._calculateY, this._width, this._height];
            drawcall.DrawRectWithColor(rect, this.color);
            drawcall.DrawText('Button1', rect, null);
        };
        return UIButton;
    }(UIObject_2.UIObject));
    exports.UIButton = UIButton;
    var UIRect = /** @class */ (function (_super) {
        __extends(UIRect, _super);
        function UIRect() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UIRect.prototype.onBuild = function () {
            this.visible = true;
            this.width = 50;
            this.height = 50;
        };
        UIRect.prototype.onDraw = function (drawcall) {
            var rect = [this._calculateX, this._calculateY, this._width, this._height];
            drawcall.DrawRectWithColor(rect, this.color);
        };
        return UIRect;
    }(UIObject_2.UIObject));
    exports.UIRect = UIRect;
});
define("rui/DebugUI", ["require", "exports", "rui/UIObject", "rui/UIWidgets"], function (require, exports, UIObject_3, UIWidgets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DebugUI = /** @class */ (function (_super) {
        __extends(DebugUI, _super);
        function DebugUI() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DebugUI.prototype.onBuild = function () {
            var btn1 = new UIWidgets_1.UIButton();
            btn1.EvtMouseClick.on(function (e) {
                console.log('btn1 click');
            });
            this.addChild(btn1);
            var c = new UIObject_3.UIObject();
            c.orientation = UIObject_3.UIOrientation.Horizontal;
            c.addChild(new UIWidgets_1.UIRect());
            c.addChild(new UIWidgets_1.UIRect());
            this.addChild(c);
            this.addChild(new UIWidgets_1.UIRect());
        };
        return DebugUI;
    }(UIObject_3.UIObject));
    exports.DebugUI = DebugUI;
});
define("rui/RUIQTree", ["require", "exports", "rui/RUIEventSys"], function (require, exports, RUIEventSys_3) {
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
    var RUIQTree = /** @class */ (function () {
        function RUIQTree(canvas) {
            this.m_listHovered = [];
            this.m_tar = canvas;
            this.m_ui = canvas.rootui;
        }
        RUIQTree.prototype.DispatchEvtMouseEvent = function (x, y, type) {
            var target = this.TraversalTree(x, y);
            if (target == null)
                return null;
            var d = target[type];
            if (d) {
                d.emit(new RUIEventSys_3.RUIMouseEvent(target, type, x, y));
            }
            return target;
        };
        RUIQTree.prototype.DispatchEvtMouseMove = function (x, y) {
            var curlist = this.TraversalNormalAll(x, y);
            var hovlist = this.m_listHovered;
            for (var i = hovlist.length - 1; i >= 0; i--) {
                var c = hovlist[i];
                if (curlist.indexOf(c) == -1) {
                    c.onMouseLeave(new RUIEventSys_3.RUIEvent(c, RUIEventSys_3.RUIEvent.MOUSE_LEAVE, this.m_tar));
                    hovlist.splice(i, 1);
                }
            }
            for (var i = 0, len = curlist.length; i < len; i++) {
                var c = curlist[i];
                if (hovlist.indexOf(c) >= 0)
                    continue;
                c.onMouseEnter(new RUIEventSys_3.RUIEvent(c, RUIEventSys_3.RUIEvent.MOUSE_ENTER, this.m_tar));
                hovlist.push(c);
            }
        };
        RUIQTree.prototype.TraversalTree = function (x, y) {
            return this.TraversalNoraml(x, y);
        };
        RUIQTree.prototype.TraversalNormalAll = function (x, y) {
            var list = [];
            this.m_ui.execRecursive(function (ui) {
                if (ui.rectContains(x, y)) {
                    list.push(ui);
                }
            });
            return list;
        };
        RUIQTree.prototype.TraversalNoraml = function (x, y) {
            var tarNode = null;
            this.m_ui.execRecursive(function (ui) {
                if (ui.rectContains(x, y)) {
                    if (tarNode == null) {
                        tarNode = ui;
                    }
                    else {
                        if (ui._level >= tarNode._level)
                            tarNode = ui;
                    }
                }
            });
            return tarNode;
        };
        RUIQTree.prototype.TraversalQuadTree = function (x, y) {
            throw new Error('not implemented.');
        };
        return RUIQTree;
    }());
    exports.RUIQTree = RUIQTree;
});
define("gl/wglShaderLib", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GLSL_FRAG_COLOR = 'precision lowp float;\n\nvarying vec4 vColor;\n\nvoid main(){\ngl_FragColor = vColor;\n}';
    exports.GLSL_VERT_DEF = 'precision mediump float;\nattribute vec2 aPosition;\nattribute vec4 aColor;\n\nuniform vec4 uProj;\nvarying vec4 vColor;\n\nvoid main(){\nvec2 pos = aPosition * uProj.xy;\npos.y = 2.0 - pos.y;\npos.xy -=1.0;\ngl_Position = vec4(pos,0,1);\nvColor = aColor;\n}';
    exports.GLSL_FRAG_TEXT = '#version 300 es\nprecision lowp float;\n\nin vec4 vColor;\nin vec2 vUV;\n\nuniform sampler2D uSampler;\n\nout vec4 fragColor;\n\nvoid main(){\nfragColor = texture(uSampler,vUV);\n}';
    exports.GLSL_VERT_TEXT = '#version 300 es\nprecision mediump float;\nin vec2 aPosition;\nin vec4 aColor;\nin vec2 aUV;\nin vec4 aClip;\n\nuniform vec4 uProj;\nout vec4 vColor;\nout vec2 vUV;\n\nvoid main(){\nvec2 pos = aPosition * uProj.xy;\npos.y = 2.0 - pos.y;\npos.xy -=1.0;\ngl_Position = vec4(pos,0,1);\nvColor = aColor;\nvUV =aUV;\n}';
});
define("rui/RUIFontTexture", ["require", "exports", "opentype.js"], function (require, exports, opentype) {
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
            opentype.load('arial.ttf', function (e, f) {
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
                var y = Math.ceil(upx * (m.yMax));
                var x = Math.ceil(upx * (m.xMax - m.xMin)) + 1;
                if (linw + x > 128) {
                    linw = 0;
                    linh += fontsize;
                    maxh = 0;
                }
                var glyph = new RUIGlyph();
                glyph.width = x;
                glyph.height = y;
                glyph.offsetY = (upx * -m.yMax);
                glyphWidth.push(x);
                var uvx1 = linw * uvunit;
                var uvx2 = (linw + x) * uvunit;
                var uvy1 = linh * uvunit;
                var uvy2 = (linh + y) * uvunit;
                glyph.uv = [uvx1, uvy1, uvx2, uvy1, uvx2, uvy2, uvx1, uvy2];
                this.glyphs[i] = glyph;
                var p = g.getPath(linw, linh + y, fontsize);
                p['fill'] = "white";
                p.draw(ctx2d);
                linw += x;
                maxh = Math.max(maxh, y);
            }
            var url = ctx2d.canvas.toDataURL('image/png');
            var glctx = RUIFontTexture.s_gl;
            var gl = glctx.gl;
            var gltex = this.createTextureImage(glctx, gl.RGBA, gl.RGBA, url, true, true, function () {
                _this.m_textureValid = true;
                _this.m_isDirty = true;
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
            canvas2d.style.backgroundColor = "#000";
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
        return RUIFontTexture;
    }());
    exports.RUIFontTexture = RUIFontTexture;
});
define("rui/RUIDrawCallBuffer", ["require", "exports", "rui/RUIDrawCall", "gl/wglShaderLib", "rui/RUIFontTexture"], function (require, exports, RUIDrawCall_1, wglShaderLib_1, RUIFontTexture_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var COLOR_ERROR = [1, 0, 1, 1];
    var MAX_RECT_COUNT = 512;
    var RUIDrawCallBuffer = /** @class */ (function () {
        function RUIDrawCallBuffer(glctx, drawcall) {
            this.drawCountRect = 0;
            this.drawCountText = 0;
            this.isDirty = true;
            var gl = glctx.gl;
            this.m_drawcall = drawcall;
            if (drawcall == null)
                return;
            //Shaders
            this.programRect = glctx.createProgram(wglShaderLib_1.GLSL_VERT_DEF, wglShaderLib_1.GLSL_FRAG_COLOR);
            this.programText = glctx.createProgram(wglShaderLib_1.GLSL_VERT_TEXT, wglShaderLib_1.GLSL_FRAG_TEXT);
            //IndicesBuffer
            {
                var ibuffer = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuffer);
                var idata = [];
                var ic = 0;
                for (var i = 0; i < MAX_RECT_COUNT; i++) {
                    idata.push(ic, ic + 2, ic + 1, ic, ic + 3, ic + 2);
                    ic += 4;
                }
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idata), gl.STATIC_DRAW);
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
                gl.vertexAttribPointer(program.aPosition, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(program.aPosition);
                //color
                var cbuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, cbuffer);
                this.colorBufferRect = cbuffer;
                gl.vertexAttribPointer(program.aColor, 4, gl.FLOAT, true, 0, 0);
                gl.enableVertexAttribArray(program.aColor);
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
                gl.vertexAttribPointer(program.aPosition, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(program.aPosition);
                //UV
                var uvbuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, uvbuffer);
                this.uvBufferText = uvbuffer;
                gl.vertexAttribPointer(program.aUV, 2, gl.FLOAT, true, 0, 0);
                gl.enableVertexAttribArray(program.aUV);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
                gl.bindVertexArray(null);
            }
        }
        RUIDrawCallBuffer.prototype.SyncBuffer = function (gl) {
            this.isDirty = true;
            var drawcall = this.m_drawcall;
            var drawlist = drawcall.drawList;
            var fonttex = RUIFontTexture_1.RUIFontTexture.ASIICTexture;
            if (drawlist.length == 0) {
                return;
            }
            else {
                var rect_vert = [];
                var rect_color = [];
                var text_vert = [];
                var text_uv = [];
                var rectCount = 0;
                var textCount = 0;
                for (var i = 0, cmdlen = drawlist.length; i < cmdlen; i++) {
                    var cmd = drawlist[i];
                    var rect = cmd.Rect;
                    var color = cmd.Color;
                    switch (cmd.type) {
                        case RUIDrawCall_1.DrawCmdType.rect:
                            {
                                if (color == null)
                                    color = COLOR_ERROR;
                                var r = color[0];
                                var g = color[1];
                                var b = color[2];
                                var a = color[3];
                                rect_color.push(r, g, b, a);
                                rect_color.push(r, g, b, a);
                                rect_color.push(r, g, b, a);
                                rect_color.push(r, g, b, a);
                                var x = rect[0];
                                var y = rect[1];
                                var w = rect[2];
                                var h = rect[3];
                                rect_vert.push(x, y, x + w, y, x + w, y + h, x, y + h);
                                rectCount++;
                            }
                            break;
                        case RUIDrawCall_1.DrawCmdType.text:
                            {
                                var content = cmd.Text;
                                if (content == null || content === '')
                                    break;
                                var x = rect[0];
                                var y = rect[1];
                                var w = rect[2];
                                var h = rect[3];
                                var contentW = fonttex.MeasureTextWith(content);
                                x += Math.max(3, Math.floor((w - contentW) / 2.0));
                                y = y + h - (h - fonttex.fontSize);
                                for (var j = 0, len = content.length; j < len; j++) {
                                    var glyph = fonttex.glyphs[content.charCodeAt(j)];
                                    if (glyph == null) {
                                        // text_vert.push(x, y, x + w, y, x + w, y + h, x, y + h);
                                        // text_uv.push(0, 0, 1, 0, 1, 1, 0, 1);
                                    }
                                    else {
                                        var drawy = y + glyph.offsetY;
                                        var drawy1 = drawy + glyph.height;
                                        var drawx1 = x + glyph.width;
                                        text_vert.push(x, drawy, drawx1, drawy, drawx1, drawy1, x, drawy1);
                                        text_uv = text_uv.concat(glyph.uv);
                                        x += glyph.width;
                                        textCount++;
                                    }
                                }
                            }
                            break;
                    }
                }
                //Rect
                {
                    this.drawCountRect = rectCount;
                    if (rectCount != 0) {
                        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferRect);
                        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rect_vert), gl.STATIC_DRAW);
                        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBufferRect);
                        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rect_color), gl.STATIC_DRAW);
                    }
                }
                //Text{
                this.drawCountText = textCount;
                if (textCount != 0) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferText);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(text_vert), gl.STATIC_DRAW);
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBufferText);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(text_uv), gl.STATIC_DRAW);
                }
            }
        };
        return RUIDrawCallBuffer;
    }());
    exports.RUIDrawCallBuffer = RUIDrawCallBuffer;
});
define("rui/RUIRenderer", ["require", "exports", "wglut", "rui/RUIDrawCallBuffer", "rui/RUIFontTexture"], function (require, exports, wglut_1, RUIDrawCallBuffer_1, RUIFontTexture_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIRenderer = /** @class */ (function () {
        function RUIRenderer(uicanvas) {
            this.m_drawcallBuffer = null;
            this.m_indicesBuffer = null;
            this.m_projectParam = [0, 0, 0, 0];
            this.m_isvalid = false;
            this.glctx = wglut_1.GLContext.createFromCanvas(uicanvas.canvas);
            if (!this.glctx) {
                return;
            }
            this.m_isvalid = true;
            this.gl = this.glctx.gl;
            RUIFontTexture_2.RUIFontTexture.Init(this.glctx);
            this.SetupGL();
        }
        RUIRenderer.prototype.isValid = function () {
            return true;
        };
        RUIRenderer.prototype.SetupGL = function () {
            var gl = this.gl;
            if (gl == null)
                return;
            var glctx = this.glctx;
            //shaders
            //pipeline
            gl.disable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            //parameter
            this.m_projectParam = [2 / 800.0, 2 / 600.0, 0, 0];
            gl.viewport(0, 0, 800.0, 600.0);
        };
        RUIRenderer.prototype.Draw = function (drawcall) {
            if (drawcall == null)
                return;
            if (this.m_drawcallBuffer == null) {
                this.m_drawcallBuffer = new RUIDrawCallBuffer_1.RUIDrawCallBuffer(this.glctx, drawcall);
            }
            var fonttex = RUIFontTexture_2.RUIFontTexture.ASIICTexture;
            if (drawcall.isDirty || fonttex.isDirty) {
                this.m_drawcallBuffer.SyncBuffer(this.gl);
                drawcall.isDirty = false;
                fonttex.isDirty = false;
            }
            //do draw
            var drawbuffer = this.m_drawcallBuffer;
            if (!drawbuffer.isDirty)
                return;
            drawbuffer.isDirty = false;
            var gl = this.gl;
            gl.clearColor(0.95, 0.95, 0.95, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            //draw drawcall buffer
            var drawRectCount = drawbuffer.drawCountRect;
            if (drawRectCount > 0) {
                var programRect = drawbuffer.programRect;
                gl.useProgram(programRect.Program);
                gl.uniform4fv(programRect.uProj, this.m_projectParam);
                gl.bindVertexArray(this.m_drawcallBuffer.vaoRect);
                gl.drawElements(gl.TRIANGLES, drawRectCount * 6, gl.UNSIGNED_SHORT, 0);
            }
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
                    drawbuffer.isDirty = true;
                }
            }
        };
        return RUIRenderer;
    }());
    exports.RUIRenderer = RUIRenderer;
});
define("rui/RUICanvas", ["require", "exports", "rui/RUIDrawCall", "rui/DebugUI", "rui/RUIInput", "rui/RUIQTree", "rui/RUICursor", "rui/RUIRenderer"], function (require, exports, RUIDrawCall_2, DebugUI_1, RUIInput_1, RUIQTree_1, RUICursor_2, RUIRenderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUICanvas = /** @class */ (function () {
        function RUICanvas(canvas, UIClass) {
            this.m_valid = false;
            this.m_canvas = canvas;
            this.m_renderer = new RUIRenderer_1.RUIRenderer(this);
            this.m_drawcall = new RUIDrawCall_2.RUIDrawCall();
            this.m_rootUI = new DebugUI_1.DebugUI();
            this.m_qtree = new RUIQTree_1.RUIQTree(this);
            this.m_input = new RUIInput_1.RUIInput(this);
            this.m_cursor = new RUICursor_2.RUICursor(this);
            if (this.m_renderer.isValid) {
                this.m_valid = true;
            }
            this.OnBuild();
        }
        Object.defineProperty(RUICanvas.prototype, "canvas", {
            get: function () {
                return this.m_canvas;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUICanvas.prototype, "rootui", {
            get: function () {
                return this.m_rootUI;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUICanvas.prototype, "qtree", {
            get: function () {
                return this.m_qtree;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUICanvas.prototype, "input", {
            get: function () {
                return this.m_input;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUICanvas.prototype, "cursor", {
            get: function () {
                return this.m_cursor;
            },
            enumerable: true,
            configurable: true
        });
        RUICanvas.prototype.OnBuild = function () {
            this.m_rootUI._dispatchOnBuild();
            this.m_drawcall.Rebuild(this.m_rootUI);
            console.log(this.m_rootUI);
        };
        RUICanvas.prototype.OnFrame = function (ts) {
            if (this.m_rootUI.isDirty) {
                this.m_drawcall.Rebuild(this.m_rootUI);
            }
            this.OnRender();
        };
        RUICanvas.prototype.OnRender = function () {
            var render = this.m_renderer;
            if (render)
                render.Draw(this.m_drawcall);
        };
        return RUICanvas;
    }());
    exports.RUICanvas = RUICanvas;
});
define("rui", ["require", "exports", "rui/RUICanvas"], function (require, exports, RUICanvas_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(RUICanvas_1);
});
