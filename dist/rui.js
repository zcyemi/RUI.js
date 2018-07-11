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
define("rui/UIStyle", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIStyle = /** @class */ (function () {
        function UIStyle() {
        }
        return UIStyle;
    }());
    exports.UIStyle = UIStyle;
});
define("rui/UIFlow", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FlowNodeType;
    (function (FlowNodeType) {
        FlowNodeType[FlowNodeType["START"] = 0] = "START";
        FlowNodeType[FlowNodeType["END"] = 1] = "END";
        FlowNodeType[FlowNodeType["CHILD"] = 2] = "CHILD";
    })(FlowNodeType = exports.FlowNodeType || (exports.FlowNodeType = {}));
    var UIFLowNode = /** @class */ (function () {
        function UIFLowNode(nodetype, ui) {
            this.type = nodetype;
            this.ui = ui;
        }
        return UIFLowNode;
    }());
    exports.UIFLowNode = UIFLowNode;
    var UIFlow = /** @class */ (function () {
        function UIFlow(target) {
            this.nodes = [];
            this.m_targetUI = target;
        }
        UIFlow.prototype.begin = function () {
            this.nodes = [];
            var fnode = new UIFLowNode(FlowNodeType.START, this.m_targetUI);
            this.nodes.push(fnode);
        };
        UIFlow.prototype.addChild = function (ui) {
            var fnode = new UIFLowNode(FlowNodeType.CHILD, ui);
            this.nodes.push(fnode);
        };
        UIFlow.prototype.flexBegin = function (isHorizontal) {
            if (isHorizontal === void 0) { isHorizontal = true; }
        };
        UIFlow.prototype.flexChildFlex = function (ui, flex) {
        };
        UIFlow.prototype.flexChildWidth = function (ui, flex) {
        };
        UIFlow.prototype.flexEnd = function () {
        };
        UIFlow.prototype.end = function () {
            var fnode = new UIFLowNode(FlowNodeType.END, this.m_targetUI);
            this.nodes.push(fnode);
        };
        return UIFlow;
    }());
    exports.UIFlow = UIFlow;
});
define("rui/widget/UIGroup", ["require", "exports", "rui/UIObject"], function (require, exports, UIObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIGroup = /** @class */ (function (_super) {
        __extends(UIGroup, _super);
        function UIGroup(isVertical) {
            var _this = _super.call(this) || this;
            _this.isVertical = true;
            _this.isVertical = isVertical;
            _this.isDrawn = false;
            return _this;
        }
        return UIGroup;
    }(UIObject_1.UIObject));
    exports.UIGroup = UIGroup;
});
define("rui/UIBuilder", ["require", "exports", "rui/widget/UIGroup"], function (require, exports, UIGroup_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HierarchyState = /** @class */ (function () {
        function HierarchyState() {
            this.contentWidth = 0;
            this.contentHeight = 0;
            this.vertical = true;
        }
        return HierarchyState;
    }());
    var UIBuilder = /** @class */ (function () {
        function UIBuilder(ui, canvasWidth, canvasHeight) {
            this.m_stateStack = [];
            this.m_root = ui;
            var state = new HierarchyState();
            state.ui = ui;
            state.maxWidth = canvasWidth;
            state.maxHeight = canvasHeight;
            this.m_state = state;
        }
        UIBuilder.prototype.expandContentSize = function (state, ui) {
            if (state.vertical) {
                state.contentHeight += ui.drawHeight;
                state.contentWidth = Math.max(state.contentWidth, ui.drawWidth);
            }
            else {
                state.contentWidth += ui.drawWidth;
                state.contentHeight = Math.max(state.contentHeight, ui.drawHeight);
            }
        };
        UIBuilder.prototype.calculateSize = function (state, ui) {
            if (ui.width == null) {
                ui.width = state.contentWidth;
            }
            else {
                ui.width = Math.max(state.contentWidth, ui.validWidth);
            }
            if (ui.height == null) {
                ui.height = state.contentHeight;
            }
            else {
                ui.height = Math.max(state.contentHeight, ui.validHeight);
            }
        };
        UIBuilder.prototype.Start = function () {
        };
        UIBuilder.prototype.addChild = function (ui) {
            this.m_stateStack.push(this.m_state);
            this.m_state.ui.children.push(ui);
            var state = new HierarchyState();
            state.ui = ui;
            this.m_state = state;
            ui.onBuild(this);
            this.m_state = this.m_stateStack.pop();
            this.expandContentSize(this.m_state, ui);
        };
        UIBuilder.prototype.End = function () {
            var state = this.m_state;
            var ui = state.ui;
            this.calculateSize(state, ui);
        };
        UIBuilder.prototype.GroupBegin = function (isVertical, width, height) {
            var group = new UIGroup_1.UIGroup(isVertical);
            group.width = width;
            group.height = height;
            this.m_stateStack.push(this.m_state);
            this.m_state.ui.children.push(group);
            var state = new HierarchyState();
            state.ui = group;
            state.vertical = isVertical;
            this.m_state = state;
            return group;
        };
        UIBuilder.prototype.GroupEnd = function () {
            var state = this.m_state;
            var ui = state.ui;
            this.calculateSize(state, ui);
            this.m_state = this.m_stateStack.pop();
            this.expandContentSize(this.m_state, ui);
        };
        UIBuilder.prototype.FlexBegin = function (isVertical) {
        };
        UIBuilder.prototype.FlexEnd = function () {
        };
        return UIBuilder;
    }());
    exports.UIBuilder = UIBuilder;
});
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
    var UIObject = /** @class */ (function () {
        function UIObject() {
            this.isDirty = false;
            this.isDrawn = true;
            this.margin = 1;
            this.color = UIUtil_1.UIUtil.RandomColor();
            this.extra = {};
            this.children = [];
        }
        UIObject.prototype.onBuild = function (builder) {
        };
        Object.defineProperty(UIObject.prototype, "validWidth", {
            get: function () {
                if (!this.width) {
                    return 23;
                }
                return this.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIObject.prototype, "validHeight", {
            get: function () {
                if (!this.height) {
                    return 23;
                }
                return this.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIObject.prototype, "drawWidth", {
            get: function () {
                return this.validWidth + this.margin * 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIObject.prototype, "drawHeight", {
            get: function () {
                return this.validHeight + this.margin * 2;
            },
            enumerable: true,
            configurable: true
        });
        return UIObject;
    }());
    exports.UIObject = UIObject;
});
define("rui/RUIDrawCall", ["require", "exports", "rui/widget/UIGroup"], function (require, exports, UIGroup_2) {
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
            this.RebuildFlow(ui, 0, 0);
            ui.isDirty = false;
        };
        RUIDrawCall.prototype.RebuildFlow = function (ui, xoff, yoff) {
            var drawoffx = xoff;
            var drawoffy = yoff;
            var c = ui.children;
            var isvertical = true;
            if (ui instanceof UIGroup_2.UIGroup) {
                isvertical = ui.isVertical;
            }
            if (ui.isDrawn)
                this.DrawRectWithColor([drawoffx + ui.margin, drawoffy + ui.margin, ui.validWidth, ui.validHeight], ui.color);
            for (var i = 0; i < c.length; i++) {
                var cu = c[i];
                this.RebuildFlow(cu, drawoffx, drawoffy);
                if (isvertical) {
                    drawoffy += cu.drawHeight;
                }
                else {
                    drawoffx += cu.drawWidth;
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
        return RUIDrawCall;
    }());
    exports.RUIDrawCall = RUIDrawCall;
});
define("rui/widget/UIButton", ["require", "exports", "rui/UIObject"], function (require, exports, UIObject_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIButton = /** @class */ (function (_super) {
        __extends(UIButton, _super);
        function UIButton(w, height) {
            var _this = _super.call(this) || this;
            _this.width = w;
            _this.height = height;
            return _this;
        }
        return UIButton;
    }(UIObject_2.UIObject));
    exports.UIButton = UIButton;
});
define("testui", ["require", "exports", "rui/UIObject", "rui/widget/UIButton"], function (require, exports, UIObject_3, UIButton_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TestUI = /** @class */ (function (_super) {
        __extends(TestUI, _super);
        function TestUI() {
            var _this = _super.call(this) || this;
            _this.isDrawn = false;
            return _this;
        }
        TestUI.prototype.onBuild = function (builder) {
            console.log("testui onbuild");
            builder.Start();
            builder.addChild(new UIButton_1.UIButton(100));
            builder.addChild(new UIButton_1.UIButton(200));
            builder.GroupBegin(false, 500);
            {
                builder.addChild(new UIButton_1.UIButton(50));
                builder.addChild(new UIButton_1.UIButton(200));
            }
            builder.GroupEnd();
            builder.End();
        };
        return TestUI;
    }(UIObject_3.UIObject));
    exports.TestUI = TestUI;
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
define("gl/wglrender", ["require", "exports", "gl/wglDrawCallBuffer", "gl/wglProgram", "gl/wglShaderLib", "rui/RUIFontTexture"], function (require, exports, wglDrawCallBuffer_1, wglProgram_1, wglShaderLib_1, RUIFontTexture_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MAX_RECT_COUNT = 512;
    var WGLRender = /** @class */ (function () {
        function WGLRender(wgl) {
            this.m_drawcallBuffer = null;
            this.m_indicesBuffer = null;
            this.m_projectParam = [0, 0, 0, 0];
            this.gl = wgl;
            RUIFontTexture_1.RUIFontTexture.Init();
            this.SetupWGL();
        }
        WGLRender.InitWidthCanvas = function (canvas) {
            var wgl = canvas.getContext('webgl');
            if (wgl == null) {
                throw new Error('get webgl context failed!');
            }
            var wglrender = new WGLRender(wgl);
            return wglrender;
        };
        WGLRender.InitWidthWGL = function (wgl) {
            var wglrender = new WGLRender(wgl);
            return wglrender;
        };
        WGLRender.prototype.SetupWGL = function () {
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
        WGLRender.prototype.Draw = function (drawcall) {
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
        return WGLRender;
    }());
    exports.WGLRender = WGLRender;
});
define("rui/RUICanvas", ["require", "exports", "rui/RUIDrawCall", "testui", "gl/wglrender", "rui/UIBuilder"], function (require, exports, RUIDrawCall_1, testui_1, wglrender_1, UIBuilder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUICanvas = /** @class */ (function () {
        function RUICanvas(canvas, UIClass) {
            this.m_valid = false;
            console.log('create rui canvas');
            this.m_canvas = canvas;
            this.m_gl = wglrender_1.WGLRender.InitWidthCanvas(canvas);
            this.m_drawcall = new RUIDrawCall_1.RUIDrawCall();
            this.m_rootUI = new testui_1.TestUI();
            if (this.m_gl) {
                this.m_valid = true;
            }
            this.OnBuild();
        }
        RUICanvas.prototype.OnBuild = function () {
            this.m_rootUI.onBuild(new UIBuilder_1.UIBuilder(this.m_rootUI, 800, 600));
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
define("rui/widget/UIFlex", ["require", "exports", "rui/UIObject"], function (require, exports, UIObject_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIFlex = /** @class */ (function (_super) {
        __extends(UIFlex, _super);
        function UIFlex() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return UIFlex;
    }(UIObject_4.UIObject));
    exports.UIFlex = UIFlex;
});
