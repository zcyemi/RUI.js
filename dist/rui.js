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
            console.log('rebuild');
            this.drawList = [];
            this.RebuildUINode(ui);
            this.ExecNodes(ui, this.PostRebuild.bind(this));
            ui.isDirty = false;
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
define("gl/wglDrawCallBuffer", ["require", "exports", "rui/RUIDrawCall"], function (require, exports, RUIDrawCall_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var COLOR_ERROR = [1, 0, 1, 1];
    var wglDrawCallBuffer = /** @class */ (function () {
        function wglDrawCallBuffer(gl, drawcall) {
            this.drawCountRect = 0;
            this.isDirty = true;
            this.m_drawcall = drawcall;
            if (drawcall == null)
                return;
            var vbuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
            this.vertexBufferRect = vbuffer;
            var cbuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, cbuffer);
            this.colorBufferRect = cbuffer;
        }
        wglDrawCallBuffer.prototype.SyncBuffer = function (gl) {
            this.isDirty = true;
            var drawcall = this.m_drawcall;
            var drawlist = drawcall.drawList;
            if (drawlist.length == 0) {
                return;
            }
            else {
                var vertices = [];
                var colorary = [];
                var rectCount = 0;
                for (var i = 0; i < drawlist.length; i++) {
                    var cmd = drawlist[i];
                    var rect = cmd.Rect;
                    var color = cmd.Color;
                    switch (cmd.type) {
                        case RUIDrawCall_1.DrawCmdType.rect:
                            if (color == null)
                                color = COLOR_ERROR;
                            var r = color[0];
                            var g = color[1];
                            var b = color[2];
                            var a = color[3];
                            colorary.push(r, g, b, a);
                            colorary.push(r, g, b, a);
                            colorary.push(r, g, b, a);
                            colorary.push(r, g, b, a);
                            var x = rect[0];
                            var y = rect[1];
                            var w = rect[2];
                            var h = rect[3];
                            vertices.push(x, y, x + w, y, x + w, y + h, x, y + h);
                            rectCount++;
                            break;
                        case RUIDrawCall_1.DrawCmdType.text:
                            break;
                    }
                }
                this.drawCountRect = rectCount;
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferRect);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBufferRect);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorary), gl.STATIC_DRAW);
                console.log('sync vertex buffer');
            }
        };
        return wglDrawCallBuffer;
    }());
    exports.wglDrawCallBuffer = wglDrawCallBuffer;
});
define("gl/wglProgram", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var wglProgram = /** @class */ (function () {
        function wglProgram(program, gl) {
            this.Attribute = {};
            this.Uniform = {};
            this.Program = program;
            //reflect attribute
            var numAttrs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
            for (var i = 0; i < numAttrs; i++) {
                var attrInfo = gl.getActiveAttrib(program, i);
                var attrLoca = gl.getAttribLocation(program, attrInfo.name);
                this.Attribute[attrInfo.name] = attrLoca;
            }
            var numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
            for (var i = 0; i < numUniforms; i++) {
                var unifInfo = gl.getActiveUniform(program, i);
                var unifLoca = gl.getUniformLocation(program, unifInfo.name);
                this.Uniform[unifInfo.name] = unifLoca;
            }
            this.AttrPos = this.Attribute['aPosition'];
            this.AttrColor = this.Attribute['aColor'];
            this.UniformProj = this.Uniform['uProj'];
        }
        wglProgram.Craete = function (gl, vs, ps) {
            var shadervert = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(shadervert, vs);
            gl.compileShader(shadervert);
            if (!gl.getShaderParameter(shadervert, gl.COMPILE_STATUS)) {
                console.error('create vertex shader failed:' + gl.getShaderInfoLog(shadervert));
                gl.deleteShader(shadervert);
                shadervert = null;
            }
            var shaderfrag = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(shaderfrag, ps);
            gl.compileShader(shaderfrag);
            if (!gl.getShaderParameter(shaderfrag, gl.COMPILE_STATUS)) {
                console.error('create fragment shader failed:' + gl.getShaderInfoLog(shadervert));
                gl.deleteShader(shaderfrag);
                shaderfrag = null;
            }
            if (shadervert == null || shaderfrag == null)
                return null;
            var program = gl.createProgram();
            gl.attachShader(program, shadervert);
            gl.attachShader(program, shaderfrag);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error('unable to link shader program: ' + gl.getProgramInfoLog(program));
                gl.deleteProgram(program);
                program = null;
            }
            if (program == null)
                return null;
            return new wglProgram(program, gl);
        };
        return wglProgram;
    }());
    exports.wglProgram = wglProgram;
});
define("gl/wglShaderLib", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GLSL_FRAG_COLOR = 'precision lowp float;\n\nvarying vec4 vColor;\n\nvoid main(){\ngl_FragColor = vColor;\n}';
    exports.GLSL_VERT_DEF = 'precision mediump float;\nattribute vec2 aPosition;\nattribute vec4 aColor;\n\nuniform vec4 uProj;\nvarying vec4 vColor;\n\nvoid main(){\nvec2 pos = aPosition * uProj.xy;\npos.y = 2.0 - pos.y;\npos.xy -=1.0;\ngl_Position = vec4(pos,0,1);\nvColor = aColor;\n}';
});
define("rui/RUIFontTexture", ["require", "exports", "opentype.js"], function (require, exports, opentype) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIFontTexture = /** @class */ (function () {
        function RUIFontTexture() {
            this.CrateTexture();
            this.LoadFont();
        }
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
        RUIFontTexture.prototype.FillTexture = function () {
            var f = this.m_font;
            var ctx2d = this.m_ctx2d;
            var fontsize = 16.0;
            var upx = fontsize / f.unitsPerEm;
            var linh = 0;
            var linw = 0;
            var maxh = 0;
            for (var i = 33; i <= 126; i++) {
                var c = String.fromCharCode(i);
                var g = f.charToGlyph(c);
                var m = g.getMetrics();
                var y = Math.ceil(upx * (m.yMax));
                var x = Math.ceil(upx * (m.xMax - m.xMin)) + 1;
                if (linw + x > 128) {
                    linw = 0;
                    linh += 16;
                    maxh = 0;
                }
                var p = g.getPath(linw, linh + y, fontsize);
                p['fill'] = "white";
                p.draw(ctx2d);
                linw += x;
                maxh = Math.max(maxh, y);
            }
        };
        RUIFontTexture.prototype.CrateTexture = function () {
            var texw = 128;
            var texh = 128;
            var canvas2d = document.createElement("canvas");
            canvas2d.style.backgroundColor = "#000";
            canvas2d.width = texw;
            canvas2d.height = texh;
            var h = 14;
            var lineh = h;
            var linew = 0;
            var ctx = canvas2d.getContext('2d');
            this.m_ctx2d = ctx;
            document.body.appendChild(canvas2d);
            this.m_textureWidth = texw;
            this.m_textureHeight = texh;
            var gl = RUIFontTexture.s_gl;
        };
        RUIFontTexture.s_inited = false;
        return RUIFontTexture;
    }());
    exports.RUIFontTexture = RUIFontTexture;
});
define("gl/wglctx", ["require", "exports", "gl/wglDrawCallBuffer", "gl/wglProgram", "gl/wglShaderLib", "rui/RUIFontTexture"], function (require, exports, wglDrawCallBuffer_1, wglProgram_1, wglShaderLib_1, RUIFontTexture_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MAX_RECT_COUNT = 512;
    var WGLContext = /** @class */ (function () {
        function WGLContext(wgl) {
            this.m_drawcallBuffer = null;
            this.m_indicesBuffer = null;
            this.m_projectParam = [0, 0, 0, 0];
            this.gl = wgl;
            RUIFontTexture_1.RUIFontTexture.Init();
            this.SetupWGL();
        }
        WGLContext.InitWidthCanvas = function (canvas) {
            var wgl = canvas.getContext('webgl2');
            if (wgl == null) {
                wgl = canvas.getContext('webgl');
            }
            if (wgl == null) {
                throw new Error('get webgl context failed!');
            }
            var wglrender = new WGLContext(wgl);
            return wglrender;
        };
        WGLContext.InitWidthWGL = function (wgl) {
            var wglrender = new WGLContext(wgl);
            return wglrender;
        };
        WGLContext.prototype.SetupWGL = function () {
            var gl = this.gl;
            if (gl == null)
                return;
            //indices buffer
            var ibuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuffer);
            var idata = [];
            var ic = 0;
            for (var i = 0; i < MAX_RECT_COUNT; i++) {
                idata.push(ic, ic + 2, ic + 1, ic, ic + 3, ic + 2);
                ic += 4;
            }
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idata), gl.STATIC_DRAW);
            this.m_indicesBuffer = ibuffer;
            //shaders
            this.m_programRect = wglProgram_1.wglProgram.Craete(gl, wglShaderLib_1.GLSL_VERT_DEF, wglShaderLib_1.GLSL_FRAG_COLOR);
            //pipeline
            gl.disable(gl.DEPTH_TEST);
            //parameter
            this.m_projectParam = [2 / 800.0, 2 / 600.0, 0, 0];
            gl.viewport(0, 0, 800.0, 600.0);
        };
        WGLContext.prototype.Draw = function (drawcall) {
            if (drawcall == null)
                return;
            if (this.m_drawcallBuffer == null) {
                this.m_drawcallBuffer = new wglDrawCallBuffer_1.wglDrawCallBuffer(this.gl, drawcall);
            }
            if (drawcall.isDirty) {
                this.m_drawcallBuffer.SyncBuffer(this.gl);
                drawcall.isDirty = false;
            }
            //do draw
            var drawbuffer = this.m_drawcallBuffer;
            if (!drawbuffer.isDirty)
                return;
            var gl = this.gl;
            gl.clearColor(0.95, 0.95, 0.95, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            //draw drawcall buffer
            var drawRectCount = drawbuffer.drawCountRect;
            if (drawRectCount > 0) {
                gl.bindBuffer(gl.ARRAY_BUFFER, drawbuffer.vertexBufferRect);
                gl.vertexAttribPointer(this.m_programRect.AttrPos, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(this.m_programRect.AttrPos);
                //color
                gl.bindBuffer(gl.ARRAY_BUFFER, drawbuffer.colorBufferRect);
                gl.vertexAttribPointer(this.m_programRect.AttrColor, 4, gl.FLOAT, true, 0, 0);
                gl.enableVertexAttribArray(this.m_programRect.AttrColor);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.m_indicesBuffer);
                gl.useProgram(this.m_programRect.Program);
                gl.uniform4fv(this.m_programRect.UniformProj, this.m_projectParam);
                gl.drawElements(gl.TRIANGLES, drawRectCount * 6, gl.UNSIGNED_SHORT, 0);
            }
            drawbuffer.isDirty = false;
        };
        return WGLContext;
    }());
    exports.WGLContext = WGLContext;
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
define("rui/UIWidgets", ["require", "exports", "rui/UIObject", "rui/RUIEventSys", "rui/RUICursor"], function (require, exports, UIObject_2, RUIEventSys_2, RUICursor_1) {
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
        };
        UIButton.prototype.onMouseEnter = function (e) {
            e.canvas.cursor.SetCursor(RUICursor_1.RUICursorType.pointer);
        };
        UIButton.prototype.onMouseLeave = function (e) {
            e.canvas.cursor.SetCursor(RUICursor_1.RUICursorType.default);
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
define("rui/RUICanvas", ["require", "exports", "rui/RUIDrawCall", "gl/wglctx", "rui/DebugUI", "rui/RUIInput", "rui/RUIQTree", "rui/RUICursor"], function (require, exports, RUIDrawCall_2, wglctx_1, DebugUI_1, RUIInput_1, RUIQTree_1, RUICursor_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUICanvas = /** @class */ (function () {
        function RUICanvas(canvas, UIClass) {
            this.m_valid = false;
            this.m_canvas = canvas;
            this.m_gl = wglctx_1.WGLContext.InitWidthCanvas(canvas);
            this.m_drawcall = new RUIDrawCall_2.RUIDrawCall();
            this.m_rootUI = new DebugUI_1.DebugUI();
            this.m_qtree = new RUIQTree_1.RUIQTree(this);
            this.m_input = new RUIInput_1.RUIInput(this);
            this.m_cursor = new RUICursor_2.RUICursor(this);
            if (this.m_gl) {
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
            if (this.m_gl)
                this.m_gl.Draw(this.m_drawcall);
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
