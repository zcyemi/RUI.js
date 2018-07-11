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
define("rui/UILayout", ["require", "exports", "rui/UIObject"], function (require, exports, UIObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LayoutType;
    (function (LayoutType) {
        LayoutType[LayoutType["DEFAULT"] = 0] = "DEFAULT";
        LayoutType[LayoutType["FLEX_HOR"] = 1] = "FLEX_HOR";
        LayoutType[LayoutType["FLEX_VER"] = 2] = "FLEX_VER";
    })(LayoutType = exports.LayoutType || (exports.LayoutType = {}));
    var UILayout = /** @class */ (function (_super) {
        __extends(UILayout, _super);
        function UILayout() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return UILayout;
    }(UIObject_1.UIObject));
    exports.UILayout = UILayout;
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
define("rui/FlexLayout", ["require", "exports", "rui/UILayout"], function (require, exports, UILayout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FlexLayout = /** @class */ (function (_super) {
        __extends(FlexLayout, _super);
        function FlexLayout(isVertical) {
            if (isVertical === void 0) { isVertical = false; }
            return _super.call(this) || this;
        }
        FlexLayout.prototype.addChildFixed = function (ui, size) {
            this.children.push(ui);
        };
        FlexLayout.prototype.addChildFlex = function (ui, flex) {
            this.children.push(ui);
        };
        return FlexLayout;
    }(UILayout_1.UILayout));
    exports.FlexLayout = FlexLayout;
});
define("rui/UIBuilder", ["require", "exports", "rui/FlexLayout", "rui/UILayout"], function (require, exports, FlexLayout_1, UILayout_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIBuilder = /** @class */ (function () {
        function UIBuilder(ui) {
            this.m_stackUI = [];
            this.m_stackLayout = [];
            this.m_layoutType = UILayout_2.LayoutType.DEFAULT;
            this.m_root = ui;
            this.m_list = ui.children;
            this.m_ui = ui;
            this.m_layoutType = UILayout_2.LayoutType.DEFAULT;
        }
        UIBuilder.prototype.addChild = function (ui) {
            this.m_list.push(ui);
        };
        UIBuilder.prototype.flexStart = function (isVertical) {
            if (isVertical === void 0) { isVertical = false; }
            this.m_stackUI.push(this.m_root);
            this.m_stackLayout.push(this.m_layoutType);
            var flex = new FlexLayout_1.FlexLayout(isVertical);
            this.m_ui = flex;
            this.m_layoutType = isVertical ? UILayout_2.LayoutType.FLEX_VER : UILayout_2.LayoutType.FLEX_HOR;
            this.m_list.push(flex);
            this.m_list = flex.children;
        };
        UIBuilder.prototype.flexChildFixed = function (ui, size) {
            this.m_ui.addChildFixed(ui, size);
        };
        UIBuilder.prototype.flexChildFlex = function (ui, flex) {
            this.m_ui.addChildFlex(ui, flex);
        };
        UIBuilder.prototype.flexEnd = function () {
            this.m_ui = this.m_stackUI.pop();
            this.m_layoutType = this.m_stackLayout.pop();
            this.m_list = this.m_ui.children;
        };
        return UIBuilder;
    }());
    exports.UIBuilder = UIBuilder;
});
define("rui/UIObject", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIObject = /** @class */ (function () {
        function UIObject() {
            this.isDirty = false;
            this.extra = {};
            this.children = [];
        }
        UIObject.prototype.onBuild = function (builder) {
        };
        return UIObject;
    }());
    exports.UIObject = UIObject;
});
define("rui/RUIDrawCall", ["require", "exports"], function (require, exports) {
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
            this.RebuildFlow(ui);
            ui.isDirty = false;
        };
        RUIDrawCall.prototype.RebuildFlow = function (ui) {
            // if(flow == null) return;
            // let nodes = flow.nodes;
            // var offsetX :number = 0;
            // var offsetY : number = 0;
            // var maxWidth: number = 0;
            // var maxHeight: number =0;
            // for(var i=0;i< nodes.length;i++){
            //     let node = nodes[i];
            //     switch(node.type){
            //         case FlowNodeType.START:
            //         {
            //             let ui = node.ui;
            //             let uil = ui.layout;
            //             this.DrawRectWithColor([offsetX,offsetY,uil.width,uil.height],ui.style.color);
            //         }
            //         break;
            //         case FlowNodeType.CHILD:
            //         {
            //             let ui = node.ui;
            //             this.DrawRectWithColor([offsetX,offsetY,ui.layout.width,ui.layout.height],ui.style.color);
            //             offsetY += ui.layout.height;
            //         }
            //         break;
            //     }
            // }
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
define("rui/UIView", ["require", "exports", "rui/UIObject"], function (require, exports, UIObject_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIView = /** @class */ (function (_super) {
        __extends(UIView, _super);
        function UIView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.width = 50;
            _this.height = 23;
            return _this;
        }
        return UIView;
    }(UIObject_2.UIObject));
    exports.UIView = UIView;
});
define("rui/UIButton", ["require", "exports", "rui/UIUtil", "rui/UIView"], function (require, exports, UIUtil_1, UIView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIButton = /** @class */ (function (_super) {
        __extends(UIButton, _super);
        function UIButton() {
            var _this = _super.call(this) || this;
            _this.color = UIUtil_1.UIUtil.RandomColor();
            return _this;
        }
        return UIButton;
    }(UIView_1.UIView));
    exports.UIButton = UIButton;
});
define("rui/UIDocument", ["require", "exports", "rui/UIView"], function (require, exports, UIView_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIDocument = /** @class */ (function (_super) {
        __extends(UIDocument, _super);
        function UIDocument() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return UIDocument;
    }(UIView_2.UIView));
    exports.UIDocument = UIDocument;
});
define("testui", ["require", "exports", "rui/UIButton", "rui/UIDocument"], function (require, exports, UIButton_1, UIDocument_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TestUI = /** @class */ (function (_super) {
        __extends(TestUI, _super);
        function TestUI() {
            var _this = _super.call(this) || this;
            _this.width = 800;
            _this.height = 600;
            return _this;
        }
        TestUI.prototype.onBuild = function (builder) {
            console.log("testui onbuild");
            builder.flexStart(true);
            builder.flexChildFlex(new UIButton_1.UIButton(), 1);
            builder.flexChildFixed(new UIButton_1.UIButton(), 100);
            builder.flexChildFlex(new UIButton_1.UIButton(), 1);
            builder.flexEnd();
        };
        return TestUI;
    }(UIDocument_1.UIDocument));
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
            gl.clearColor(0, 0, 0, 1);
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
            this.m_rootUI.onBuild(new UIBuilder_1.UIBuilder(this.m_rootUI));
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
