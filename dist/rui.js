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
define("rui/RUIRoot", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIRoot = /** @class */ (function () {
        function RUIRoot(ui) {
            this.isdirty = true;
            if (ui.parent != null)
                throw new Error("root ui must have no parent.");
            this.root = ui;
            ui._root = this;
        }
        RUIRoot.prototype.resizeRoot = function (width, height) {
            this.isdirty = true;
            this.root.width = width;
            this.root.height = height;
        };
        return RUIRoot;
    }());
    exports.RUIRoot = RUIRoot;
});
define("rui/RUICmdList", ["require", "exports", "rui/RUIObject"], function (require, exports, RUIObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIDrawCmdType;
    (function (RUIDrawCmdType) {
        RUIDrawCmdType[RUIDrawCmdType["rect"] = 0] = "rect";
        RUIDrawCmdType[RUIDrawCmdType["text"] = 1] = "text";
        RUIDrawCmdType[RUIDrawCmdType["border"] = 2] = "border";
        RUIDrawCmdType[RUIDrawCmdType["line"] = 3] = "line";
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
        return RUIDrawCmd;
    }());
    exports.RUIDrawCmd = RUIDrawCmd;
    var RUICmdList = /** @class */ (function () {
        function RUICmdList() {
            this.drawList = [];
            this.MaxDrawCount = 1000;
            this.isDirty = false;
            this.m_clipStack = [];
            this.m_clipRect = null;
        }
        RUICmdList.prototype.draw = function (root) {
            this.drawList = [];
            this.m_clipStack = [];
            root.root.onDraw(this);
            this.isDirty = true;
        };
        RUICmdList.prototype.DrawRect = function (x, y, w, h) {
            var cmd = new RUIDrawCmd([x, y, w, h]);
            cmd.clip = this.m_clipRect;
            this.drawList.push();
        };
        RUICmdList.prototype.DrawRectWithColor = function (pos, color) {
            var cmd = new RUIDrawCmd(pos);
            cmd.clip = this.m_clipRect;
            cmd.Color = color;
            this.drawList.push(cmd);
        };
        RUICmdList.prototype.DrawText = function (text, clirect, color) {
            var cmd = RUIDrawCmd.CmdText(text, clirect, color);
            cmd.clip = this.m_clipRect;
            this.drawList.push(cmd);
        };
        RUICmdList.prototype.DrawBorder = function (rect, color) {
            var cmd = RUIDrawCmd.CmdBorder(rect, color);
            //cmd.clip = this.m_clipRect;
            this.drawList.push(cmd);
        };
        RUICmdList.prototype.DrawLine = function (x1, y1, x2, y2, color) {
            var cmd = RUIDrawCmd.CmdLine(x1, y1, x2, y2, color);
            cmd.clip = this.m_clipRect;
            this.drawList.push(cmd);
        };
        RUICmdList.prototype.PushClipRect = function (rect) {
            var clip = null;
            if (rect == null) {
                clip = RUIObject_1.RUICLIP_MAX;
            }
            else {
                clip = [rect[0], rect[1], rect[0] + rect[2], rect[1] + rect[3]];
            }
            this.m_clipStack.push(this.m_clipRect);
            this.m_clipRect = clip;
        };
        RUICmdList.prototype.PopClipRect = function () {
            this.m_clipRect = this.m_clipStack.pop();
            return this.m_clipRect;
        };
        return RUICmdList;
    }());
    exports.RUICmdList = RUICmdList;
});
define("rui/RUIObject", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RUIAuto = -1;
    exports.RUICLIP_MAX = [0, 0, 5000, 5000];
    function ROUND(x) {
        return Math.round(x);
    }
    exports.ROUND = ROUND;
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
            this._width = exports.RUIAuto;
            this._height = exports.RUIAuto;
            this.maxwidth = exports.RUIAuto;
            this.maxheight = exports.RUIAuto;
            this.minwidth = 70;
            this.minheight = 23;
            this.margin = [0, 0, 0, 0];
            // top right bottom left
            this.padding = [0, 0, 0, 0];
            this.position = RUIPosition.Default;
            this.left = 0;
            this.right = 0;
            this.top = 0;
            this.bottom = 0;
            this.visible = false;
            this.zorder = 0;
            this.parent = null;
            this.isdirty = true;
            this.isClip = true;
            this._caloffsetx = 0;
            this._caloffsety = 0;
            this._resized = true;
        }
        RUIObject.prototype.onBuild = function () {
        };
        RUIObject.prototype.onDraw = function (cmd) {
        };
        Object.defineProperty(RUIObject.prototype, "width", {
            get: function () {
                return this._width;
            },
            set: function (val) {
                this._width = val;
                this._resized = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUIObject.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (val) {
                this._height = val;
                this._resized = true;
            },
            enumerable: true,
            configurable: true
        });
        RUIObject.prototype.onLayout = function () {
            var isRoot = this.isRoot;
            if (!this._resized) {
                if (this._calwidth == null)
                    throw new Error();
                if (this._calheight == null)
                    throw new Error();
                return;
            }
            this.fillSize();
            this._resized = false;
        };
        Object.defineProperty(RUIObject.prototype, "isRoot", {
            get: function () {
                return this._root.root === this;
            },
            enumerable: true,
            configurable: true
        });
        RUIObject.prototype.setDirty = function () {
            this.isdirty = true;
            var root = this._root;
            if (root == null) {
                throw new Error("setDirty must be called in hierachied uiobject.");
            }
            root.isdirty = true;
        };
        RUIObject.prototype.fillSize = function () {
            this._calwidth = null;
            this._calheight = null;
            if (this._flexwidth != null)
                this._calwidth = this._flexwidth;
            if (this._flexheight != null)
                this._calheight = this._flexheight;
            if (this._calwidth == null) {
                if (this.width == exports.RUIAuto) {
                    if (this.parent == null) {
                        throw new Error();
                    }
                }
                else {
                    this._calwidth = this.width;
                }
            }
            if (this._calheight == null) {
                if (this.height == exports.RUIAuto) {
                    if (this.parent == null) {
                        throw new Error();
                    }
                }
                else {
                    this._calheight = this.height;
                }
            }
        };
        RUIObject.prototype.fillPositionOffset = function () {
            if (this.position == RUIPosition.Offset) {
                this._caloffsetx += this.left;
                this._caloffsety += this.top;
            }
        };
        return RUIObject;
    }());
    exports.RUIObject = RUIObject;
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
        UIUtil.ColorUNorm = function (r, g, b, a) {
            if (a === void 0) { a = 255; }
            return [r / 255.0, g / 255.0, b / 255.0, a / 255.0];
        };
        UIUtil.RectContains = function (rect, x, y) {
            if (x < rect[0] || y < rect[1])
                return false;
            if (x > (rect[0] + rect[2]) || y > (rect[1] + rect[3]))
                return false;
            return true;
        };
        UIUtil.RectClip = function (content, clip) {
            var x2 = content[0] + content[2];
            var y2 = confirm[1] + content[3];
            if (x2 < clip[0])
                return null;
            if (y2 < clip[1])
                return null;
            var cx2 = clip[0] + clip[2];
            var cy2 = clip[1] + clip[3];
            if (cx2 < content[0])
                return null;
            if (cy2 < confirm[1])
                return null;
            //TODO 
            throw new Error("not implemented!");
            return null;
        };
        UIUtil.RectMinus = function (recta, offset) {
            return [
                recta[0] - offset[0],
                recta[1] - offset[1],
                recta[2] - offset[2],
                recta[3] - offset[3]
            ];
        };
        return UIUtil;
    }());
    exports.UIUtil = UIUtil;
});
define("rui/RUIInput", ["require", "exports", "rui/RUIEventSys"], function (require, exports, RUIEventSys_1) {
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
    var RUIButton;
    (function (RUIButton) {
        RUIButton[RUIButton["Left"] = 0] = "Left";
        RUIButton[RUIButton["Middle"] = 1] = "Middle";
        RUIButton[RUIButton["Right"] = 2] = "Right";
    })(RUIButton = exports.RUIButton || (exports.RUIButton = {}));
    var RUIInput = /** @class */ (function () {
        function RUIInput(uicanvas) {
            this.m_activeMouseUI = null;
            this.m_activeMouseUIDrag = false;
            this.m_onMouseDown = false;
            this.m_target = uicanvas;
            this.EvtMouseEnter = new RUIEventSys_1.RUIEventEmitter();
            this.EvtMouseLeave = new RUIEventSys_1.RUIEventEmitter();
            this.RegisterEvent();
        }
        RUIInput.prototype.setActiveUI = function (ui) {
            var curActiveUI = this.m_activeMouseUI;
            if (ui == curActiveUI)
                return;
            if (curActiveUI != null) {
                curActiveUI.onInactive();
            }
            ui.onActive();
            this.m_activeMouseUI = ui;
        };
        RUIInput.prototype.RegisterEvent = function () {
            var c = this.m_target.canvas;
            var tar = this.m_target;
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
        RUIInput.prototype.onKeyboardEvent = function (e) {
            // let activeUI = this.m_target.activeUI;
            // if(activeUI != null) activeUI.onKeyPress(e);
        };
        RUIInput.prototype.onKeyboardDown = function (e) {
            // let activeUI = this.m_target.activeUI;
            // if(activeUI != null) activeUI.onKeyDown(e);
        };
        RUIInput.ProcessTextKeyPress = function (text, e) {
            return text + e.key;
        };
        RUIInput.ProcessTextKeyDown = function (text, e) {
            if (text == null || text.length == 0)
                return text;
            if (e.key == 'Backspace') {
                if (e.shiftKey) {
                    return '';
                }
                text = text.slice(0, text.length - 1);
            }
            return text;
        };
        return RUIInput;
    }());
    exports.RUIInput = RUIInput;
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
        RUIEvent.MOUSE_DRAG = "onMouseDrag";
        RUIEvent.MOUSE_DROP = "onMouseDrop";
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
    var RUIMouseDragEvent = /** @class */ (function (_super) {
        __extends(RUIMouseDragEvent, _super);
        function RUIMouseDragEvent(tar, type, x, y, dragEnd, canvas) {
            var _this = _super.call(this, tar, type, x, y, canvas) || this;
            _this.isDragEnd = false;
            _this.isDragEnd = dragEnd;
            return _this;
        }
        return RUIMouseDragEvent;
    }(RUIMouseEvent));
    exports.RUIMouseDragEvent = RUIMouseDragEvent;
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
        UIDisplayMode[UIDisplayMode["None"] = 2] = "None";
    })(UIDisplayMode = exports.UIDisplayMode || (exports.UIDisplayMode = {}));
    var UIOrientation;
    (function (UIOrientation) {
        UIOrientation[UIOrientation["Vertical"] = 0] = "Vertical";
        UIOrientation[UIOrientation["Horizontal"] = 1] = "Horizontal";
    })(UIOrientation = exports.UIOrientation || (exports.UIOrientation = {}));
    var UIAlign;
    (function (UIAlign) {
        UIAlign[UIAlign["Center"] = 0] = "Center";
        UIAlign[UIAlign["Left"] = 1] = "Left";
        UIAlign[UIAlign["Right"] = 2] = "Right";
    })(UIAlign = exports.UIAlign || (exports.UIAlign = {}));
    var UIPosition;
    (function (UIPosition) {
        UIPosition[UIPosition["Default"] = 0] = "Default";
        UIPosition[UIPosition["Relative"] = 1] = "Relative";
        UIPosition[UIPosition["Absolute"] = 2] = "Absolute";
    })(UIPosition = exports.UIPosition || (exports.UIPosition = {}));
    var UIObject = /** @class */ (function () {
        function UIObject() {
            this.parent = null;
            this.children = [];
            this.isDirty = true;
            this.visibleSelf = false;
            this.displayMode = UIDisplayMode.Default;
            this.orientation = UIOrientation.Vertical;
            this.color = RUIStyle_1.RUIStyle.Default.background0;
            this.width = null;
            this.height = null;
            this.zorder = 0;
            this.position = UIPosition.Default;
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
        UIObject.prototype.onMouseDrag = function (e) {
        };
        UIObject.prototype.onActive = function () { };
        UIObject.prototype.onInactive = function () { };
        UIObject.prototype.onDraw = function (cmd) {
        };
        UIObject.prototype.onDrawLate = function (cmd) {
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
define("rui/widget/UIInput", ["require", "exports", "rui/UIObject", "rui/RUIStyle", "rui/RUICursor", "rui/RUIInput"], function (require, exports, UIObject_1, RUIStyle_2, RUICursor_1, RUIInput_1) {
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
            this.visibleSelf = true;
        };
        UIInput.prototype.onActive = function () {
            this.m_isFocuesd = true;
            this.setColor();
            this.setDirty(true);
            //this._canvas.setActiveInputUI(this);
        };
        UIInput.prototype.onInactive = function () {
            this.m_isFocuesd = false;
            this.setColor();
            this.setDirty(true);
            //this._canvas.setInActiveInputUI(this);
        };
        UIInput.prototype.onKeyPress = function (e) {
            this.m_text = RUIInput_1.RUIInput.ProcessTextKeyPress(this.m_text, e);
            this.setDirty(true);
        };
        UIInput.prototype.onKeyDown = function (e) {
            this.m_text = RUIInput_1.RUIInput.ProcessTextKeyDown(this.m_text, e);
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
            this.Index = 0;
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
            this.m_maxCount = 0;
            this.m_curzorder = 0;
            this.m_curCount = 0;
            this.isDirty = true;
        }
        Object.defineProperty(RUIDrawCall.prototype, "MaxDrawCount", {
            get: function () {
                return this.m_maxCount;
            },
            enumerable: true,
            configurable: true
        });
        RUIDrawCall.prototype.Rebuild = function (ui, isResize) {
            if (isResize === void 0) { isResize = false; }
            this.m_maxCount = 0;
            this.m_curCount = 0;
            this.drawList = [];
            this.RebuildNode(ui);
            this.ExecNodesDisplay(ui, this.PostRebuild.bind(this), this.PostRebuildFinal.bind(this));
            ui.isDirty = false;
            this.isDirty = true;
        };
        RUIDrawCall.prototype.ExecNodes = function (uiobj, fpre, fpost) {
            fpre(uiobj);
            var c = uiobj.children;
            var cc = c.length;
            for (var i = 0; i < cc; i++) {
                var cu = c[i];
                this.ExecNodes(cu, fpre, fpost);
            }
            if (fpost)
                fpost(uiobj);
        };
        RUIDrawCall.prototype.ExecNodesDisplay = function (uiobj, fpre, fpost) {
            if (uiobj.displayMode == UIObject_2.UIDisplayMode.None) {
                return;
            }
            fpre(uiobj);
            var c = uiobj.children;
            var cc = c.length;
            for (var i = 0; i < cc; i++) {
                var cu = c[i];
                this.ExecNodesDisplay(cu, fpre, fpost);
            }
            if (fpost)
                fpost(uiobj);
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
            var floatingObject = [];
            for (var i = 0, len = clen; i < len; i++) {
                var c = children[i];
                if (c.displayMode == UIObject_2.UIDisplayMode.None)
                    continue;
                if (c.position != UIObject_2.UIPosition.Default) {
                    floatingObject.push(c);
                    continue;
                }
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
            //floating object
            for (var i = 0, len = floatingObject.length; i < len; i++) {
                var fui = floatingObject[i];
                this.RebuildFloatingUI(fui);
            }
        };
        RUIDrawCall.prototype.RebuildFloatingUI = function (fui) {
            var left = fui.floatLeft;
            var right = fui.floatRight;
            var top = fui.floatTop;
            var bottom = fui.floatBottom;
            var p = fui.parent;
            var isAbsolute = fui.position == UIObject_2.UIPosition.Absolute;
            var pwidth = p == null || isAbsolute ? fui._canvas.m_width : p._width;
            var pheight = p == null || isAbsolute ? fui._canvas.m_height : p._height;
            if (left != null && right != null) {
                if (fui.width == null) {
                    fui._width = (pwidth - left - right);
                }
            }
            if (bottom != null && top != null) {
                if (fui.height == null) {
                    fui._height = (pheight - top - bottom);
                }
            }
            this.RebuildNode(fui);
            if (left != null) {
                fui._offsetX = left;
            }
            else if (right != null) {
                fui._offsetX = pwidth - right - fui._width;
            }
            else {
                throw new Error("floating ui missing left/right property");
            }
            if (top != null) {
                fui._offsetY = top;
            }
            else if (bottom != null) {
                fui._offsetY = pheight - bottom - fui._height;
            }
            else {
                throw new Error("floating ui missing top/bottom property");
            }
        };
        //Pre process rect
        RUIDrawCall.prototype.RebuildNodeFlex = function (ui) {
            this.fillFlexSize(ui);
            //checkfor root
            var parent = ui.parent;
            if (parent == null) {
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
                else if (parent.orientation == UIObject_2.UIOrientation.Horizontal) {
                    ui._height = parent.height;
                }
                else {
                    console.error(ui);
                    throw new Error('flex proces error');
                }
            }
            if (ui._width == null) {
                if (ui.width != null) {
                    ui._width = ui.width;
                }
                else if (parent.orientation == UIObject_2.UIOrientation.Vertical) {
                    ui._width = parent._width;
                }
                else {
                    console.error(ui);
                    throw new Error('flex proces error');
                }
            }
            var fsizeTotal = isVertical ? ui._height : ui._width;
            var fsizeSecond = isVertical ? ui._width : ui._height;
            var children = ui.children;
            var clen = children.length;
            var flexCount = 0;
            var flexSize = 0;
            var floatingObject = [];
            //calculate size
            for (var i = 0; i < clen; i++) {
                var c = children[i];
                if (c.displayMode == UIObject_2.UIDisplayMode.None)
                    continue;
                if (c.position != UIObject_2.UIPosition.Default) {
                    floatingObject.push(c);
                    continue;
                }
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
            //floating object
            for (var i = 0, len = floatingObject.length; i < len; i++) {
                var fui = floatingObject[i];
                this.RebuildFloatingUI(fui);
            }
        };
        RUIDrawCall.prototype.PostRebuild = function (ui) {
            var p = ui.parent;
            var absolute = ui.position == UIObject_2.UIPosition.Absolute;
            if (p == null) {
                if (ui.position == UIObject_2.UIPosition.Default) {
                    ui._calculateX = 0;
                    ui._calculateY = 0;
                }
                else {
                    ui._calculateX = ui._offsetX;
                    ui._calculateY = ui._offsetY;
                }
                ui._level = 0;
            }
            else {
                if (absolute) {
                    ui._calculateX = ui._offsetX;
                    ui._calculateY = ui._offsetY;
                }
                else {
                    ui._calculateX = p._calculateX + ui._offsetX;
                    ui._calculateY = p._calculateY + ui._offsetY;
                }
                ui._level = p._level + 1;
            }
            if (ui.visibleSelf) {
                this.m_curzorder = ui.zorder * RUIDrawCall.LEVEL_OFFSET;
                ui.onDraw(this);
            }
        };
        RUIDrawCall.prototype.PostRebuildFinal = function (ui) {
            if (ui.visibleSelf) {
                this.m_curzorder = ui.zorder * RUIDrawCall.LEVEL_OFFSET;
                //ui.onDrawLate(this);
            }
        };
        RUIDrawCall.prototype.DrawRect = function (x, y, w, h) {
            var cmd = new DrawCmd([x, y, w, h]);
            cmd.Index = this.CalculateZOrder();
            this.drawList.push();
        };
        RUIDrawCall.prototype.DrawRectWithColor = function (pos, color) {
            var cmd = new DrawCmd(pos);
            cmd.Color = color;
            cmd.Index = this.CalculateZOrder();
            this.drawList.push(cmd);
        };
        RUIDrawCall.prototype.DrawText = function (text, clirect, color) {
            var cmd = DrawCmd.CmdText(text, clirect, color);
            cmd.Index = this.CalculateZOrder();
            this.drawList.push(cmd);
        };
        RUIDrawCall.prototype.DrawBorder = function (rect, color) {
            var cmd = DrawCmd.CmdBorder(rect, color);
            cmd.Index = this.CalculateZOrder();
            this.drawList.push(cmd);
        };
        RUIDrawCall.prototype.DrawLine = function (x1, y1, x2, y2, color) {
            var cmd = DrawCmd.CmdLine(x1, y1, x2, y2, color);
            cmd.Index = this.CalculateZOrder();
            this.drawList.push(cmd);
        };
        RUIDrawCall.prototype.CalculateZOrder = function () {
            var index = this.m_curzorder + this.m_curCount;
            this.m_curCount++;
            this.m_maxCount = Math.max(this.m_maxCount, index);
            return index;
        };
        RUIDrawCall.LEVEL_OFFSET = 1000;
        RUIDrawCall.LAYER_DEFAULT = 0;
        RUIDrawCall.LAYER_OVERLAY = 5;
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
            this.visibleSelf = true;
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
            var l = this.label;
            if (l == null)
                l = "Button";
            drawcall.DrawText(l, rect, null);
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
            this.visibleSelf = true;
        };
        UIRect.prototype.onDraw = function (drawcall) {
            var rect = [this._calculateX, this._calculateY, this._width, this._height];
            drawcall.DrawRectWithColor(rect, this.color);
        };
        return UIRect;
    }(UIObject_4.UIObject));
    exports.UIRect = UIRect;
});
define("rui/widget/UISlider", ["require", "exports", "rui/UIObject", "rui/RUIStyle"], function (require, exports, UIObject_5, RUIStyle_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UISlider = /** @class */ (function (_super) {
        __extends(UISlider, _super);
        function UISlider(value) {
            var _this = _super.call(this) || this;
            _this.m_value = 0;
            _this.m_onDrag = false;
            _this.m_value = value < 0 ? 0 : (value > 1.0 ? 1.0 : value);
            _this.height = 23;
            return _this;
        }
        Object.defineProperty(UISlider.prototype, "value", {
            get: function () {
                return this.m_value;
            },
            enumerable: true,
            configurable: true
        });
        UISlider.prototype.onBuild = function () {
            this.visibleSelf = true;
        };
        UISlider.prototype.onMouseClick = function (e) {
            var value = (e.mousex - this._calculateX) / this._width;
            this.m_value = this.clampValue(value);
            this.setDirty(true);
            e.prevent();
        };
        UISlider.prototype.onMouseDrag = function (e) {
            var value = (e.mousex - this._calculateX) / this._width;
            this.m_value = this.clampValue(value);
            this.m_onDrag = !e.isDragEnd;
            this.setDirty(true);
            e.prevent();
        };
        UISlider.prototype.calculateValue = function (mouse) {
            return (mouse - this._calculateX - UISlider.OFFSET) / (this._width - UISlider.OFFSET * 2);
        };
        UISlider.prototype.clampValue = function (value) {
            return value < 0 ? 0 : (value > 1.0 ? 1.0 : value);
        };
        UISlider.prototype.onDraw = function (cmd) {
            var rect = [this._calculateX + UISlider.OFFSET, this._calculateY + UISlider.OFFSET, this._width - 2 * UISlider.OFFSET, this._height - 2 * UISlider.OFFSET];
            cmd.DrawRectWithColor(rect, RUIStyle_4.RUIStyle.Default.background1);
            var width = rect[2] * this.m_value;
            var srect = [rect[0], rect[1], width, rect[3]];
            cmd.DrawRectWithColor(srect, this.m_onDrag ? RUIStyle_4.RUIStyle.Default.primary : RUIStyle_4.RUIStyle.Default.inactive);
        };
        UISlider.OFFSET = 2;
        return UISlider;
    }(UIObject_5.UIObject));
    exports.UISlider = UISlider;
});
define("rui/widget/UILabel", ["require", "exports", "rui/UIObject"], function (require, exports, UIObject_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UILable = /** @class */ (function (_super) {
        __extends(UILable, _super);
        function UILable(label) {
            var _this = _super.call(this) || this;
            _this.m_label = label;
            return _this;
        }
        UILable.prototype.onBuild = function () {
            this.visibleSelf = true;
        };
        UILable.prototype.onDraw = function (cmd) {
            var rect = [this._calculateX, this._calculateY, this._width, this._height];
            var l = this.m_label;
            if (l != null && l != '') {
                cmd.DrawText(l, rect);
            }
        };
        return UILable;
    }(UIObject_6.UIObject));
    exports.UILable = UILable;
});
define("rui/widget/UICheckbox", ["require", "exports", "rui/UIObject", "rui/RUIStyle", "rui/UIUtil"], function (require, exports, UIObject_7, RUIStyle_5, UIUtil_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UICheckbox = /** @class */ (function (_super) {
        __extends(UICheckbox, _super);
        function UICheckbox(checked, align) {
            var _this = _super.call(this) || this;
            _this.m_checked = false;
            _this.m_align = UIObject_7.UIAlign.Center;
            _this.m_active = false;
            if (checked != null) {
                _this.m_checked = checked;
            }
            if (align != null) {
                _this.m_align = align;
            }
            return _this;
        }
        UICheckbox.prototype.onBuild = function () {
            this.height = 23;
            this.visibleSelf = true;
        };
        UICheckbox.prototype.onMouseClick = function (e) {
            if (UIUtil_2.UIUtil.RectContains(this.m_rectOuter, e.mousex, e.mousey)) {
                this.m_checked = !this.m_checked;
                this.setDirty(true);
            }
        };
        UICheckbox.prototype.onActive = function () {
            this.m_active = true;
        };
        UICheckbox.prototype.onInactive = function () {
            this.m_active = false;
            this.setDirty(true);
        };
        UICheckbox.prototype.onDraw = function (cmd) {
            var offsetx = 3;
            if (this.m_align == UIObject_7.UIAlign.Center) {
                offsetx = (this._width - UICheckbox.BoxSize) / 2;
            }
            else if (this.m_align == UIObject_7.UIAlign.Right) {
                offsetx = this._width - 3 - UICheckbox.BoxSize;
            }
            var offsety = (this._height - UICheckbox.BoxSize) / 2;
            var rectOuter = [this._calculateX + offsetx, this._calculateY + offsety, UICheckbox.BoxSize, UICheckbox.BoxSize];
            this.m_rectOuter = rectOuter;
            cmd.DrawBorder(rectOuter, RUIStyle_5.RUIStyle.Default.inactive);
            if (this.m_checked) {
                var rectInner = [rectOuter[0] + 2, rectOuter[1] + 2, rectOuter[2] - 4, rectOuter[3] - 4];
                cmd.DrawRectWithColor(rectInner, this.m_active ? RUIStyle_5.RUIStyle.Default.primary : RUIStyle_5.RUIStyle.Default.primary0);
            }
        };
        UICheckbox.BoxSize = 16;
        return UICheckbox;
    }(UIObject_7.UIObject));
    exports.UICheckbox = UICheckbox;
});
define("rui/widget/UIField", ["require", "exports", "rui/UIObject", "rui/RUIFontTexture", "rui/widget/UIInput", "rui/widget/UILabel", "rui/widget/UISlider", "rui/widget/UICheckbox"], function (require, exports, UIObject_8, RUIFontTexture_1, UIInput_1, UILabel_1, UISlider_1, UICheckbox_1) {
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
            this.visibleSelf = true;
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
                labelsize = RUIFontTexture_1.RUIFontTexture.ASIICTexture.MeasureTextWith(label);
                labelsize = Math.min(labelsize + 10, Math.max(150, totalWidth * 0.5));
                var labelRect = [rect[0], rect[1], labelsize, rect[3]];
                cmd.DrawText(label, labelRect);
            }
        };
        return UIField;
    }(UIObject_8.UIObject));
    exports.UIField = UIField;
    var UIInputField = /** @class */ (function (_super) {
        __extends(UIInputField, _super);
        function UIInputField(label, value) {
            if (value === void 0) { value = ''; }
            var _this = _super.call(this) || this;
            _this.m_input = new UIInput_1.UIInput(value);
            _this.m_label = new UILabel_1.UILable(label);
            return _this;
        }
        UIInputField.prototype.onBuild = function () {
            this.displayMode = UIObject_8.UIDisplayMode.Flex;
            this.orientation = UIObject_8.UIOrientation.Horizontal;
            this.height = 23;
            this.m_label.width = 100;
            this.m_input.flex = 1;
            this.addChild(this.m_label);
            this.addChild(this.m_input);
        };
        return UIInputField;
    }(UIObject_8.UIObject));
    exports.UIInputField = UIInputField;
    var UICheckboxField = /** @class */ (function (_super) {
        __extends(UICheckboxField, _super);
        function UICheckboxField(label, checked) {
            var _this = _super.call(this) || this;
            _this.m_label = new UILabel_1.UILable(label);
            _this.m_checkbox = new UICheckbox_1.UICheckbox(checked);
            return _this;
        }
        UICheckboxField.prototype.onBuild = function () {
            this.height = 23;
            this.displayMode = UIObject_8.UIDisplayMode.Flex;
            this.orientation = UIObject_8.UIOrientation.Horizontal;
            this.m_label.width = 100;
            this.m_checkbox.flex = 1;
            this.addChild(this.m_label);
            this.addChild(this.m_checkbox);
        };
        return UICheckboxField;
    }(UIObject_8.UIObject));
    exports.UICheckboxField = UICheckboxField;
    var UISliderFiled = /** @class */ (function (_super) {
        __extends(UISliderFiled, _super);
        function UISliderFiled(label, value, min, max) {
            if (min === void 0) { min = 0.0; }
            if (max === void 0) { max = 1.0; }
            var _this = _super.call(this) || this;
            _this.m_label = new UILabel_1.UILable(label);
            _this.m_max = max;
            _this.m_min = min;
            var sval = (value - min) / (max - min);
            _this.m_slider = new UISlider_1.UISlider(sval);
            return _this;
        }
        UISliderFiled.prototype.onBuild = function () {
            this.displayMode = UIObject_8.UIDisplayMode.Flex;
            this.orientation = UIObject_8.UIOrientation.Horizontal;
            this.height = 23;
            this.m_label.width = 100;
            this.m_slider.flex = 1;
            this.addChild(this.m_label);
            this.addChild(this.m_slider);
        };
        return UISliderFiled;
    }(UIObject_8.UIObject));
    exports.UISliderFiled = UISliderFiled;
});
define("rui/RUIColor", ["require", "exports", "rui/UIUtil"], function (require, exports, UIUtil_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIColor = /** @class */ (function () {
        function RUIColor() {
        }
        RUIColor.White = [1, 1, 1, 0];
        RUIColor.Grey = UIUtil_3.UIUtil.ColorUNorm(200, 200, 200, 255);
        return RUIColor;
    }());
    exports.RUIColor = RUIColor;
});
define("rui/widget/UIContextMenu", ["require", "exports", "rui/UIObject", "rui/RUIDrawCall", "rui/RUIStyle", "rui/widget/UIButton"], function (require, exports, UIObject_9, RUIDrawCall_1, RUIStyle_6, UIButton_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIContextMenu = /** @class */ (function (_super) {
        __extends(UIContextMenu, _super);
        function UIContextMenu(items) {
            var _this = _super.call(this) || this;
            _this.m_isshow = false;
            if (items)
                _this.setMenuItems(items);
            return _this;
        }
        UIContextMenu.prototype.onBuild = function () {
            this.visibleSelf = false;
            this.position = UIObject_9.UIPosition.Absolute;
            this.floatLeft = 0;
            this.floatTop = 0;
            this.zorder = RUIDrawCall_1.RUIDrawCall.LAYER_OVERLAY;
            this.displayMode = UIObject_9.UIDisplayMode.None;
        };
        UIContextMenu.prototype.onActive = function () {
        };
        UIContextMenu.prototype.onInactive = function () {
            this.m_isshow = false;
            this.visibleSelf = false;
            this.displayMode = UIObject_9.UIDisplayMode.None;
            this.setDirty(true);
        };
        UIContextMenu.prototype.setMenuItems = function (items) {
            this.children = [];
            var _loop_1 = function (key) {
                if (items.hasOwnProperty(key)) {
                    var item_1 = items[key];
                    var btn = new UIButton_1.UIButton(key);
                    if (item_1 != null)
                        btn.EvtMouseClick.on(function (f) { return item_1(); });
                    this_1.addChild(btn);
                }
            };
            var this_1 = this;
            for (var key in items) {
                _loop_1(key);
            }
            this.setDirty(true);
        };
        UIContextMenu.prototype.show = function (e) {
            this.m_isshow = true;
            this.m_attatchUI = e;
            this.floatLeft = e._calculateX;
            this.floatTop = e._calculateY + e._height;
            this.visibleSelf = true;
            this.displayMode = UIObject_9.UIDisplayMode.Default;
            //this._canvas.setActiveUI(this);
            this.setDirty(true);
        };
        UIContextMenu.prototype.onDraw = function (cmd) {
            if (this.m_isshow) {
                var attui = this.m_attatchUI;
                var rect = [this._calculateX, this._calculateY, this._width, this._height];
                cmd.DrawBorder(rect, RUIStyle_6.RUIStyle.Default.primary0);
            }
        };
        return UIContextMenu;
    }(UIObject_9.UIObject));
    exports.UIContextMenu = UIContextMenu;
});
define("rui/DebugUI", ["require", "exports", "rui/UIObject", "rui/widget/UIButton", "rui/RUIStyle", "rui/widget/UIField", "rui/RUIColor", "rui/widget/UIContextMenu"], function (require, exports, UIObject_10, UIButton_2, RUIStyle_7, UIField_1, RUIColor_1, UIContextMenu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HeaderUI = /** @class */ (function (_super) {
        __extends(HeaderUI, _super);
        function HeaderUI() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.btnNew = new UIButton_2.UIButton("New");
            _this.btnOpen = new UIButton_2.UIButton("Open");
            return _this;
        }
        HeaderUI.prototype.onBuild = function () {
            this.visibleSelf = false;
            this.displayMode = UIObject_10.UIDisplayMode.Flex;
            this.orientation = UIObject_10.UIOrientation.Horizontal;
            this.addChild(this.btnNew);
            this.addChild(this.btnOpen);
        };
        HeaderUI.prototype.onDraw = function (cmd) {
        };
        return HeaderUI;
    }(UIObject_10.UIObject));
    exports.HeaderUI = HeaderUI;
    var EditorUI = /** @class */ (function (_super) {
        __extends(EditorUI, _super);
        function EditorUI() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EditorUI.prototype.onBuild = function () {
            this.visibleSelf = true;
            this.color = RUIStyle_7.RUIStyle.Default.background1;
            this.addChild(new UIButton_2.UIButton('Clear'));
            this.addChild(new UIField_1.UIInputField("Hello"));
            this.addChild(new UIField_1.UISliderFiled("Count", 20, 10, 100));
            this.addChild(new UIField_1.UICheckboxField("Enable", true));
            //this.addChild(new FloatingUI());
            var btnCtxMenu = new UIButton_2.UIButton('context menu');
            var ctxMenu = new UIContextMenu_1.UIContextMenu({
                "A": function () { return console.log("A"); },
                "B": function () { return console.log("B"); },
            });
            btnCtxMenu.EvtMouseClick.on(function (e) {
                var m = ctxMenu;
                var b = btnCtxMenu;
                m.show(b);
            });
            this.addChild(btnCtxMenu);
            this.addChild(ctxMenu);
        };
        EditorUI.prototype.onDraw = function (cmd) {
            var rect = [this._calculateX, this._calculateY, this._width, this._height];
            cmd.DrawRectWithColor(rect, this.color);
        };
        return EditorUI;
    }(UIObject_10.UIObject));
    exports.EditorUI = EditorUI;
    var FloatingUI = /** @class */ (function (_super) {
        __extends(FloatingUI, _super);
        function FloatingUI() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FloatingUI.prototype.onBuild = function () {
            this.visibleSelf = true;
            this.position = UIObject_10.UIPosition.Relative;
            this.floatRight = 20;
            this.floatTop = 50;
            this.height = 50;
            this.width = 50;
            this.zorder = 1;
        };
        FloatingUI.prototype.onDraw = function (cmd) {
            var rect = [this._calculateX, this._calculateY, this._width, this._height];
            cmd.DrawRectWithColor(rect, RUIColor_1.RUIColor.Grey);
        };
        return FloatingUI;
    }(UIObject_10.UIObject));
    exports.FloatingUI = FloatingUI;
    var DebugUI = /** @class */ (function (_super) {
        __extends(DebugUI, _super);
        function DebugUI() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DebugUI.prototype.onBuild = function () {
            this.visibleSelf = true;
            this.displayMode = UIObject_10.UIDisplayMode.Flex;
            var header = new HeaderUI();
            header.height = 23;
            this.m_header = header;
            this.addChild(header);
            var main = new UIObject_10.UIDiv();
            main.flex = 1;
            main.displayMode = UIObject_10.UIDisplayMode.Flex;
            main.orientation = UIObject_10.UIOrientation.Horizontal;
            this.addChild(main);
            var editorui = new EditorUI();
            editorui.flex = 2;
            main.addChild(editorui);
            this.m_editor = editorui;
            var x = new UIObject_10.UIObject();
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
    }(UIObject_10.UIObject));
    exports.DebugUI = DebugUI;
});
define("gl/wglShaderLib", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GLSL_FRAG_COLOR = '#version 300 es\nprecision lowp float;\n\nin vec4 vColor;\n\nout vec4 fragColor;\n\nvoid main(){\nfragColor = vColor;\n}';
    exports.GLSL_VERT_DEF = '#version 300 es\nprecision mediump float;\nin vec3 aPosition;\nin vec4 aColor;\nin vec4 aClip;\n\nuniform vec4 uProj;\nout vec4 vColor;\n\nvoid main(){\nvec2 pos =aPosition.xy;\npos = clamp(pos,aClip.xy,aClip.zw);\npos = pos * uProj.xy;\npos.y = 2.0 - pos.y;\npos.xy -=1.0;\ngl_Position = vec4(pos,aPosition.z,1);\nvColor = aColor;\n}';
    exports.GLSL_FRAG_TEXT = '#version 300 es\nprecision lowp float;\n\nin vec4 vColor;\nin vec2 vUV;\n\nuniform sampler2D uSampler;\n\nout vec4 fragColor;\n\nvoid main(){\nfragColor = texture(uSampler,vUV);\n}';
    exports.GLSL_VERT_TEXT = '#version 300 es\nprecision mediump float;\nin vec3 aPosition;\nin vec4 aColor;\nin vec2 aUV;\nin vec4 aClip;\n\nuniform vec4 uProj;\nout vec4 vColor;\nout vec2 vUV;\n\nvoid main(){\nvec2 pos = aPosition.xy;\npos = clamp(pos,aClip.xy,aClip.zw);\npos = pos * uProj.xy;\npos.y = 2.0 - pos.y;\npos.xy -=1.0;\ngl_Position = vec4(pos,aPosition.z,1);\nvColor = aColor;\nvUV =aUV;\n}';
});
define("rui/RUIDrawCallBuffer", ["require", "exports", "gl/wglShaderLib", "rui/RUIFontTexture", "rui/RUIColor", "rui/RUICmdList"], function (require, exports, wglShaderLib_1, RUIFontTexture_2, RUIColor_2, RUICmdList_1) {
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
            this.m_aryBufferRectClip = new RUIArrayBufferF32(Float32Array);
            this.m_aryBufferTextPos = new RUIArrayBufferF32(Float32Array);
            this.m_aryBufferTextUV = new RUIArrayBufferF32(Float32Array);
            this.m_aryBufferTextClip = new RUIArrayBufferF32(Float32Array);
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
        }
        RUIDrawCallBuffer.prototype.SyncBuffer = function (gl) {
            this.isDirty = true;
            var drawcall = this.m_drawcall;
            var drawlist = drawcall.drawList;
            var fonttex = RUIFontTexture_2.RUIFontTexture.ASIICTexture;
            if (drawlist.length == 0) {
                return;
            }
            else {
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
                for (var i = 0, cmdlen = drawlist.length; i < cmdlen; i++) {
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
                                    color = RUIColor_2.RUIColor.Grey;
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
                                clip = cmd.Rect;
                                clip[2] += clip[0];
                                clip[3] += clip[1];
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
                                        text_vert.push([x, drawy, d, drawx1, drawy, d, drawx1, drawy1, d, x, drawy1, d]);
                                        text_uv.push(glyph.uv);
                                        text_clip.push(clip);
                                        text_clip.push(clip);
                                        text_clip.push(clip);
                                        text_clip.push(clip);
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
            }
        };
        return RUIDrawCallBuffer;
    }());
    exports.RUIDrawCallBuffer = RUIDrawCallBuffer;
});
define("rui/RUIRenderer", ["require", "exports", "wglut", "rui/RUIDrawCallBuffer", "rui/RUIFontTexture", "rui/RUIStyle"], function (require, exports, wglut_1, RUIDrawCallBuffer_1, RUIFontTexture_3, RUIStyle_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIRenderer = /** @class */ (function () {
        function RUIRenderer(uicanvas) {
            this.m_drawcallBuffer = null;
            this.m_indicesBuffer = null;
            this.m_projectParam = [0, 0, 0, 0];
            this.m_isvalid = false;
            this.m_isResized = false;
            this.m_uicanvas = uicanvas;
            this.glctx = wglut_1.GLContext.createFromCanvas(uicanvas.canvas);
            if (!this.glctx) {
                return;
            }
            this.m_isvalid = true;
            this.gl = this.glctx.gl;
            RUIFontTexture_3.RUIFontTexture.Init(this.glctx);
            this.SetupGL();
            var canvas = uicanvas.canvas;
            this.resizeCanvas(window.innerWidth, window.innerHeight);
        }
        RUIRenderer.prototype.resizeCanvas = function (w, h) {
            this.gl.canvas.width = w;
            this.gl.canvas.height = h;
            //this.m_uicanvas.setSize(w,h);
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
            gl.enable(gl.DEPTH_TEST);
            gl.depthMask(true);
            gl.depthFunc(gl.LEQUAL);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            var clearColor = RUIStyle_8.RUIStyle.Default.background0;
            gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
        };
        RUIRenderer.prototype.DrawCmdList = function (cmdlist) {
            if (cmdlist == null)
                return;
            if (this.m_drawcallBuffer == null) {
                this.m_drawcallBuffer = new RUIDrawCallBuffer_1.RUIDrawCallBuffer(this.glctx, cmdlist);
            }
            var fonttex = RUIFontTexture_3.RUIFontTexture.ASIICTexture;
            if (cmdlist.isDirty || fonttex.isDirty) {
                this.m_drawcallBuffer.SyncBuffer(this.gl);
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
        RUIRenderer.prototype.Draw = function (drawcall) {
            // if(drawcall == null) return;
            // if(this.m_drawcallBuffer == null){
            //     this.m_drawcallBuffer = new RUIDrawCallBuffer(this.glctx,drawcall);
            // }
            // let fonttex = RUIFontTexture.ASIICTexture;
            // if(drawcall.isDirty ||fonttex.isDirty){
            //     this.m_drawcallBuffer.SyncBuffer(this.gl);
            //     drawcall.isDirty = false;
            //     fonttex.isDirty= false;
            // }
            // //do draw
            // let drawbuffer:RUIDrawCallBuffer = this.m_drawcallBuffer;
            // if(!drawbuffer.isDirty) return;
            // drawbuffer.isDirty = false;
            // let gl = this.gl;
            // gl.clear(gl.COLOR_BUFFER_BIT);
            // //draw drawcall buffer
            // let drawRectCount = drawbuffer.drawCountRect;
            // if(drawRectCount>0){
            //     let programRect : GLProgram |any = drawbuffer.programRect;
            //     gl.useProgram(programRect.Program);
            //     gl.uniform4fv(programRect.uProj,this.m_projectParam);
            //     gl.bindVertexArray(this.m_drawcallBuffer.vaoRect);
            //     gl.drawElements(gl.TRIANGLES,drawRectCount*6,gl.UNSIGNED_SHORT,0);
            // }
            // let drawTextCount = drawbuffer.drawCountText;
            // if(drawTextCount > 0){
            //     if(fonttex.isTextureValid){
            //         let programText: GLProgram|any = drawbuffer.programText;
            //         gl.useProgram(programText.Program);
            //         gl.uniform4fv(programText.uProj,this.m_projectParam);
            //         gl.activeTexture(gl.TEXTURE0);
            //         gl.bindTexture(gl.TEXTURE_2D,fonttex.m_glTexture);
            //         gl.uniform1i(programText.uSampler,0);
            //         gl.bindVertexArray(drawbuffer.vaoText);
            //         gl.drawElements(gl.TRIANGLES,drawTextCount *6, gl.UNSIGNED_SHORT,0)
            //     }
            //     else{
            //         drawbuffer.isDirty = true;
            //     }
            // }
        };
        return RUIRenderer;
    }());
    exports.RUIRenderer = RUIRenderer;
});
define("rui/RUICanvas", ["require", "exports", "rui/RUIInput", "rui/RUICursor", "rui/RUIRenderer", "rui/RUIEventSys"], function (require, exports, RUIInput_2, RUICursor_3, RUIRenderer_1, RUIEventSys_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUICanvas = /** @class */ (function () {
        function RUICanvas(canvas) {
            this.m_isResized = false;
            this.EventOnResize = new RUIEventSys_3.RUIEventEmitter();
            this.m_canvas = canvas;
            this.m_renderer = new RUIRenderer_1.RUIRenderer(this);
            this.m_input = new RUIInput_2.RUIInput(this);
            this.m_cursor = new RUICursor_3.RUICursor(this);
            this.registerEvent();
        }
        RUICanvas.prototype.registerEvent = function () {
            //disable context menu
            var ruicanvas = this;
            this.m_canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); return false; });
            window.addEventListener('resize', function () {
                ruicanvas.onResizeCanvas(window.innerWidth, window.innerHeight);
            });
        };
        RUICanvas.prototype.onResizeCanvas = function (width, height) {
            this.m_renderer.resizeCanvas(width, height);
        };
        Object.defineProperty(RUICanvas.prototype, "canvas", {
            get: function () {
                return this.m_canvas;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUICanvas.prototype, "renderer", {
            get: function () {
                return this.m_renderer;
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
        Object.defineProperty(RUICanvas.prototype, "canvasRect", {
            get: function () {
                return [0, 0, this.m_width, this.m_height];
            },
            enumerable: true,
            configurable: true
        });
        return RUICanvas;
    }());
    exports.RUICanvas = RUICanvas;
});
define("rui/RUIContainer", ["require", "exports", "rui/RUIObject", "rui/RUIStyle", "rui/UIUtil"], function (require, exports, RUIObject_2, RUIStyle_9, UIUtil_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIContainer = /** @class */ (function (_super) {
        __extends(RUIContainer, _super);
        function RUIContainer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.boxClip = true;
            _this.boxOverflow = RUIObject_2.RUIOverflow.Clip;
            _this.boxOrientation = RUIObject_2.RUIOrientation.Vertical;
            _this.children = [];
            return _this;
        }
        RUIContainer.prototype.addChild = function (ui) {
            if (ui == null)
                return;
            var c = this.children;
            if (c.indexOf(ui) >= 0)
                return;
            ui.parent = this;
            ui._root = this._root;
            c.push(ui);
            ui.setDirty();
        };
        RUIContainer.prototype.removeChild = function (ui) {
            if (ui == null)
                return;
            var c = this.children;
            var index = c.indexOf(ui);
            if (index < 0)
                return;
            this.children = c.splice(index, 1);
            this.isdirty = true;
            ui.parent = null;
            ui._root = null;
        };
        RUIContainer.prototype.onLayout = function () {
            var isVertical = this.boxOrientation == RUIObject_2.RUIOrientation.Vertical;
            var children = this.children;
            var offset = 0;
            var maxsize = 0;
            var offsetside = 0;
            //padding
            var padding = this.padding;
            offset += padding[isVertical ? RUIObject_2.RUIConst.TOP : RUIObject_2.RUIConst.LEFT];
            offsetside = padding[isVertical ? RUIObject_2.RUIConst.LEFT : RUIObject_2.RUIConst.TOP];
            //margin
            var marginLast = 0;
            if (children.length != 0) {
                for (var i = 0, len = children.length; i < len; i++) {
                    var c = children[i];
                    c.onLayout();
                    var cw = c._calwidth;
                    var ch = c._calheight;
                    if (cw == null)
                        throw new Error("children width is null");
                    if (ch == null)
                        throw new Error("children height is null");
                    var cmargin = c.margin;
                    if (isVertical) {
                        marginLast = Math.max(marginLast, cmargin[RUIObject_2.RUIConst.TOP]);
                        c._caloffsety = offset + marginLast;
                        c._caloffsetx = offsetside + cmargin[RUIObject_2.RUIConst.LEFT];
                        offset += ch + marginLast;
                        marginLast = cmargin[RUIObject_2.RUIConst.BOTTOM];
                        maxsize = Math.max(maxsize, cw + cmargin[RUIObject_2.RUIConst.LEFT] + cmargin[RUIObject_2.RUIConst.RIGHT]);
                    }
                    else {
                        marginLast = Math.max(marginLast, cmargin[RUIObject_2.RUIConst.LEFT]);
                        c._caloffsetx = offset + marginLast;
                        c._caloffsety = offsetside + cmargin[RUIObject_2.RUIConst.TOP];
                        offset += cw + marginLast;
                        marginLast = cmargin[RUIObject_2.RUIConst.RIGHT];
                        maxsize = Math.max(maxsize, ch + cmargin[RUIObject_2.RUIConst.TOP] + cmargin[RUIObject_2.RUIConst.BOTTOM]);
                    }
                    c.fillPositionOffset();
                }
                offset += marginLast;
            }
            else {
            }
            if (isVertical) {
                this._calwidth = maxsize + padding[RUIObject_2.RUIConst.RIGHT] + padding[RUIObject_2.RUIConst.LEFT];
                this._calheight = offset + padding[RUIObject_2.RUIConst.BOTTOM];
            }
            else {
                this._calheight = maxsize + padding[RUIObject_2.RUIConst.BOTTOM] + padding[RUIObject_2.RUIConst.TOP];
                this._calwidth = offset + padding[RUIObject_2.RUIConst.RIGHT];
            }
            if (this.width != RUIObject_2.RUIAuto)
                this._calwidth = this.width;
            if (this.height != RUIObject_2.RUIAuto)
                this._calheight = this.height;
        };
        RUIContainer.prototype.onDraw = function (cmd) {
            this.onDrawPre(cmd);
            var children = this.children;
            for (var i = 0, clen = children.length; i < clen; i++) {
                var c = children[i];
                c.onDraw(cmd);
            }
            this.onDrawPost(cmd);
        };
        RUIContainer.prototype.onDrawPre = function (cmd) {
            var rect = [this._calx, this._caly, this._calwidth, this._calheight];
            this._rect = rect;
            cmd.DrawBorder(rect, RUIStyle_9.RUIStyle.Default.primary);
            if (this.boxClip)
                cmd.PushClipRect(UIUtil_4.UIUtil.RectMinus(rect, this.padding));
        };
        RUIContainer.prototype.onDrawPost = function (cmd) {
            if (this.boxClip)
                cmd.PopClipRect();
        };
        return RUIContainer;
    }(RUIObject_2.RUIObject));
    exports.RUIContainer = RUIContainer;
});
define("rui/RUIFlexContainer", ["require", "exports", "rui/RUIObject", "rui/RUIContainer"], function (require, exports, RUIObject_3, RUIContainer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIFlexContainer = /** @class */ (function (_super) {
        __extends(RUIFlexContainer, _super);
        function RUIFlexContainer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RUIFlexContainer.prototype.onLayout = function () {
            var isVertical = this.boxOrientation == RUIObject_3.RUIOrientation.Vertical;
            var children = this.children;
            this.fillSize();
            if (null == (isVertical ? this._calheight : this._calwidth))
                throw new Error();
            var clen = children.length;
            if (clen != 0) {
                //accumulate flex
                var flexaccu = 0;
                var fixedaccu = 0;
                var contentTotal = 0;
                var contentSide = 0;
                var contentwidth = contentTotal = this._calwidth - this.padding[RUIObject_3.RUIConst.LEFT] - this.padding[RUIObject_3.RUIConst.RIGHT];
                var contentheight = this._calheight - this.padding[RUIObject_3.RUIConst.TOP] - this.padding[RUIObject_3.RUIConst.BOTTOM];
                var sideIsAuto = false;
                if (isVertical) {
                    contentTotal = contentheight;
                    contentSide = contentwidth;
                    sideIsAuto = this._calwidth == null;
                }
                else {
                    contentTotal = contentwidth;
                    contentSide = contentheight;
                    sideIsAuto = this._calheight == null;
                }
                var childMaxSide = RUIObject_3.RUIAuto;
                var marginAry = [];
                var marginValue = 0;
                var marginPos = isVertical ? RUIObject_3.RUIConst.TOP : RUIObject_3.RUIConst.LEFT;
                var marginPosSide = isVertical ? RUIObject_3.RUIConst.BOTTOM : RUIObject_3.RUIConst.RIGHT;
                var marginTotal = 0;
                for (var i = 0; i < clen; i++) {
                    var c = children[i];
                    if (c.flex == null) {
                        var cfixed = isVertical ? c.height : c.width;
                        if (cfixed == RUIObject_3.RUIAuto) {
                            throw new Error("flex object must have fixed size");
                        }
                        else {
                            fixedaccu += cfixed;
                        }
                    }
                    else {
                        flexaccu += c.flex;
                    }
                    var cmargin = c.margin;
                    var cmarginValue = cmargin[marginPos];
                    marginValue = Math.max(marginValue, cmarginValue);
                    marginAry.push(marginValue);
                    marginTotal += marginValue;
                    marginValue = cmargin[marginPosSide];
                    var cmaxside = 0;
                    if (isVertical) {
                        cmaxside = c.width + cmargin[RUIObject_3.RUIConst.LEFT] + cmargin[RUIObject_3.RUIConst.RIGHT];
                    }
                    else {
                        cmaxside = c.height + cmargin[RUIObject_3.RUIConst.TOP] + cmargin[RUIObject_3.RUIConst.BOTTOM];
                    }
                    childMaxSide = Math.max(childMaxSide, cmaxside);
                }
                marginAry.push(marginValue);
                marginTotal += marginValue;
                var sizePerFlex = (contentTotal - fixedaccu - marginTotal) / flexaccu;
                var offset = this.padding[isVertical ? RUIObject_3.RUIConst.TOP : RUIObject_3.RUIConst.LEFT];
                var offsetside = this.padding[isVertical ? RUIObject_3.RUIConst.LEFT : RUIObject_3.RUIConst.TOP];
                if (childMaxSide != RUIObject_3.RUIAuto && sideIsAuto) {
                    contentSide = childMaxSide;
                    if (isVertical) {
                        this._calwidth = childMaxSide + this.padding[RUIObject_3.RUIConst.LEFT] + this.padding[RUIObject_3.RUIConst.RIGHT];
                    }
                    else {
                        this._calheight = childMaxSide + this.padding[RUIObject_3.RUIConst.TOP] + this.padding[RUIObject_3.RUIConst.BOTTOM];
                    }
                }
                for (var i = 0; i < clen; i++) {
                    var c = children[i];
                    var flowsize = c.flex == null ? (isVertical ? c.height : c.width) : RUIObject_3.ROUND(c.flex * sizePerFlex);
                    if (isVertical) {
                        c._flexheight = flowsize;
                        c._flexwidth = (c.width == RUIObject_3.RUIAuto) ? contentSide : c.width;
                    }
                    else {
                        c._flexheight = (c.height == RUIObject_3.RUIAuto) ? contentSide : c.height;
                        c._flexwidth = flowsize;
                    }
                    c.onLayout();
                    offset += marginAry[i];
                    if (isVertical) {
                        c._caloffsety = offset;
                        c._caloffsetx = offsetside + c.margin[RUIObject_3.RUIConst.LEFT];
                        offset += c._calheight;
                    }
                    else {
                        c._caloffsety = offsetside + c.margin[RUIObject_3.RUIConst.TOP];
                        c._caloffsetx = offset;
                        offset += c._calwidth;
                    }
                    //offset
                    c.fillPositionOffset();
                }
            }
        };
        return RUIFlexContainer;
    }(RUIContainer_1.RUIContainer));
    exports.RUIFlexContainer = RUIFlexContainer;
});
define("rui/RUILayouter", ["require", "exports", "rui/RUIContainer", "rui/RUIObject"], function (require, exports, RUIContainer_2, RUIObject_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUILayouter = /** @class */ (function () {
        function RUILayouter() {
        }
        RUILayouter.prototype.build = function (uiroot) {
            var isdirty = uiroot.isdirty;
            if (!isdirty)
                return;
            //Layout
            var ui = uiroot.root;
            ui.onLayout();
            uiroot.isdirty = false;
            ui._calx = 0;
            ui._caly = 0;
            //Calculate All offset
            if (ui instanceof RUIContainer_2.RUIContainer) {
                this.calculateOffset(ui);
            }
            console.log(ui);
        };
        RUILayouter.prototype.calculateOffset = function (cui) {
            var children = cui.children;
            var clen = children.length;
            var isVertical = cui.boxOrientation == RUIObject_4.RUIOrientation.Vertical;
            if (clen > 0) {
                var offx = cui._calx;
                var offy = cui._caly;
                for (var i = 0; i < clen; i++) {
                    var c = children[i];
                    c._calx = offx + c._caloffsetx;
                    c._caly = offy + c._caloffsety;
                    if (c instanceof RUIContainer_2.RUIContainer) {
                        this.calculateOffset(c);
                    }
                }
            }
        };
        return RUILayouter;
    }());
    exports.RUILayouter = RUILayouter;
});
define("rui/RUIRectangle", ["require", "exports", "rui/RUIObject", "rui/UIUtil"], function (require, exports, RUIObject_5, UIUtil_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIRectangle = /** @class */ (function (_super) {
        __extends(RUIRectangle, _super);
        function RUIRectangle() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RUIRectangle.prototype.onDraw = function (cmd) {
            var noclip = !this.isClip;
            if (noclip)
                cmd.PushClipRect();
            var rect = [this._calx, this._caly, this._calwidth, this._calheight];
            cmd.DrawRectWithColor(rect, UIUtil_5.UIUtil.RandomColor());
            if (noclip)
                cmd.PopClipRect();
        };
        return RUIRectangle;
    }(RUIObject_5.RUIObject));
    exports.RUIRectangle = RUIRectangle;
});
define("rui/RUITest", ["require", "exports", "rui/RUICanvas", "rui/RUICmdList", "rui/RUIFlexContainer", "rui/RUIRoot", "rui/RUIObject", "rui/RUIContainer", "rui/RUILayouter", "rui/RUIRectangle"], function (require, exports, RUICanvas_1, RUICmdList_2, RUIFlexContainer_1, RUIRoot_1, RUIObject_6, RUIContainer_3, RUILayouter_1, RUIRectangle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUITest = /** @class */ (function () {
        function RUITest(canvas) {
            this.m_ruicanvas = new RUICanvas_1.RUICanvas(canvas);
            this.buildUI();
        }
        RUITest.prototype.buildUI = function () {
            this.m_ruicmdlist = new RUICmdList_2.RUICmdList();
            this.m_ruilayouter = new RUILayouter_1.RUILayouter();
            var ui = new RUIContainer_3.RUIContainer();
            ui.padding = [5, 5, 5, 5];
            var root = new RUIRoot_1.RUIRoot(ui);
            root.root = ui;
            {
                var rect1 = new RUIRectangle_1.RUIRectangle();
                rect1.width = 100;
                rect1.height = 100;
                ui.addChild(rect1);
                var container1 = new RUIContainer_3.RUIContainer();
                container1.boxOrientation = RUIObject_6.RUIOrientation.Horizontal;
                //container1.padding = [10,10,10,5];
                container1.margin = [10, 0, 5, 0];
                container1.width = 150;
                ui.addChild(container1);
                {
                    var rectc1 = new RUIRectangle_1.RUIRectangle();
                    rectc1.width = 70;
                    rectc1.height = 30;
                    rectc1.margin[3] = 20;
                    rectc1.margin[1] = 20;
                    container1.addChild(rectc1);
                    var rectc2 = new RUIRectangle_1.RUIRectangle();
                    rectc2.width = 130;
                    rectc2.height = 50;
                    rectc2.position = RUIObject_6.RUIPosition.Offset;
                    rectc2.left = 20;
                    rectc2.top = -20;
                    rectc2.margin[3] = 25;
                    rectc2.isClip = false;
                    container1.addChild(rectc2);
                }
                {
                    var container2 = new RUIFlexContainer_1.RUIFlexContainer();
                    container2.width = 200;
                    container2.padding = [5, 5, 5, 5];
                    container2.height = 100;
                    container2.boxOrientation = RUIObject_6.RUIOrientation.Horizontal;
                    ui.addChild(container2);
                    var rectfc1 = new RUIRectangle_1.RUIRectangle();
                    rectfc1.flex = 1;
                    rectfc1.margin = [10, 2, 5, 3];
                    container2.addChild(rectfc1);
                    rectfc1.height = 30;
                    var rectfc2 = new RUIRectangle_1.RUIRectangle();
                    rectfc2.width = 50;
                    container2.addChild(rectfc2);
                    rectfc2.margin[1] = 7;
                    var rectfc3 = new RUIRectangle_1.RUIRectangle();
                    rectfc3.height = 100;
                    rectfc3.flex = 2;
                    rectfc3.margin[0] = 70;
                    rectfc3.margin[1] = 5;
                    container2.addChild(rectfc3);
                    {
                        var container3 = new RUIFlexContainer_1.RUIFlexContainer();
                        container3.boxOrientation = RUIObject_6.RUIOrientation.Vertical;
                        container3.flex = 1;
                        container3.position = RUIObject_6.RUIPosition.Offset;
                        container3.left = 20;
                        container2.addChild(container3);
                        console.log(container3);
                        var rfc1 = new RUIRectangle_1.RUIRectangle();
                        rfc1.flex = 1;
                        container3.addChild(rfc1);
                        var rfc2 = new RUIRectangle_1.RUIRectangle();
                        rfc2.flex = 2;
                        container3.addChild(rfc2);
                    }
                }
                var rect2 = new RUIRectangle_1.RUIRectangle();
                rect2.width = 50;
                rect2.height = 30;
                ui.addChild(rect2);
            }
            this.m_ruiroot = root;
        };
        RUITest.prototype.OnFrame = function (ts) {
            var uiroot = this.m_ruiroot;
            if (uiroot.isdirty) {
                this.m_ruilayouter.build(uiroot);
                this.m_ruicmdlist.draw(uiroot);
                console.log(this.m_ruicmdlist);
                this.m_ruicanvas.renderer.DrawCmdList(this.m_ruicmdlist);
            }
        };
        return RUITest;
    }());
    exports.RUITest = RUITest;
});
define("rui", ["require", "exports", "rui/RUICanvas", "rui/RUITest"], function (require, exports, RUICanvas_2, RUITest_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(RUICanvas_2);
    __export(RUITest_1);
});
define("rui/RUIQTree", ["require", "exports"], function (require, exports) {
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
});
// export class RUIQTree{
//     private m_ui :UIObject;
//     private m_tar:RUICanvas;
//     constructor(canvas:RUICanvas){
//         this.m_tar = canvas;
//         this.m_ui = canvas.rootui;
//     }
//     public DispatchEvtMouseEvent(e:MouseEvent,type:string): UIObject{
//         let x = e.offsetX;
//         let y = e.offsetY;
//         let target = this.TraversalTree(x,y);
//         if(target == null) return null;
//         let re = new RUIMouseEvent(target,type,x,y);
//         re.button = <RUIButton>e.button;
//         target[type].call(target,re);
//         return target;
//     }
//     private m_listHovered: UIObject[] = [];
//     public DispatchEvtMouseMove(x:number,y:number){
//         let curlist = this.TraversalNormalAll(x,y);
//         let hovlist= this.m_listHovered;
//         for(var i=hovlist.length-1;i>=0;i--){
//             let c= hovlist[i];
//             if(curlist.indexOf(c) == -1){
//                 c.onMouseLeave(new RUIEvent(c,RUIEvent.MOUSE_LEAVE,this.m_tar));
//                 hovlist.splice(i,1);
//             }
//         }
//         for(var i=0,len = curlist.length;i<len;i++){
//             let c = curlist[i];
//             if(hovlist.indexOf(c)>=0) continue;
//             c.onMouseEnter(new RUIEvent(c,RUIEvent.MOUSE_ENTER,this.m_tar));
//             hovlist.push(c);
//         }
//     }
//     public TraversalTree(x:number,y:number) : UIObject{
//         return this.TraversalNoraml(x,y);
//     }
//     private TraversalNormalAll(x:number,y:number):UIObject[]{
//         var list:UIObject[] = [];
//         this.m_ui.execRecursive((ui)=>{
//             if(ui.rectContains(x,y)){
//                 list.push(ui);
//             }
//         })
//         return list;
//     }
//     private TraversalNoraml(x:number,y:number):UIObject{
//         var tarNode: UIObject = null;
//         this.m_ui.execRecursive((ui)=>{
//             if(ui.rectContains(x,y)){
//                 if(tarNode == null){
//                     tarNode = ui;
//                 }
//                 else{
//                     if(ui._level >= tarNode._level) tarNode = ui;
//                 }
//             }
//         });
//         return tarNode;
//     }
//     private TraversalQuadTree(x:number,y:number):UIObject{
//         throw new Error('not implemented.');
//     }
// }
define("rui/widget/UICanvas", ["require", "exports", "rui/UIObject"], function (require, exports, UIObject_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UICanvas = /** @class */ (function (_super) {
        __extends(UICanvas, _super);
        function UICanvas() {
            return _super.call(this) || this;
        }
        return UICanvas;
    }(UIObject_11.UIObject));
    exports.UICanvas = UICanvas;
});
