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
        RUIEvent.MOUSE_DOWN = "onMouseDown";
        RUIEvent.MOUSE_UP = "onMouseUp";
        RUIEvent.MOUSE_CLICK = "onMouseClick";
        RUIEvent.MOUSE_ENTER = "onMouseEnter";
        RUIEvent.MOUSE_LEAVE = "onMouseLeave";
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
define("rui/RUIStyle", ["require", "exports", "rui/UIUtil"], function (require, exports, UIUtil_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIStyle = /** @class */ (function () {
        function RUIStyle() {
            this.background0 = UIUtil_1.UIUtil.ColorUNorm(30, 30, 30, 255);
            this.background1 = UIUtil_1.UIUtil.ColorUNorm(37, 37, 38);
            this.background2 = UIUtil_1.UIUtil.ColorUNorm(51, 51, 51);
            this.primary = UIUtil_1.UIUtil.ColorUNorm(0, 122, 204);
            this.primary0 = UIUtil_1.UIUtil.ColorUNorm(9, 71, 113);
            this.inactive = UIUtil_1.UIUtil.ColorUNorm(63, 63, 70);
            this.border0 = UIUtil_1.UIUtil.ColorUNorm(3, 3, 3);
        }
        RUIStyle.Default = new RUIStyle();
        return RUIStyle;
    }());
    exports.RUIStyle = RUIStyle;
});
define("rui/UIObject", ["require", "exports", "rui/RUIStyle"], function (require, exports, RUIStyle_1) {
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
            this.color = RUIStyle_1.RUIStyle.Default.background0;
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
            if (this._canvas != null) {
                ui.setCanvas(this._canvas);
            }
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
            ui.setCanvas(null);
            this.isDirty = true;
        };
        UIObject.prototype.setCanvas = function (canvas) {
            this.execRecursive(function (u) { return u._canvas = canvas; });
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
        UIObject.prototype.onMouseDown = function (e) {
        };
        UIObject.prototype.onMouseUp = function (e) { };
        UIObject.prototype.onMouseClick = function (e) {
        };
        UIObject.prototype.onActive = function () { };
        UIObject.prototype.onInactive = function () { };
        UIObject.prototype.onDraw = function (cmd) {
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
                if (this.parent != null)
                    this.parent.bubbleDirty();
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
    var UIDiv = /** @class */ (function (_super) {
        __extends(UIDiv, _super);
        function UIDiv() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return UIDiv;
    }(UIObject));
    exports.UIDiv = UIDiv;
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
                var newActiveUI = tar.qtree.DispatchEvtMouseEvent(e.offsetX, e.offsetY, RUIEventSys_1.RUIEvent.MOUSE_DOWN);
                var curActiveUI = _this.m_activeMouseUI;
                if (curActiveUI == newActiveUI)
                    return;
                if (curActiveUI != null)
                    curActiveUI.onInactive();
                if (newActiveUI != null) {
                    newActiveUI.onActive();
                    _this.m_activeMouseUI = newActiveUI;
                }
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
define("rui/widget/UIInput", ["require", "exports", "rui/UIObject", "rui/RUIStyle", "rui/RUICursor"], function (require, exports, UIObject_1, RUIStyle_2, RUICursor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIInput = /** @class */ (function (_super) {
        __extends(UIInput, _super);
        function UIInput(content) {
            var _this = _super.call(this) || this;
            _this.m_isFocuesd = false;
            _this.m_isOnHover = false;
            _this.height = 23;
            _this.m_text = content;
            _this.color = RUIStyle_2.RUIStyle.Default.background0;
            return _this;
        }
        Object.defineProperty(UIInput.prototype, "text", {
            get: function () {
                return this.m_text;
            },
            set: function (val) {
                this.m_text = val;
                this.setDirty(true);
            },
            enumerable: true,
            configurable: true
        });
        UIInput.prototype.onBuild = function () {
            this.visible = true;
        };
        UIInput.prototype.onActive = function () {
            this.m_isFocuesd = true;
            this.setColor();
            this.setDirty(true);
        };
        UIInput.prototype.onInactive = function () {
            this.m_isFocuesd = false;
            this.setColor();
            this.setDirty(true);
        };
        UIInput.prototype.onMouseEnter = function (e) {
            e.canvas.cursor.SetCursor(RUICursor_1.RUICursorType.text);
            this.m_isOnHover = true;
            this.setColor();
            this.setDirty(true);
        };
        UIInput.prototype.onMouseLeave = function (e) {
            e.canvas.cursor.SetCursor(RUICursor_1.RUICursorType.default);
            this.m_isOnHover = false;
            this.setColor();
            this.setDirty(true);
        };
        UIInput.prototype.setColor = function () {
            var style = RUIStyle_2.RUIStyle.Default;
            if (this.m_isFocuesd) {
                this.color = style.background2;
            }
            else {
                this.color = this.m_isOnHover ? style.background1 : style.background0;
            }
        };
        UIInput.prototype.onDraw = function (cmd) {
            var rect = [this._calculateX, this._calculateY, this._width, this._height];
            cmd.DrawRectWithColor(rect, this.color);
            var text = this.m_text;
            if (text != null && text != '') {
                cmd.DrawText(text, rect);
            }
            if (this.m_isFocuesd) {
                var offset = 1;
                var borderR = [rect[0] + offset, rect[1] + offset, rect[2] - 2 * offset, rect[3] - 2 * offset];
                cmd.DrawBorder(borderR, RUIStyle_2.RUIStyle.Default.primary);
            }
        };
        return UIInput;
    }(UIObject_1.UIObject));
    exports.UIInput = UIInput;
});
define("rui/RUIDrawCall", ["require", "exports", "rui/UIObject"], function (require, exports, UIObject_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DrawCmdType;
    (function (DrawCmdType) {
        DrawCmdType[DrawCmdType["rect"] = 0] = "rect";
        DrawCmdType[DrawCmdType["text"] = 1] = "text";
        DrawCmdType[DrawCmdType["border"] = 2] = "border";
        DrawCmdType[DrawCmdType["line"] = 3] = "line";
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
        DrawCmd.CmdBorder = function (rect, color) {
            var cmd = new DrawCmd();
            cmd.Rect = rect;
            cmd.Color = color;
            cmd.type = DrawCmdType.border;
            return cmd;
        };
        DrawCmd.CmdLine = function (x1, y1, x2, y2, color) {
            var cmd = new DrawCmd();
            cmd.Rect = [x1, y1, x2, y2];
            cmd.Color = color;
            cmd.type = DrawCmdType.line;
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
        RUIDrawCall.prototype.Rebuild = function (ui, isResize) {
            if (isResize === void 0) { isResize = false; }
            this.drawList = [];
            this.RebuildNode(ui);
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
        //Process all child ui and self rect
        RUIDrawCall.prototype.RebuildNode = function (ui) {
            switch (ui.displayMode) {
                case UIObject_2.UIDisplayMode.Default:
                    this.RebuildNodeDefault(ui);
                    break;
                case UIObject_2.UIDisplayMode.Flex:
                    this.RebuildNodeFlex(ui);
                    break;
            }
        };
        RUIDrawCall.prototype.fillFlexSize = function (ui) {
            if (ui._flexHeight != null) {
                ui._height = ui._flexHeight;
            }
            else {
                ui._height = ui.height;
            }
            if (ui._flexWidth != null) {
                ui._width = ui._flexWidth;
            }
            else {
                ui._width = ui.width;
            }
        };
        //Post process rect
        RUIDrawCall.prototype.RebuildNodeDefault = function (ui) {
            this.fillFlexSize(ui);
            var children = ui.children;
            var parent = ui.parent;
            var isVertical = ui.orientation == UIObject_2.UIOrientation.Vertical;
            var childOffset = 0;
            var childMaxSecond = 0;
            var clen = children.length;
            for (var i = 0, len = clen; i < len; i++) {
                var c = children[i];
                c._flexWidth = null;
                c._flexHeight = null;
                //TODO: set size for flex child
                this.RebuildNode(c);
                var cwidth = c._width;
                var cheight = c._height;
                if (cwidth == undefined || cheight == undefined)
                    throw new Error('child size not full calculated!');
                if (isVertical) {
                    c._offsetX = 0;
                    c._offsetY = childOffset;
                    childOffset += c._height;
                    childMaxSecond = Math.max(childMaxSecond, c._width);
                }
                else {
                    c._offsetX = childOffset;
                    c._offsetY = 0;
                    childOffset += c._width;
                    childMaxSecond = Math.max(childMaxSecond, c._height);
                }
            }
            if (clen > 0) {
                //set ui size
                if (ui._width == undefined) {
                    ui._width = isVertical ? childMaxSecond : childOffset;
                }
                if (ui._height == undefined) {
                    ui._height = isVertical ? childOffset : childMaxSecond;
                }
            }
            else {
                var pisVertical = parent.orientation == UIObject_2.UIOrientation.Vertical;
                if (ui._width == undefined) {
                    ui._width = pisVertical ? parent._width : 100;
                }
                if (ui._height == undefined) {
                    ui._height = pisVertical ? 23 : parent._height;
                }
            }
        };
        //Pre process rect
        RUIDrawCall.prototype.RebuildNodeFlex = function (ui) {
            this.fillFlexSize(ui);
            //checkfor root
            if (ui.parent == null) {
                var canvas = ui._canvas;
                ui._width = canvas.m_width;
                ui._height = canvas.m_height;
            }
            var isVertical = ui.orientation == UIObject_2.UIOrientation.Vertical;
            //check size
            if (ui._height == null) {
                if (ui.height != null) {
                    ui._height = ui.height;
                }
                else {
                    throw new Error('flex proces error');
                }
            }
            if (ui._width == null) {
                if (ui.width != null) {
                    ui._width = ui.width;
                }
                else {
                    throw new Error('flex proces error');
                }
            }
            var fsizeTotal = isVertical ? ui._height : ui._width;
            var fsizeSecond = isVertical ? ui._width : ui._height;
            var children = ui.children;
            var clen = children.length;
            var flexCount = 0;
            var flexSize = 0;
            //calculate size
            for (var i = 0; i < clen; i++) {
                var c = children[i];
                if (c.flex != null) {
                    flexCount += c.flex;
                }
                else {
                    var cfsize = isVertical ? c.height : c.width;
                    if (cfsize == null) {
                        throw new Error('flexed child has invalid flex or size');
                    }
                    else {
                        flexSize += cfsize;
                    }
                }
            }
            var sizePerFlex = (fsizeTotal - flexSize) / flexCount;
            var childOffsetY = 0;
            var childOffsetX = 0;
            for (var i = 0; i < clen; i++) {
                var c = children[i];
                var flexval = c.flex != null;
                if (isVertical) {
                    c._flexWidth = fsizeSecond;
                    c._flexHeight = flexval ? c.flex * sizePerFlex : c.height;
                }
                else {
                    c._flexHeight = fsizeSecond;
                    c._flexWidth = flexval ? c.flex * sizePerFlex : c.width;
                }
                this.RebuildNode(c);
                c._offsetX = childOffsetX;
                c._offsetY = childOffsetY;
                if (isVertical) {
                    childOffsetY += c._height;
                }
                else {
                    childOffsetX += c._width;
                }
            }
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
        RUIDrawCall.prototype.DrawBorder = function (rect, color) {
            var cmd = DrawCmd.CmdBorder(rect, color);
            this.drawList.push(cmd);
        };
        RUIDrawCall.prototype.DrawLine = function (x1, y1, x2, y2, color) {
        };
        return RUIDrawCall;
    }());
    exports.RUIDrawCall = RUIDrawCall;
});
define("rui/widget/UIButton", ["require", "exports", "rui/UIObject", "rui/RUIEventSys", "rui/RUICursor", "rui/RUIStyle"], function (require, exports, UIObject_3, RUIEventSys_2, RUICursor_2, RUIStyle_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIButton = /** @class */ (function (_super) {
        __extends(UIButton, _super);
        function UIButton(label) {
            var _this = _super.call(this) || this;
            _this.EvtMouseDown = new RUIEventSys_2.RUIEventEmitter();
            _this.EvtMouseClick = new RUIEventSys_2.RUIEventEmitter();
            _this.label = label;
            return _this;
        }
        UIButton.prototype.onBuild = function () {
            this.visible = true;
            this.width = 100;
            this.height = 23;
            this.color = RUIStyle_3.RUIStyle.Default.background1;
        };
        UIButton.prototype.onMouseEnter = function (e) {
            e.canvas.cursor.SetCursor(RUICursor_2.RUICursorType.pointer);
            this.color = RUIStyle_3.RUIStyle.Default.background2;
            this.setDirty(true);
            e.prevent();
        };
        UIButton.prototype.onMouseLeave = function (e) {
            e.canvas.cursor.SetCursor(RUICursor_2.RUICursorType.default);
            this.color = RUIStyle_3.RUIStyle.Default.background1;
            this.setDirty(true);
            e.prevent();
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
    }(UIObject_3.UIObject));
    exports.UIButton = UIButton;
});
define("rui/widget/UIRect", ["require", "exports", "rui/UIObject"], function (require, exports, UIObject_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIRect = /** @class */ (function (_super) {
        __extends(UIRect, _super);
        function UIRect() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UIRect.prototype.onBuild = function () {
            this.visible = true;
        };
        UIRect.prototype.onDraw = function (drawcall) {
            var rect = [this._calculateX, this._calculateY, this._width, this._height];
            drawcall.DrawRectWithColor(rect, this.color);
        };
        return UIRect;
    }(UIObject_4.UIObject));
    exports.UIRect = UIRect;
});
define("rui/DebugUI", ["require", "exports", "rui/UIObject", "rui/widget/UIButton", "rui/widget/UIRect", "rui/RUIStyle", "rui/widget/UIInput"], function (require, exports, UIObject_5, UIButton_1, UIRect_1, RUIStyle_4, UIInput_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HeaderUI = /** @class */ (function (_super) {
        __extends(HeaderUI, _super);
        function HeaderUI() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.btnNew = new UIButton_1.UIButton("New");
            _this.btnOpen = new UIButton_1.UIButton("Open");
            return _this;
        }
        HeaderUI.prototype.onBuild = function () {
            this.visible = false;
            this.displayMode = UIObject_5.UIDisplayMode.Flex;
            this.orientation = UIObject_5.UIOrientation.Horizontal;
            this.addChild(this.btnNew);
            this.addChild(this.btnOpen);
        };
        HeaderUI.prototype.onDraw = function (cmd) {
        };
        return HeaderUI;
    }(UIObject_5.UIObject));
    exports.HeaderUI = HeaderUI;
    var EditorUI = /** @class */ (function (_super) {
        __extends(EditorUI, _super);
        function EditorUI() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EditorUI.prototype.onBuild = function () {
            this.visible = true;
            this.color = RUIStyle_4.RUIStyle.Default.background1;
            this.addChild(new UIInput_1.UIInput('TestName'));
            this.addChild(new UIInput_1.UIInput('1232'));
            this.addChild(new UIInput_1.UIInput('1232'));
            this.addChild(new UIButton_1.UIButton('Clear'));
        };
        EditorUI.prototype.onDraw = function (cmd) {
            var rect = [this._calculateX, this._calculateY, this._width, this._height];
            cmd.DrawRectWithColor(rect, this.color);
        };
        return EditorUI;
    }(UIObject_5.UIObject));
    exports.EditorUI = EditorUI;
    var DebugUI = /** @class */ (function (_super) {
        __extends(DebugUI, _super);
        function DebugUI() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DebugUI.prototype.onBuild = function () {
            this.visible = true;
            this.displayMode = UIObject_5.UIDisplayMode.Flex;
            var header = new HeaderUI();
            header.height = 23;
            this.m_header = header;
            this.addChild(header);
            var main = new UIObject_5.UIDiv();
            main.flex = 1;
            main.displayMode = UIObject_5.UIDisplayMode.Flex;
            main.orientation = UIObject_5.UIOrientation.Horizontal;
            this.addChild(main);
            var editorui = new EditorUI();
            editorui.flex = 2;
            main.addChild(editorui);
            this.m_editor = editorui;
            var x = new UIRect_1.UIRect();
            x.flex = 3;
            main.addChild(x);
            // let btn1 = new UIButton();
            // btn1.EvtMouseClick.on((e)=>{
            //     console.log('btn1 click');
            // });
            // this.addChild(btn1);
            // let c = new UIObject();
            // c.orientation = UIOrientation.Horizontal;
            // c.addChild(new UIRect());
            // c.addChild(new UIRect());
            // this.addChild(c);
            // this.addChild(new UIRect());
        };
        DebugUI.prototype.onDraw = function (drawcall) {
            var rect = [this._calculateX, this._calculateY, this._width, this._height];
            drawcall.DrawRectWithColor(rect, this.color);
        };
        return DebugUI;
    }(UIObject_5.UIObject));
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
            target[type].call(target, new RUIEventSys_3.RUIMouseEvent(target, type, x, y));
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
define("rui/RUIColor", ["require", "exports", "rui/UIUtil"], function (require, exports, UIUtil_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIColor = /** @class */ (function () {
        function RUIColor() {
        }
        RUIColor.White = [1, 1, 1, 0];
        RUIColor.Grey = UIUtil_2.UIUtil.ColorUNorm(200, 200, 200, 255);
        return RUIColor;
    }());
    exports.RUIColor = RUIColor;
});
define("rui/RUIDrawCallBuffer", ["require", "exports", "rui/RUIDrawCall", "gl/wglShaderLib", "rui/RUIFontTexture", "rui/RUIColor"], function (require, exports, RUIDrawCall_1, wglShaderLib_1, RUIFontTexture_1, RUIColor_1) {
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
    var RUIDrawCallBuffer = /** @class */ (function () {
        function RUIDrawCallBuffer(glctx, drawcall) {
            this.drawCountRect = 0;
            this.drawCountText = 0;
            this.isDirty = true;
            this.m_indicesBufferArray = new RUIArrayBufferUI16(Uint16Array);
            this.m_aryBufferRectColor = new RUIArrayBufferF32(Float32Array);
            this.m_aryBufferRectPos = new RUIArrayBufferF32(Float32Array);
            this.m_aryBufferTextPos = new RUIArrayBufferF32(Float32Array);
            this.m_aryBufferTextUV = new RUIArrayBufferF32(Float32Array);
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
                var rect_vert = this.m_aryBufferRectPos.resetPos();
                var rect_color = this.m_aryBufferRectColor.resetPos();
                var text_vert = this.m_aryBufferTextPos.resetPos();
                var text_uv = this.m_aryBufferTextUV.resetPos();
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
                                rect_color.push(color);
                                rect_color.push(color);
                                rect_color.push(color);
                                rect_color.push(color);
                                var x = rect[0];
                                var y = rect[1];
                                var w = rect[2];
                                var h = rect[3];
                                rect_vert.push([x, y, x + w, y, x + w, y + h, x, y + h]);
                                rectCount++;
                            }
                            break;
                        case RUIDrawCall_1.DrawCmdType.line:
                            {
                                if (color == null)
                                    color = RUIColor_1.RUIColor.Grey;
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
                                rect_vert.push([x1 + dx, y1 + dy, x2 + dx, y2 + dy, x2 - dx, y2 - dy, x1 - dx, y1 - dy]);
                                rectCount++;
                            }
                            break;
                        case RUIDrawCall_1.DrawCmdType.border:
                            {
                                if (color == null)
                                    color = COLOR_ERROR;
                                for (var n = 0; n < 16; n++) {
                                    rect_color.push(color);
                                }
                                var x1 = rect[0];
                                var y1 = rect[1];
                                var x2 = x1 + rect[2];
                                var y2 = y1 + rect[3];
                                rect_vert.push([x1, y1, x2, y1, x2, y1 + 1, x1, y1 + 1]);
                                rect_vert.push([x2 - 1, y1, x2, y1, x2, y2, x2 - 1, y2]);
                                rect_vert.push([x1, y2 - 1, x2, y2 - 1, x2, y2, x1, y2]);
                                rect_vert.push([x1, y1, x1 + 1, y1, x1 + 1, y2, x1, y2]);
                                rectCount += 4;
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
                                        text_vert.push([x, drawy, drawx1, drawy, drawx1, drawy1, x, drawy1]);
                                        text_uv.push(glyph.uv);
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
                        gl.bufferData(gl.ARRAY_BUFFER, rect_vert.buffer, gl.STATIC_DRAW);
                        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBufferRect);
                        gl.bufferData(gl.ARRAY_BUFFER, rect_color.buffer, gl.STATIC_DRAW);
                    }
                }
                //Text{
                this.drawCountText = textCount;
                if (textCount != 0) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferText);
                    gl.bufferData(gl.ARRAY_BUFFER, text_vert.buffer, gl.STATIC_DRAW);
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBufferText);
                    gl.bufferData(gl.ARRAY_BUFFER, text_uv.buffer, gl.STATIC_DRAW);
                }
            }
        };
        return RUIDrawCallBuffer;
    }());
    exports.RUIDrawCallBuffer = RUIDrawCallBuffer;
});
define("rui/RUIRenderer", ["require", "exports", "wglut", "rui/RUIDrawCallBuffer", "rui/RUIFontTexture", "rui/RUIStyle"], function (require, exports, wglut_1, RUIDrawCallBuffer_1, RUIFontTexture_2, RUIStyle_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIRenderer = /** @class */ (function () {
        function RUIRenderer(uicanvas) {
            var _this = this;
            this.m_drawcallBuffer = null;
            this.m_indicesBuffer = null;
            this.m_projectParam = [0, 0, 0, 0];
            this.m_isvalid = false;
            this.m_isResized = false;
            this.m_uicanvas = uicanvas;
            this.glctx = wglut_1.GLContext.createFromCanvas(uicanvas.canvas);
            window.addEventListener('resize', function () {
                _this.resizeCanvas(window.innerWidth, window.innerHeight);
            });
            if (!this.glctx) {
                return;
            }
            this.m_isvalid = true;
            this.gl = this.glctx.gl;
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
            gl.disable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            var clearColor = RUIStyle_5.RUIStyle.Default.background0;
            gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
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
define("rui/RUICanvas", ["require", "exports", "rui/RUIDrawCall", "rui/DebugUI", "rui/RUIInput", "rui/RUIQTree", "rui/RUICursor", "rui/RUIRenderer"], function (require, exports, RUIDrawCall_2, DebugUI_1, RUIInput_1, RUIQTree_1, RUICursor_3, RUIRenderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUICanvas = /** @class */ (function () {
        function RUICanvas(canvas, UIClass) {
            this.m_valid = false;
            this.m_isResized = false;
            this.m_canvas = canvas;
            this.m_renderer = new RUIRenderer_1.RUIRenderer(this);
            this.m_drawcall = new RUIDrawCall_2.RUIDrawCall();
            this.m_rootUI = new DebugUI_1.DebugUI();
            this.m_rootUI._canvas = this;
            this.m_qtree = new RUIQTree_1.RUIQTree(this);
            this.m_input = new RUIInput_1.RUIInput(this);
            this.m_cursor = new RUICursor_3.RUICursor(this);
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
        RUICanvas.prototype.setSize = function (w, h) {
            if (this.m_width != w || this.m_height != h) {
                this.m_width = w;
                this.m_height = h;
                this.m_isResized = true;
                if (this.m_rootUI != null)
                    this.m_rootUI.isDirty = true;
            }
        };
        RUICanvas.prototype.OnBuild = function () {
            this.m_rootUI._dispatchOnBuild();
            this.m_drawcall.Rebuild(this.m_rootUI);
            console.log(this.m_rootUI);
        };
        RUICanvas.prototype.OnFrame = function (ts) {
            var rootUI = this.m_rootUI;
            var renderer = this.m_renderer;
            if (rootUI.isDirty) {
                var startTime = Date.now();
                this.m_drawcall.Rebuild(rootUI, this.m_isResized);
                //console.log('rebuildui: '+(Date.now() -startTime) +'ms');
                this.m_isResized = false;
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
define("rui/widget/UIField", ["require", "exports", "rui/UIObject", "rui/RUIFontTexture"], function (require, exports, UIObject_6, RUIFontTexture_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIField = /** @class */ (function (_super) {
        __extends(UIField, _super);
        function UIField(label) {
            var _this = _super.call(this) || this;
            _this.m_label = label;
            return _this;
        }
        UIField.prototype.onBuild = function () {
            this.visible = true;
        };
        Object.defineProperty(UIField.prototype, "label", {
            get: function () {
                return this.m_label;
            },
            set: function (val) {
                this.m_label = val;
                this.setDirty(true);
            },
            enumerable: true,
            configurable: true
        });
        UIField.prototype.onDraw = function (cmd) {
            var rect = [this._calculateX, this._calculateY, this._width, this._height];
            var totalWidth = this._width;
            var labelsize = 0;
            var label = this.m_label;
            if (label != null && label != '') {
                labelsize = RUIFontTexture_3.RUIFontTexture.ASIICTexture.MeasureTextWith(label);
                labelsize = Math.min(labelsize + 10, Math.max(150, totalWidth * 0.5));
                var labelRect = [rect[0], rect[1], labelsize, rect[3]];
                cmd.DrawText(label, labelRect);
            }
        };
        return UIField;
    }(UIObject_6.UIObject));
    exports.UIField = UIField;
});
