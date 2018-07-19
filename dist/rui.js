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
        return UIObject;
    }());
    exports.UIObject = UIObject;
});
define("rui/RUIDrawCall", ["require", "exports", "rui/UIObject"], function (require, exports, UIObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DrawCmd = /** @class */ (function () {
        function DrawCmd(rect) {
            this.Rect = [];
            this.Rect = rect;
        }
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
            ui.isDirty = false;
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
        RUIDrawCall.prototype.DrawRect = function (x, y, w, h) {
            this.drawList.push(new DrawCmd([x, y, w, h]));
        };
        RUIDrawCall.prototype.DrawRectWithColor = function (pos, color) {
            var cmd = new DrawCmd(pos);
            cmd.Color = color;
            this.drawList.push(cmd);
        };
        return RUIDrawCall;
    }());
    exports.RUIDrawCall = RUIDrawCall;
});
define("gl/wglDrawCallBuffer", ["require", "exports"], function (require, exports) {
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
            this.drawCountRect = drawlist.length;
            if (drawlist.length == 0) {
                return;
            }
            else {
                var vertices = [];
                var colorary = [];
                for (var i = 0; i < drawlist.length; i++) {
                    var cmd = drawlist[i];
                    var rect = cmd.Rect;
                    var color = cmd.Color;
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
                }
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
define("rui/RUIFontTexture", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIFontTexture = /** @class */ (function () {
        function RUIFontTexture() {
            this.CrateTexture();
        }
        RUIFontTexture.Init = function () {
            if (RUIFontTexture.s_inited)
                return;
            RUIFontTexture.ASIICTexture = new RUIFontTexture();
            RUIFontTexture.s_inited = true;
        };
        RUIFontTexture.prototype.CrateTexture = function () {
            // let canvas2d = document.createElement("canvas");
            // canvas2d.width = 128;
            // canvas2d.height = 128;
            // let ctx : CanvasRenderingContext2D = canvas2d.getContext('2d');
            // ctx.font = '14px arial';
            // ctx.fillText('Hello world', 0, 100);
            // let m = ctx.measureText('H');
            // let p = fetch("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.ttf");
            // p.then(resp=>{
            //     console.log(resp);
            // },rej=>{
            // });
            // document.body.appendChild(canvas2d);
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
define("rui/UIWidgets", ["require", "exports", "rui/UIObject"], function (require, exports, UIObject_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIButton = /** @class */ (function (_super) {
        __extends(UIButton, _super);
        function UIButton() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UIButton.prototype.onBuild = function () {
            this.visible = true;
            this.width = 100;
            this.height = 23;
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
            this.addChild(new UIWidgets_1.UIButton());
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
define("rui/RUICanvas", ["require", "exports", "rui/RUIDrawCall", "gl/wglctx", "rui/DebugUI"], function (require, exports, RUIDrawCall_1, wglctx_1, DebugUI_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUICanvas = /** @class */ (function () {
        function RUICanvas(canvas, UIClass) {
            this.m_valid = false;
            this.m_canvas = canvas;
            this.m_gl = wglctx_1.WGLContext.InitWidthCanvas(canvas);
            this.m_drawcall = new RUIDrawCall_1.RUIDrawCall();
            this.m_rootUI = new DebugUI_1.DebugUI();
            if (this.m_gl) {
                this.m_valid = true;
            }
            this.OnBuild();
        }
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
