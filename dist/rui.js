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
define("rui/RUI", ["require", "exports"], function (require, exports) {
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
    var RUI = /** @class */ (function () {
        function RUI() {
        }
        RUI.RectClip = function (content, clip) {
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
        RUI.RectClipP = function (content, clip) {
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
        RUI.toRect = function (rect) {
            return [rect[0], rect[1], rect[2] - rect[0], rect[3] - rect[1]];
        };
        RUI.Vector = function (v) {
            return [v, v, v, v];
        };
        RUI.ColorUNorm = function (r, g, b, a) {
            if (a === void 0) { a = 255; }
            return [r / 255.0, g / 255.0, b / 255.0, a / 255.0];
        };
        RUI.RandomColor = function () {
            return [Math.random(), Math.random(), Math.random(), 1.0];
        };
        RUI.RectContains = function (rect, x, y) {
            if (x < rect[0] || y < rect[1])
                return false;
            if (x > (rect[0] + rect[2]) || y > (rect[1] + rect[3]))
                return false;
            return true;
        };
        RUI.RED = [1, 0, 0, 1];
        RUI.BLACK = [0, 0, 0, 1];
        RUI.WHITE = [1, 1, 1, 1];
        RUI.GREY = RUI.ColorUNorm(200, 200, 200, 255);
        return RUI;
    }());
    exports.RUI = RUI;
});
define("rui/RUICmdList", ["require", "exports", "rui/RUIObject", "rui/RUI"], function (require, exports, RUIObject_1, RUI_1) {
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
            this.m_clipRectP = null;
            this.m_clipRect = null;
        }
        Object.defineProperty(RUICmdList.prototype, "clipRect", {
            get: function () {
                return this.m_clipRect;
            },
            enumerable: true,
            configurable: true
        });
        RUICmdList.prototype.draw = function (root) {
            this.drawList = [];
            this.m_clipStack = [];
            var rootrect = root.rootRect;
            this.m_clipRectP = rootrect == null ? RUIObject_1.RUICLIP_MAX : rootrect;
            this.m_clipRect = RUI_1.RUI.toRect(this.m_clipRectP);
            root.root.onDraw(this);
            this.isDirty = true;
        };
        RUICmdList.prototype.DrawRect = function (x, y, w, h) {
            var cmd = new RUIDrawCmd([x, y, w, h]);
            cmd.clip = this.m_clipRectP;
            this.drawList.push();
        };
        RUICmdList.prototype.DrawRectWithColor = function (pos, color) {
            var cmd = new RUIDrawCmd(pos);
            cmd.clip = this.m_clipRectP;
            cmd.Color = color;
            this.drawList.push(cmd);
        };
        RUICmdList.prototype.DrawText = function (text, clirect, color) {
            var clip = clirect.slice(0);
            clip[2] += clip[0];
            clip[3] += clip[1];
            clip = RUI_1.RUI.RectClipP(clip, this.m_clipRectP);
            if (clip != null) {
                var cmd = RUIDrawCmd.CmdText(text, clirect, color);
                cmd.clip = clip;
                if (text === 'A')
                    console.log("A>>" + this.m_clipRectP);
                this.drawList.push(cmd);
            }
            else {
                throw new Error();
            }
            //this.DrawBorder(clirect,RUIColor.Red);
        };
        RUICmdList.prototype.DrawBorder = function (rect, color) {
            var cmd = RUIDrawCmd.CmdBorder(rect, color);
            cmd.clip = this.m_clipRectP;
            this.drawList.push(cmd);
        };
        RUICmdList.prototype.DrawLine = function (x1, y1, x2, y2, color) {
            var cmd = RUIDrawCmd.CmdLine(x1, y1, x2, y2, color);
            cmd.clip = this.m_clipRectP;
            this.drawList.push(cmd);
        };
        RUICmdList.prototype.PushClipRect = function (rect, nested) {
            var clip = null;
            if (rect == null) {
                clip = RUIObject_1.RUICLIP_MAX;
            }
            else {
                clip = [rect[0], rect[1], rect[0] + rect[2], rect[1] + rect[3]];
            }
            if (nested == true && this.m_clipRectP != null) {
                clip = RUI_1.RUI.RectClipP(clip, this.m_clipRectP);
                if (clip == null) {
                    throw new Error();
                }
            }
            this.m_clipStack.push(this.m_clipRectP);
            this.m_clipRectP = clip;
            this.m_clipRect = RUI_1.RUI.toRect(clip);
        };
        RUICmdList.prototype.PopClipRect = function () {
            this.m_clipRectP = this.m_clipStack.pop();
            this.m_clipRect = RUI_1.RUI.toRect(this.m_clipRectP);
            return this.m_clipRectP;
        };
        return RUICmdList;
    }());
    exports.RUICmdList = RUICmdList;
});
define("rui/RUIStyle", ["require", "exports", "rui/RUI"], function (require, exports, RUI_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIStyle = /** @class */ (function () {
        function RUIStyle() {
            this.background0 = RUI_2.RUI.ColorUNorm(30, 30, 30, 255);
            this.background1 = RUI_2.RUI.ColorUNorm(37, 37, 38);
            this.background2 = RUI_2.RUI.ColorUNorm(51, 51, 51);
            this.primary = RUI_2.RUI.ColorUNorm(0, 122, 204);
            this.primary0 = RUI_2.RUI.ColorUNorm(9, 71, 113);
            this.inactive = RUI_2.RUI.ColorUNorm(63, 63, 70);
            this.border0 = RUI_2.RUI.ColorUNorm(3, 3, 3);
        }
        RUIStyle.Default = new RUIStyle();
        return RUIStyle;
    }());
    exports.RUIStyle = RUIStyle;
});
define("rui/RUIFlexContainer", ["require", "exports", "rui/RUIObject", "rui/RUIContainer"], function (require, exports, RUIObject_2, RUIContainer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIFlexContainer = /** @class */ (function (_super) {
        __extends(RUIFlexContainer, _super);
        function RUIFlexContainer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RUIFlexContainer.prototype.onLayout = function () {
            var isVertical = this.boxOrientation == RUIObject_2.RUIOrientation.Vertical;
            var children = this.children;
            var clen = children.length;
            //check for dirty
            var updateMode = this.containerUpdateCheck();
            if (updateMode == RUIContainer_1.RUIContainerUpdateMode.None)
                return;
            if (updateMode == RUIContainer_1.RUIContainerUpdateMode.LayoutUpdate) {
                for (var i = 0; i < clen; i++) {
                    children[i].onLayout();
                }
                return;
            }
            this.fillSize();
            if (null == (isVertical ? this._calheight : this._calwidth))
                throw new Error();
            if (clen != 0) {
                //accumulate flex
                var flexaccu = 0;
                var fixedaccu = 0;
                var contentTotal = 0;
                var contentSide = 0;
                var contentwidth = contentTotal = this._calwidth - this.padding[RUIObject_2.RUIConst.LEFT] - this.padding[RUIObject_2.RUIConst.RIGHT];
                var contentheight = this._calheight - this.padding[RUIObject_2.RUIConst.TOP] - this.padding[RUIObject_2.RUIConst.BOTTOM];
                var sideIsAuto = false;
                if (isVertical) {
                    contentTotal = contentheight;
                    contentSide = contentwidth;
                    sideIsAuto = this._calwidth == null;
                }
                else {
                    contentTotal = contentwidth;
                    contentSide = contentheight;
                    sideIsAuto = this._calheight == null || this._calheight == RUIObject_2.RUIAuto;
                }
                var childMaxSide = RUIObject_2.RUIAuto;
                var marginAry = [];
                var marginValue = 0;
                var marginPos = isVertical ? RUIObject_2.RUIConst.TOP : RUIObject_2.RUIConst.LEFT;
                var marginPosSide = isVertical ? RUIObject_2.RUIConst.BOTTOM : RUIObject_2.RUIConst.RIGHT;
                var marginTotal = 0;
                var relativeChildren = [];
                for (var i = 0; i < clen; i++) {
                    var c = children[i];
                    if (!c.isOnFlow) {
                        relativeChildren.push(c);
                        continue;
                    }
                    if (c.flex == null) {
                        var cfixed = isVertical ? c.height : c.width;
                        if (cfixed == RUIObject_2.RUIAuto) {
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
                        cmaxside = c.width + cmargin[RUIObject_2.RUIConst.LEFT] + cmargin[RUIObject_2.RUIConst.RIGHT];
                    }
                    else {
                        cmaxside = c.height + cmargin[RUIObject_2.RUIConst.TOP] + cmargin[RUIObject_2.RUIConst.BOTTOM];
                    }
                    childMaxSide = Math.max(childMaxSide, cmaxside);
                }
                marginAry.push(marginValue);
                marginTotal += marginValue;
                var sizePerFlex = (contentTotal - fixedaccu - marginTotal) / flexaccu;
                var offset = this.padding[isVertical ? RUIObject_2.RUIConst.TOP : RUIObject_2.RUIConst.LEFT];
                var offsetside = this.padding[isVertical ? RUIObject_2.RUIConst.LEFT : RUIObject_2.RUIConst.TOP];
                if (childMaxSide != RUIObject_2.RUIAuto && sideIsAuto) {
                    contentSide = childMaxSide;
                    if (isVertical) {
                        this._calwidth = childMaxSide + this.padding[RUIObject_2.RUIConst.LEFT] + this.padding[RUIObject_2.RUIConst.RIGHT];
                    }
                    else {
                        this._calheight = childMaxSide + this.padding[RUIObject_2.RUIConst.TOP] + this.padding[RUIObject_2.RUIConst.BOTTOM];
                    }
                }
                for (var i = 0; i < clen; i++) {
                    var c = children[i];
                    if (!c.isOnFlow)
                        continue;
                    var flowsize = c.flex == null ? (isVertical ? c.height : c.width) : RUIObject_2.ROUND(c.flex * sizePerFlex);
                    if (isVertical) {
                        c._flexheight = flowsize;
                        c._flexwidth = (c.width == RUIObject_2.RUIAuto) ? contentSide : c.width;
                    }
                    else {
                        c._flexheight = (c.height == RUIObject_2.RUIAuto) ? contentSide : c.height;
                        c._flexwidth = flowsize;
                    }
                    c.onLayout();
                    offset += marginAry[i];
                    if (isVertical) {
                        c._caloffsety = offset;
                        c._caloffsetx = offsetside + c.margin[RUIObject_2.RUIConst.LEFT];
                        offset += c._calheight;
                    }
                    else {
                        c._caloffsety = offsetside + c.margin[RUIObject_2.RUIConst.TOP];
                        c._caloffsetx = offset;
                        offset += c._calwidth;
                    }
                    //offset
                    c.fillPositionOffset();
                }
                this.onLayoutRelativeUI(relativeChildren);
            }
            this.isdirty = false;
            this._resized = false;
        };
        return RUIFlexContainer;
    }(RUIContainer_1.RUIContainer));
    exports.RUIFlexContainer = RUIFlexContainer;
});
define("rui/RUIContainer", ["require", "exports", "rui/RUIObject", "rui/RUI"], function (require, exports, RUIObject_3, RUI_3) {
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
        function RUIContainer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.boxClip = RUIContainerClipType.Clip;
            _this.boxOverflow = RUIObject_3.RUIOverflow.Clip;
            _this.boxOrientation = RUIObject_3.RUIOrientation.Vertical;
            _this.boxBorder = null;
            _this.children = [];
            /** mark execute for children ui of @function traversal */
            _this.skipChildTraversal = false;
            return _this;
        }
        RUIContainer.prototype.onBuild = function () {
        };
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
        RUIContainer.prototype.onLayout = function () {
            var isVertical = this.boxOrientation == RUIObject_3.RUIOrientation.Vertical;
            var children = this.children;
            //check for dirty
            var updateMode = this.containerUpdateCheck();
            if (updateMode == RUIContainerUpdateMode.None)
                return;
            if (updateMode == RUIContainerUpdateMode.LayoutUpdate) {
                for (var i = 0, clen = children.length; i < clen; i++) {
                    children[i].onLayout();
                }
                return;
            }
            var offset = 0;
            var maxsize = 0;
            var offsetside = 0;
            //padding
            var padding = this.padding;
            offset += padding[isVertical ? RUIObject_3.RUIConst.TOP : RUIObject_3.RUIConst.LEFT];
            offsetside = padding[isVertical ? RUIObject_3.RUIConst.LEFT : RUIObject_3.RUIConst.TOP];
            //margin
            var marginLast = 0;
            var relativeChildren = [];
            if (children.length != 0) {
                for (var i = 0, len = children.length; i < len; i++) {
                    var c = children[i];
                    if (c.isOnFlow == false) {
                        relativeChildren.push(c);
                        continue;
                    }
                    c.onLayout();
                    var cw = c._calwidth;
                    var ch = c._calheight;
                    if (cw == null) {
                        console.error(c);
                        throw new Error("children width is null");
                    }
                    if (ch == null) {
                        console.error(c);
                        throw new Error("children height is null");
                    }
                    var cmargin = c.margin;
                    if (isVertical) {
                        marginLast = Math.max(marginLast, cmargin[RUIObject_3.RUIConst.TOP]);
                        c._caloffsety = offset + marginLast;
                        c._caloffsetx = offsetside + cmargin[RUIObject_3.RUIConst.LEFT];
                        offset += ch + marginLast;
                        marginLast = cmargin[RUIObject_3.RUIConst.BOTTOM];
                        maxsize = Math.max(maxsize, cw + cmargin[RUIObject_3.RUIConst.LEFT] + cmargin[RUIObject_3.RUIConst.RIGHT]);
                    }
                    else {
                        marginLast = Math.max(marginLast, cmargin[RUIObject_3.RUIConst.LEFT]);
                        c._caloffsetx = offset + marginLast;
                        c._caloffsety = offsetside + cmargin[RUIObject_3.RUIConst.TOP];
                        offset += cw + marginLast;
                        marginLast = cmargin[RUIObject_3.RUIConst.RIGHT];
                        maxsize = Math.max(maxsize, ch + cmargin[RUIObject_3.RUIConst.TOP] + cmargin[RUIObject_3.RUIConst.BOTTOM]);
                    }
                    c.fillPositionOffset();
                }
                offset += marginLast;
            }
            else {
            }
            var isRelative = (this.position == RUIObject_3.RUIPosition.Relative || this.position == RUIObject_3.RUIPosition.Absolute);
            if (!isRelative) {
                if (isVertical) {
                    this._calwidth = maxsize + padding[RUIObject_3.RUIConst.RIGHT] + padding[RUIObject_3.RUIConst.LEFT];
                    this._calheight = offset + padding[RUIObject_3.RUIConst.BOTTOM];
                }
                else {
                    this._calheight = maxsize + padding[RUIObject_3.RUIConst.BOTTOM] + padding[RUIObject_3.RUIConst.TOP];
                    this._calwidth = offset + padding[RUIObject_3.RUIConst.RIGHT];
                }
                if (this.width != RUIObject_3.RUIAuto)
                    this._calwidth = this.width;
                if (this.height != RUIObject_3.RUIAuto)
                    this._calheight = this.height;
            }
            //process relative children
            this.onLayoutRelativeUI(relativeChildren);
            this.isdirty = false;
            this._resized = false;
        };
        RUIContainer.prototype.onLayoutRelativeUI = function (ui) {
            if (ui.length == 0)
                return;
            var pWdith = this._calwidth;
            var pHeight = this._calheight;
            var root = this._root.root;
            var rWidth = root._calwidth;
            var rHeight = root._calheight;
            for (var i = 0, clen = ui.length; i < clen; i++) {
                var c = ui[i];
                var isrelative = c.position == RUIObject_3.RUIPosition.Relative;
                var cpw = isrelative ? pWdith : rWidth;
                var cph = isrelative ? pHeight : rHeight;
                var cleft = c.left;
                var cright = c.right;
                var ctop = c.top;
                var cbottom = c.bottom;
                var cwidth = c.width;
                var cheight = c.height;
                var constraintHori = cleft != RUIObject_3.RUIAuto && c.right != RUIObject_3.RUIAuto;
                var constraintVert = ctop != RUIObject_3.RUIAuto && c.bottom != RUIObject_3.RUIAuto;
                if (constraintHori) {
                    c._caloffsetx = cleft;
                    c._calwidth = cpw - cleft - cright;
                }
                else {
                    if (cwidth != RUIObject_3.RUIAuto) {
                        c._calwidth = cwidth;
                        if (cleft != RUIObject_3.RUIAuto) {
                            c._caloffsetx = cleft;
                        }
                        else if (cright != RUIObject_3.RUIAuto) {
                            c._caloffsetx = cpw - cright - cwidth;
                        }
                        else {
                            c._caloffsetx = RUIObject_3.ROUND((cpw - c._calwidth) / 2);
                        }
                    }
                    else {
                        console.error(c);
                        throw new Error("relative ui have invalid horizontal constraint.");
                    }
                }
                if (constraintVert) {
                    c._caloffsety = ctop;
                    c._calheight = cph - ctop - cbottom;
                }
                else {
                    if (c.height != RUIObject_3.RUIAuto) {
                        c._calheight = cheight;
                        if (ctop != RUIObject_3.RUIAuto) {
                            c._caloffsety = ctop;
                        }
                        else if (cbottom != RUIObject_3.RUIAuto) {
                            c._caloffsety = cph - cbottom - cheight;
                        }
                        else {
                            c._caloffsety = RUIObject_3.ROUND((cph - c._calheight) / 2);
                        }
                    }
                    else {
                        throw new Error("relative ui have invalid vertical constraint.");
                    }
                }
                c.onLayout();
                c.fillPositionOffset();
            }
        };
        RUIContainer.prototype.onDraw = function (cmd) {
            this.onDrawPre(cmd);
            var children = this.children;
            for (var i = 0, clen = children.length; i < clen; i++) {
                var c = children[i];
                if (c.visible)
                    c.onDraw(cmd);
            }
            this.onDrawPost(cmd);
        };
        RUIContainer.prototype.onDrawPre = function (cmd) {
            var rect = this.calculateRect();
            this._rect = rect;
            if (this.boxBorder != null)
                cmd.DrawBorder(rect, this.boxBorder);
            var paddingrect = this.RectMinusePadding(rect, this.padding);
            var cliprect = RUI_3.RUI.RectClip(paddingrect, cmd.clipRect);
            this._rectclip = cliprect;
            var boxclip = this.boxClip;
            if (boxclip != RUIContainerClipType.NoClip) {
                cmd.PushClipRect(boxclip == RUIContainerClipType.Clip ? cliprect : paddingrect, false);
            }
        };
        RUIContainer.prototype.onDrawPost = function (cmd) {
            if (this.boxClip != RUIContainerClipType.NoClip)
                cmd.PopClipRect();
        };
        RUIContainer.prototype.RectMinusePadding = function (recta, offset) {
            var pleft = offset[3];
            var ptop = offset[0];
            return [
                recta[0] + pleft,
                recta[1] + ptop,
                recta[2] - offset[1] - pleft,
                recta[3] - offset[2] - ptop
            ];
        };
        RUIContainer.prototype.setRoot = function (root) {
            if (this._root == root)
                return;
            this._root = root;
            var children = this.children;
            for (var i = 0, clen = children.length; i < clen; i++) {
                var c = children[i];
                if (c instanceof RUIContainer) {
                    c.setRoot(root);
                }
                else {
                    c._root = root;
                }
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
    }(RUIObject_3.RUIObject));
    exports.RUIContainer = RUIContainer;
});
define("rui/RUIRoot", ["require", "exports", "rui/RUIEvent", "rui/RUIContainer", "rui/RUIInput"], function (require, exports, RUIEvent_1, RUIContainer_2, RUIInput_1) {
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
            if (ui instanceof RUIContainer_2.RUIContainer) {
                ui.setRoot(this);
            }
            else {
                ui._root = this;
            }
        }
        Object.defineProperty(RUIRoot.prototype, "rootRect", {
            get: function () {
                return this.m_rootRect;
            },
            enumerable: true,
            configurable: true
        });
        RUIRoot.prototype.resizeRoot = function (width, height) {
            if (this.m_rootSizeWidth == width && this.m_rootSizeHeight == height)
                return;
            this.isdirty = true;
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
            if (event instanceof RUIEvent_1.RUIKeyboardEvent) {
            }
            else if (event instanceof RUIEvent_1.RUIWheelEvent) {
                var hoverUI = this.m_hoverUI;
                var wheele = event;
                for (var i = 0, clen = hoverUI.length; i < clen; i++) {
                    var c = hoverUI[i];
                    if (c instanceof RUIContainer_2.RUIContainer) {
                        c.onMouseWheel(wheele);
                        if (wheele.isUsed)
                            break;
                    }
                }
            }
            else if (event instanceof RUIEvent_1.RUIMouseEvent) {
                this.dispatchMouseEvent(event);
            }
        };
        RUIRoot.prototype.dispatchMouseEvent = function (e) {
            var etype = e.type;
            if (etype == RUIInput_1.RUIEventType.MouseMove) {
                this.dispatchMouseMove(e.mousex, e.mousey);
                if (this.m_onMouseDown && this.m_activeUI != null) {
                    //drag move
                    if (!this.m_activeUIonDrag) {
                        this.m_activeUIonDrag = true;
                        this.m_activeUI.onMouseDrag(new RUIEvent_1.RUIMouseDragEvent(e, RUIEvent_1.RUIMouseDragStage.Begin));
                    }
                    else {
                        this.m_activeUI.onMouseDrag(new RUIEvent_1.RUIMouseDragEvent(e, RUIEvent_1.RUIMouseDragStage.Update));
                    }
                }
            }
            else {
                var newActiveUI = this.traversalNormal(e.mousex, e.mousey);
                var curActiveUI = this.m_activeUI;
                switch (etype) {
                    case RUIInput_1.RUIEventType.MouseDown:
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
                    case RUIInput_1.RUIEventType.MouseUp:
                        {
                            this.m_onMouseDown = false;
                            if (newActiveUI != null) {
                                newActiveUI.onMouseUp(e);
                                if (newActiveUI == curActiveUI) {
                                    newActiveUI.onMouseClick(e);
                                }
                            }
                            if (curActiveUI != null && this.m_activeUIonDrag) {
                                curActiveUI.onMouseDrag(new RUIEvent_1.RUIMouseDragEvent(e, RUIEvent_1.RUIMouseDragStage.End));
                            }
                            this.m_activeUIonDrag = false;
                        }
                        break;
                }
            }
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
                if (ui.rectContains(x, y)) {
                    list.push(ui);
                }
            };
            var root = this.root;
            if (root instanceof RUIContainer_2.RUIContainer) {
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
                if (ui.rectContains(x, y)) {
                    if (target == null) {
                        target = ui;
                    }
                    else {
                        if (ui._level >= target._level)
                            target = ui;
                    }
                }
            };
            var root = this.root;
            if (root instanceof RUIContainer_2.RUIContainer) {
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
define("rui/RUIObject", ["require", "exports", "rui/RUI"], function (require, exports, RUI_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RUIAuto = -1;
    exports.RUICLIP_MAX = [0, 0, 5000, 5000];
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
            this.left = exports.RUIAuto;
            this.right = exports.RUIAuto;
            this.top = exports.RUIAuto;
            this.bottom = exports.RUIAuto;
            this.visible = true;
            this.zorder = 0;
            this._level = 0;
            this.parent = null;
            this.isdirty = true;
            this.isClip = true;
            this._caloffsetx = 0;
            this._caloffsety = 0;
            this._calx = 0;
            this._caly = 0;
            this._resized = true;
            this._debuglog = false;
        }
        RUIObject.prototype.onDraw = function (cmd) {
        };
        Object.defineProperty(RUIObject.prototype, "width", {
            get: function () {
                return this._width;
            },
            set: function (val) {
                if (val != this._width) {
                    this._width = val;
                    this._resized = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUIObject.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (val) {
                if (val != this._height) {
                    this._height = val;
                    this._resized = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        RUIObject.prototype.onLayout = function () {
            if (this._debugOnLayout != null)
                this._debugOnLayout();
            var isRoot = this.isRoot;
            this.isdirty = false;
            if (!this._resized) {
                if (this._calwidth == null)
                    throw new Error();
                if (this._calheight == null)
                    throw new Error();
                return;
            }
            this.fillSize();
            if (this._calheight == exports.RUIAuto)
                this._calheight = this.minheight;
            this._resized = false;
        };
        RUIObject.prototype.onLayoutPost = function () {
        };
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
        RUIObject.prototype.setDirty = function (resize) {
            if (resize === void 0) { resize = false; }
            this.isdirty = true;
            var root = this._root;
            if (root != null) {
                root.isdirty = true;
            }
            if (this.parent != null) {
                this.parent.isdirty = true;
            }
            if (resize)
                this._resized = true;
        };
        RUIObject.prototype.onMouseDown = function (e) { };
        RUIObject.prototype.onMouseUp = function (e) { };
        RUIObject.prototype.onActive = function () { };
        RUIObject.prototype.onInactive = function () { };
        RUIObject.prototype.onMouseLeave = function () { };
        RUIObject.prototype.onMouseEnter = function () { };
        RUIObject.prototype.onMouseClick = function (e) { };
        RUIObject.prototype.onMouseDrag = function (e) { };
        RUIObject.prototype.fillSize = function () {
            this._calwidth = null;
            this._calheight = null;
            if (this._flexwidth != null)
                this._calwidth = this._flexwidth;
            if (this._flexheight != null)
                this._calheight = this._flexheight;
            var parent = this.parent;
            var parentWidth = parent.width;
            if (this._calwidth == null) {
                if (this.width == exports.RUIAuto) {
                    if (parent == null) {
                        throw new Error();
                    }
                    else {
                        if (parentWidth != exports.RUIAuto) {
                            if (parent.padding == null) {
                                this._calwidth = parentWidth;
                            }
                            else {
                                var parentPadding = parent.padding;
                                this._calwidth = parentWidth - parentPadding[1] - parentPadding[3];
                            }
                        }
                    }
                }
                else {
                    this._calwidth = this.width;
                }
            }
            if (this._calheight == null) {
                if (this.height == exports.RUIAuto) {
                    if (parent == null) {
                        throw new Error();
                    }
                    else {
                        this._calheight = exports.RUIAuto;
                    }
                }
                else {
                    this._calheight = this.height;
                }
            }
        };
        RUIObject.prototype.fillPositionOffset = function () {
            if (this.position == RUIPosition.Offset) {
                this._caloffsetx += this.left == exports.RUIAuto ? 0 : this.left;
                this._caloffsety += this.top == exports.RUIAuto ? 0 : this.top;
            }
        };
        RUIObject.prototype.calculateRect = function (cliprect) {
            var rect = [this._calx, this._caly, this._calwidth, this._calheight];
            if (cliprect != null) {
                return RUI_4.RUI.RectClip(rect, cliprect);
            }
            return rect;
        };
        RUIObject.prototype.rectContains = function (x, y) {
            var rect = this._rectclip == null ? this._rect : this._rectclip;
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
});
define("rui/RUIEvent", ["require", "exports", "rui/RUIInput"], function (require, exports, RUIInput_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
            var _this = _super.call(this, e.raw, RUIInput_2.RUIEventType.MouseDrag) || this;
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
define("rui/RUIInput", ["require", "exports", "rui/RUIEvent"], function (require, exports, RUIEvent_2) {
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
            window.addEventListener('keypress', function (e) { return c.EventOnUIEvent.emit(new RUIEvent_2.RUIKeyboardEvent(e)); });
            window.addEventListener('mousedown', function (e) { return c.EventOnUIEvent.emit(new RUIEvent_2.RUIMouseEvent(e, RUIEventType.MouseDown)); });
            window.addEventListener('mouseup', function (e) { return c.EventOnUIEvent.emit(new RUIEvent_2.RUIMouseEvent(e, RUIEventType.MouseUp)); });
            window.addEventListener('mousemove', function (e) { return c.EventOnUIEvent.emit(new RUIEvent_2.RUIMouseEvent(e, RUIEventType.MouseMove)); });
            window.addEventListener('mousewheel', function (e) { return c.EventOnUIEvent.emit(new RUIEvent_2.RUIWheelEvent(e)); });
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
define("gl/wglShaderLib", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GLSL_FRAG_COLOR = '#version 300 es\nprecision lowp float;\n\nin vec4 vColor;\n\nout vec4 fragColor;\n\nvoid main(){\nfragColor = vColor;\n}';
    exports.GLSL_VERT_DEF = '#version 300 es\nprecision mediump float;\nin vec3 aPosition;\nin vec4 aColor;\nin vec4 aClip;\n\nuniform vec4 uProj;\nout vec4 vColor;\n\nvoid main(){\nvec2 pos =aPosition.xy;\npos = clamp(pos,aClip.xy,aClip.zw);\npos = pos * uProj.xy;\npos.y = 2.0 - pos.y;\npos.xy -=1.0;\ngl_Position = vec4(pos,aPosition.z,1);\nvColor = aColor;\n}';
    exports.GLSL_FRAG_TEXT = '#version 300 es\nprecision lowp float;\n\nin vec4 vColor;\nin vec2 vUV;\n\nuniform sampler2D uSampler;\n\nout vec4 fragColor;\n\nvoid main(){\nfragColor = texture(uSampler,vUV);\n}';
    exports.GLSL_VERT_TEXT = '#version 300 es\nprecision mediump float;\nin vec3 aPosition;\nin vec4 aColor;\nin vec2 aUV;\nin vec4 aClip;\n\nuniform vec4 uProj;\nout vec4 vColor;\nout vec2 vUV;\n\nvoid main(){\nvec2 pos = aPosition.xy;\npos = clamp(pos,aClip.xy,aClip.zw);\npos = pos * uProj.xy;\npos.y = 2.0 - pos.y;\npos.xy -=1.0;\ngl_Position = vec4(pos,aPosition.z,1);\nvColor = aColor;\nvUV =aUV;\n}';
});
define("rui/RUIFontTexture", ["require", "exports", "opentype.js", "rui/RUIEvent"], function (require, exports, opentype, RUIEvent_3) {
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
        RUIFontTexture.EventOnTextureLoaded = new RUIEvent_3.RUIEventEmitter();
        return RUIFontTexture;
    }());
    exports.RUIFontTexture = RUIFontTexture;
});
define("rui/RUIDrawCallBuffer", ["require", "exports", "gl/wglShaderLib", "rui/RUIFontTexture", "rui/RUICmdList", "rui/RUI"], function (require, exports, wglShaderLib_1, RUIFontTexture_1, RUICmdList_1, RUI_5) {
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
            var fonttex = RUIFontTexture_1.RUIFontTexture.ASIICTexture;
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
                                    color = RUI_5.RUI.GREY;
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
define("rui/RUIRenderer", ["require", "exports", "wglut", "rui/RUIDrawCallBuffer", "rui/RUIFontTexture", "rui/RUIStyle"], function (require, exports, wglut_1, RUIDrawCallBuffer_1, RUIFontTexture_2, RUIStyle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIRenderer = /** @class */ (function () {
        function RUIRenderer(uicanvas) {
            this.m_drawcallBuffer = null;
            this.m_indicesBuffer = null;
            this.m_projectParam = [0, 0, 0, 0];
            this.m_isvalid = false;
            this.m_isResized = false;
            this.m_needRedraw = false;
            this.m_uicanvas = uicanvas;
            this.glctx = wglut_1.GLContext.createFromCanvas(uicanvas.canvas);
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
            var clearColor = RUIStyle_1.RUIStyle.Default.background0;
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
                    console.log('texture not valid');
                    drawbuffer.isDirty = true;
                }
            }
            this.m_needRedraw = false;
        };
        return RUIRenderer;
    }());
    exports.RUIRenderer = RUIRenderer;
});
define("rui/RUICanvas", ["require", "exports", "rui/RUIInput", "rui/RUICursor", "rui/RUIRenderer", "rui/RUIEvent", "rui/RUIContainer"], function (require, exports, RUIInput_3, RUICursor_1, RUIRenderer_1, RUIEvent_4, RUIContainer_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUICanvasNode = /** @class */ (function (_super) {
        __extends(RUICanvasNode, _super);
        function RUICanvasNode(creation) {
            var _this = _super.call(this) || this;
            if (creation != null)
                creation.call(_this);
            return _this;
        }
        return RUICanvasNode;
    }(RUIContainer_3.RUIContainer));
    exports.RUICanvasNode = RUICanvasNode;
    var RUICanvas = /** @class */ (function () {
        function RUICanvas(canvas) {
            this.m_isResized = false;
            this.EventOnResize = new RUIEvent_4.RUIEventEmitter();
            this.EventOnUIEvent = new RUIEvent_4.RUIEventEmitter();
            this.m_canvas = canvas;
            this.m_renderer = new RUIRenderer_1.RUIRenderer(this);
            this.m_input = new RUIInput_3.RUIInput(this);
            this.m_cursor = new RUICursor_1.RUICursor(this);
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
            this.EventOnResize.emit(new RUIEvent_4.RUIResizeEvent(width, height));
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
define("rui/RUILayouter", ["require", "exports", "rui/RUIContainer", "rui/RUIObject"], function (require, exports, RUIContainer_4, RUIObject_4) {
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
            // if(ui.isdirty || ui._resized){
            //     ui.onLayout();
            // }
            ui.onLayout();
            uiroot.isdirty = false;
            // ui._calx = 0;
            // ui._caly = 0;
            // ui._level = 0;
            //Calculate All offset
            if (ui instanceof RUIContainer_4.RUIContainer) {
                this.calculateOffset(ui);
            }
        };
        RUILayouter.prototype.calculateOffset = function (cui) {
            var children = cui.children;
            var clen = children.length;
            var isVertical = cui.boxOrientation == RUIObject_4.RUIOrientation.Vertical;
            if (clen > 0) {
                var offx = cui._calx;
                var offy = cui._caly;
                var clevel = cui._level + 1;
                for (var i = 0; i < clen; i++) {
                    var c = children[i];
                    c._level = clevel;
                    c._calx = offx + c._caloffsetx;
                    c._caly = offy + c._caloffsety;
                    if (c instanceof RUIContainer_4.RUIContainer) {
                        this.calculateOffset(c);
                    }
                    c.onLayoutPost();
                }
            }
        };
        return RUILayouter;
    }());
    exports.RUILayouter = RUILayouter;
});
define("rui/RUIRectangle", ["require", "exports", "rui/RUIObject", "rui/RUI"], function (require, exports, RUIObject_5, RUI_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIRectangle = /** @class */ (function (_super) {
        __extends(RUIRectangle, _super);
        function RUIRectangle(w, h) {
            if (w === void 0) { w = RUIObject_5.RUIAuto; }
            if (h === void 0) { h = RUIObject_5.RUIAuto; }
            var _this = _super.call(this) || this;
            _this.m_debugColor = RUI_6.RUI.RandomColor();
            _this.width = w;
            _this.height = h;
            return _this;
        }
        RUIRectangle.create = function (color) {
            var rect = new RUIRectangle();
            rect.m_debugColor = color;
            return rect;
        };
        RUIRectangle.prototype.onLayout = function () {
            _super.prototype.onLayout.call(this);
        };
        RUIRectangle.prototype.onDraw = function (cmd) {
            var noclip = !this.isClip;
            if (noclip)
                cmd.PushClipRect();
            var rect = this.calculateRect();
            this._rect = rect;
            cmd.DrawRectWithColor(rect, this.m_debugColor);
            if (noclip)
                cmd.PopClipRect();
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
define("rui/widget/RUILabel", ["require", "exports", "rui/RUIObject", "rui/RUI"], function (require, exports, RUIObject_6, RUI_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUILabel = /** @class */ (function (_super) {
        __extends(RUILabel, _super);
        function RUILabel(label) {
            var _this = _super.call(this) || this;
            _this.label = label;
            return _this;
        }
        RUILabel.prototype.onDraw = function (cmd) {
            var rect = this.calculateRect();
            this._rect = rect;
            this._rectclip = RUI_7.RUI.RectClip(rect, cmd.clipRect);
            var label = this.label;
            if (label == null || label === '')
                return;
            cmd.DrawText(this.label, rect);
        };
        return RUILabel;
    }(RUIObject_6.RUIObject));
    exports.RUILabel = RUILabel;
});
define("rui/widget/RUIButton", ["require", "exports", "rui/RUIObject", "rui/RUIStyle", "rui/RUI"], function (require, exports, RUIObject_7, RUIStyle_2, RUI_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIButton = /** @class */ (function (_super) {
        __extends(RUIButton, _super);
        function RUIButton(label, f) {
            var _this = _super.call(this) || this;
            _this.m_color = RUIStyle_2.RUIStyle.Default.background1;
            _this.m_onhover = false;
            _this.label = label;
            _this.clickFunction = f;
            return _this;
        }
        RUIButton.prototype.onDraw = function (cmd) {
            var rect = this.calculateRect();
            this._rectclip = RUI_8.RUI.RectClip(rect, cmd.clipRect);
            this._rect = this._rectclip;
            cmd.DrawRectWithColor(rect, this.m_color);
            cmd.DrawText(this.label, rect);
        };
        RUIButton.prototype.onMouseEnter = function () {
            this.m_color = RUIStyle_2.RUIStyle.Default.primary;
            this.setDirty();
            this.m_onhover = true;
        };
        RUIButton.prototype.onMouseLeave = function () {
            this.m_color = RUIStyle_2.RUIStyle.Default.background1;
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
                this.m_color = RUIStyle_2.RUIStyle.Default.background2;
            }
            this.setDirty();
        };
        return RUIButton;
    }(RUIObject_7.RUIObject));
    exports.RUIButton = RUIButton;
});
define("rui/widget/RUICanvas", ["require", "exports", "rui/RUIObject", "rui/RUIRoot", "rui/RUIContainer", "rui/RUILayouter", "rui/RUIRectangle", "rui/RUIEvent"], function (require, exports, RUIObject_8, RUIRoot_1, RUIContainer_5, RUILayouter_1, RUIRectangle_1, RUIEvent_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUICanvas = /** @class */ (function (_super) {
        __extends(RUICanvas, _super);
        function RUICanvas() {
            var _this = _super.call(this) || this;
            _this.m_canvasOriginX = 0;
            _this.m_canvasOriginY = 0;
            _this.init();
            return _this;
        }
        RUICanvas.prototype.init = function () {
            this.m_layouter = new RUILayouter_1.RUILayouter();
            this.height = 300;
            var container = new RUIContainer_5.RUIContainer();
            var rect1 = new RUIRectangle_1.RUIRectangle();
            rect1.width = 20;
            rect1.height = 20;
            rect1.position = RUIObject_8.RUIPosition.Offset;
            this.m_rect1 = rect1;
            container.addChild(rect1);
            var canvasroot = new RUIRoot_1.RUIRoot(container, true);
            this.m_canvasContianer = container;
            this.m_canvasRoot = canvasroot;
        };
        RUICanvas.prototype.onMouseDrag = function (e) {
            if (e.stage == RUIEvent_5.RUIMouseDragStage.Begin) {
                this.m_dragStartX = e.mousex;
                this.m_dragStartY = e.mousey;
            }
            else if (e.stage == RUIEvent_5.RUIMouseDragStage.Update) {
                var offx = e.mousex - this.m_dragStartX;
                var offy = e.mousey - this.m_dragStartY;
                this.m_rect1.left = this.m_canvasOriginX + offx;
                this.m_rect1.top = this.m_canvasOriginY + offy;
                this.setDirty();
                this.m_rect1.setDirty();
            }
            else {
                this.m_canvasOriginX += (e.mousex - this.m_dragStartX);
                this.m_canvasOriginY += (e.mousey - this.m_dragStartY);
            }
        };
        RUICanvas.prototype.onLayoutPost = function () {
            //sync uiobject
            var container = this.m_canvasContianer;
            container._calx = this._calx;
            container._caly = this._caly;
            this.m_canvasRoot.resizeRoot(this._calwidth, this._calheight);
            this.m_layouter.build(this.m_canvasRoot);
        };
        RUICanvas.prototype.onDraw = function (cmd) {
            this.m_canvasContianer.onDraw(cmd);
        };
        return RUICanvas;
    }(RUIObject_8.RUIObject));
    exports.RUICanvas = RUICanvas;
});
define("rui/widget/RUISlider", ["require", "exports", "rui/RUIObject", "rui/RUIStyle"], function (require, exports, RUIObject_9, RUIStyle_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUISlider = /** @class */ (function (_super) {
        __extends(RUISlider, _super);
        function RUISlider(orientation) {
            var _this = _super.call(this) || this;
            _this.m_value = 0;
            _this.orientation = orientation;
            return _this;
        }
        Object.defineProperty(RUISlider.prototype, "value", {
            get: function () {
                return this.m_value;
            },
            set: function (val) {
                this.m_value = val;
            },
            enumerable: true,
            configurable: true
        });
        RUISlider.prototype.onDraw = function (cmd) {
            var rect = this.calculateRect();
            this._rect = rect;
            cmd.DrawRectWithColor(rect, RUIStyle_3.RUIStyle.Default.primary0);
        };
        return RUISlider;
    }(RUIObject_9.RUIObject));
    exports.RUISlider = RUISlider;
});
define("rui/RUIBinder", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function RUIBind(tar, property, f) {
        if (f == null)
            return;
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
                    f(tar[property]);
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
                    f(value);
                }
            });
        }
    }
    exports.RUIBind = RUIBind;
});
define("rui/widget/RUIScrollBar", ["require", "exports", "rui/RUIObject", "rui/widget/RUIScrollView", "rui/RUIStyle", "rui/RUIContainer", "rui/RUIRectangle", "rui/RUIEvent", "rui/RUI"], function (require, exports, RUIObject_10, RUIScrollView_1, RUIStyle_4, RUIContainer_6, RUIRectangle_2, RUIEvent_6, RUI_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIScrollBarThumb = /** @class */ (function (_super) {
        __extends(RUIScrollBarThumb, _super);
        function RUIScrollBarThumb(scrollbar) {
            var _this = _super.call(this) || this;
            _this.m_scrollBar = scrollbar;
            _this.m_debugColor = RUIStyle_4.RUIStyle.Default.background2;
            _this.m_isVertical = scrollbar.isVertical;
            return _this;
        }
        RUIScrollBarThumb.prototype.onMouseDrag = function (e) {
            var stage = e.stage;
            if (stage == RUIEvent_6.RUIMouseDragStage.Begin) {
                if (this.m_isVertical) {
                    this.m_dragStart = e.mousey;
                    this.m_dragStartTop = this.top;
                }
                else {
                    this.m_dragStart = e.mousex;
                    this.m_dragStartTop = this.left;
                }
            }
            else if (stage == RUIEvent_6.RUIMouseDragStage.Update) {
                if (this.m_isVertical) {
                    this.position = (e.mousey - this.m_dragStart + this.m_dragStartTop);
                    this.m_scrollBar.setBarPos(this.position);
                }
                else {
                    this.position = (e.mousex - this.m_dragStart + this.m_dragStartTop);
                    this.m_scrollBar.setBarPos(this.position);
                }
            }
        };
        return RUIScrollBarThumb;
    }(RUIRectangle_2.RUIRectangle));
    var RUIScrollBar = /** @class */ (function (_super) {
        __extends(RUIScrollBar, _super);
        function RUIScrollBar(orientation, scrollType) {
            var _this = _super.call(this) || this;
            _this.EventOnScroll = new REventEmitter();
            _this.m_show = false;
            _this.m_onHover = false;
            _this.m_enabled = true;
            _this.boxOrientation = orientation;
            _this.scrollType = scrollType;
            //add thumb
            var rect = new RUIScrollBarThumb(_this);
            rect.position = RUIObject_10.RUIPosition.Offset;
            if (_this.isVertical) {
                rect.left = 0;
                rect.width = RUIScrollBar.THUMB_SIZE;
                rect.height = 0;
            }
            else {
                rect.left = 0;
                rect.height = RUIScrollBar.THUMB_SIZE;
                rect.width = 100;
            }
            _this.m_thumb = rect;
            _this.addChild(rect);
            return _this;
        }
        RUIScrollBar.prototype.setEnable = function (enable) {
            if (this.m_enabled != enable) {
                this.m_enabled = enable;
                this.visible = enable;
                this.setDirty();
            }
        };
        Object.defineProperty(RUIScrollBar.prototype, "isVertical", {
            get: function () {
                return this.boxOrientation == RUIObject_10.RUIOrientation.Vertical;
            },
            enumerable: true,
            configurable: true
        });
        RUIScrollBar.prototype.onMouseLeave = function () {
            this.m_onHover = false;
            if (this.scrollType == RUIScrollView_1.RUIScrollType.Enabled) {
                var self = this;
                setTimeout(function () {
                    self.doHide();
                }, 1000);
            }
        };
        RUIScrollBar.prototype.onMouseDown = function (e) {
            var thumb = this.m_thumb;
            if (this.isVertical) {
                var offset = e.mousey - this._caly;
                if (offset < thumb.top) {
                    this.setBarPos(offset);
                }
                else {
                    var pos = offset - thumb.height;
                    this.setBarPos(pos);
                }
                this.setDirty();
            }
            else {
                var offset = e.mousex - this._calx;
                if (offset < thumb.left) {
                    this.setBarPos(offset);
                }
                else {
                    var pos = offset - thumb.width;
                    this.setBarPos(pos);
                }
                this.setDirty();
            }
        };
        RUIScrollBar.prototype.onLayout = function () {
            _super.prototype.onLayout.call(this);
        };
        RUIScrollBar.prototype.onMouseEnter = function () {
            this.m_onHover = true;
            this.show();
        };
        RUIScrollBar.prototype.doHide = function () {
            if (!this.m_onHover) {
                this.m_show = false;
                this.m_thumb.visible = false;
                this.m_thumb.setDirty();
                this.setDirty();
            }
        };
        RUIScrollBar.prototype.show = function () {
            if (this.m_show)
                return;
            if (this.scrollType == RUIScrollView_1.RUIScrollType.Enabled) {
                this.m_show = true;
                this.m_thumb.visible = true;
                this.setDirty();
                var self = this;
                setTimeout(function () {
                    self.doHide();
                }, 1000);
            }
        };
        RUIScrollBar.prototype.setBarSize = function (px) {
            if (isNaN(px))
                return;
            var thumb = this.m_thumb;
            if (this.isVertical) {
                if (thumb.height != px) {
                    this.m_thumbMaxSize = this._calheight - px;
                    thumb.height = px;
                    thumb.setDirty(true);
                }
            }
            else {
                if (thumb.width != px) {
                    this.m_thumbMaxSize = this._calwidth - px;
                    thumb.width = px;
                    thumb.setDirty(true);
                }
            }
        };
        RUIScrollBar.prototype.setBarPos = function (px) {
            if (isNaN(px))
                return;
            px = RUIObject_10.CLAMP(px, 0, this.m_thumbMaxSize);
            var thumb = this.m_thumb;
            if (this.isVertical) {
                if (thumb.top != px) {
                    this.EventOnScroll.emitRaw(px / this._calheight);
                    this.show();
                    thumb.top = px;
                    thumb.setDirty();
                    this.setDirty();
                }
            }
            else {
                if (thumb.left != px) {
                    this.EventOnScroll.emitRaw(px / this._calwidth);
                    this.show();
                    thumb.left = px;
                    thumb.setDirty();
                    this.setDirty();
                }
            }
        };
        RUIScrollBar.prototype.setBarSizeVal = function (v) {
            if (this.isVertical) {
                this.setBarSize(RUIObject_10.ROUND(v * this._calheight));
            }
            else {
                this.setBarSize(RUIObject_10.ROUND(v * this._calwidth));
            }
        };
        RUIScrollBar.prototype.setBarPosVal = function (v) {
            if (this.isVertical) {
                this.setBarPos(RUIObject_10.ROUND(v * this._calheight));
            }
            else {
                this.setBarPos(RUIObject_10.ROUND(v * this._calwidth));
            }
        };
        RUIScrollBar.prototype.onDrawPre = function (cmd) {
            _super.prototype.onDrawPre.call(this, cmd);
            var scrolltype = this.scrollType;
            if (scrolltype == RUIScrollView_1.RUIScrollType.Disabled)
                return;
            if (scrolltype == RUIScrollView_1.RUIScrollType.Always || this.m_show) {
                cmd.DrawRectWithColor(this._rect, RUI_9.RUI.BLACK);
                //draw thumb
            }
        };
        RUIScrollBar.prototype.onDrawPost = function (cmd) {
            _super.prototype.onDrawPost.call(this, cmd);
        };
        RUIScrollBar.BAR_SIZE = 10;
        RUIScrollBar.THUMB_SIZE = 10;
        return RUIScrollBar;
    }(RUIContainer_6.RUIContainer));
    exports.RUIScrollBar = RUIScrollBar;
});
define("rui/widget/RUIScrollView", ["require", "exports", "rui/RUIContainer", "rui/RUIObject", "rui/widget/RUIScrollBar", "rui/RUIStyle"], function (require, exports, RUIContainer_7, RUIObject_11, RUIScrollBar_1, RUIStyle_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIScrollType;
    (function (RUIScrollType) {
        RUIScrollType[RUIScrollType["Enabled"] = 0] = "Enabled";
        RUIScrollType[RUIScrollType["Disabled"] = 1] = "Disabled";
        RUIScrollType[RUIScrollType["Always"] = 2] = "Always";
    })(RUIScrollType = exports.RUIScrollType || (exports.RUIScrollType = {}));
    var RUIScrollView = /** @class */ (function (_super) {
        __extends(RUIScrollView, _super);
        function RUIScrollView(scrollVertical, scrollHorizontal) {
            if (scrollVertical === void 0) { scrollVertical = RUIScrollType.Enabled; }
            if (scrollHorizontal === void 0) { scrollHorizontal = RUIScrollType.Enabled; }
            var _this = _super.call(this) || this;
            _this.m_maxscrollV = 0;
            _this.m_maxscrollH = 0;
            _this.m_offsetValV = 0;
            _this.m_offsetValH = 0;
            _this.wheelScroolPriority = RUIObject_11.RUIOrientation.Vertical;
            _this.m_scrollHorizontal = scrollHorizontal;
            _this.m_scrollVertical = scrollVertical;
            _this.boxBorder = RUIStyle_5.RUIStyle.Default.border0;
            //add container
            var content = new RUIContainer_7.RUIContainer();
            content.visible = true;
            content.position = RUIObject_11.RUIPosition.Offset;
            _super.prototype.addChild.call(_this, content);
            _this.m_content = content;
            //add scrollbar
            _this.addScrollBar();
            return _this;
        }
        RUIScrollView.prototype.addScrollBar = function () {
            var hasVerticalBar = false;
            var scrollVertical = this.m_scrollVertical;
            if (scrollVertical != RUIScrollType.Disabled) {
                var slider = new RUIScrollBar_1.RUIScrollBar(RUIObject_11.RUIOrientation.Vertical, scrollVertical);
                slider.width = RUIScrollBar_1.RUIScrollBar.BAR_SIZE;
                slider.position = RUIObject_11.RUIPosition.Relative;
                slider.right = 0;
                slider.top = 0;
                slider.bottom = 0;
                this.m_scrollBarV = slider;
                _super.prototype.addChild.call(this, slider);
                var self = this;
                slider.EventOnScroll.on(function (val) {
                    self.setContentScrollPosVal(null, val.object);
                });
                hasVerticalBar = true;
            }
            var scrollHorizontal = this.m_scrollHorizontal;
            if (scrollHorizontal != RUIScrollType.Disabled) {
                var slider = new RUIScrollBar_1.RUIScrollBar(RUIObject_11.RUIOrientation.Horizontal, scrollHorizontal);
                slider.height = RUIScrollBar_1.RUIScrollBar.BAR_SIZE;
                slider.position = RUIObject_11.RUIPosition.Relative;
                slider.left = 0;
                slider.right = hasVerticalBar ? RUIScrollBar_1.RUIScrollBar.BAR_SIZE : 0;
                slider.bottom = 0;
                this.m_scrollBarH = slider;
                _super.prototype.addChild.call(this, slider);
                var self = this;
                slider.EventOnScroll.on(function (val) {
                    self.setContentScrollPosVal(val.object, null);
                });
            }
        };
        RUIScrollView.prototype.setContentScrollPosVal = function (xval, yval) {
            this.setContentScrollPos(xval ? (RUIObject_11.ROUND(-xval * this.m_content._calwidth)) : null, yval ? (-yval * this.m_content._calheight) : null);
        };
        RUIScrollView.prototype.setContentScrollPos = function (x, y) {
            var changed = false;
            var content = this.m_content;
            if (x != null) {
                var xpx = RUIObject_11.CLAMP(x, this.m_maxscrollH, 0);
                if (!isNaN(xpx) && xpx != content.left) {
                    content.left = xpx;
                    changed = true;
                    this.m_offsetValH = -xpx / content._calwidth;
                    this.m_scrollBarH.setBarPosVal(this.m_offsetValH);
                }
            }
            if (y != null) {
                var ypx = RUIObject_11.CLAMP(y, this.m_maxscrollV, 0);
                if (!isNaN(ypx) && ypx != content.top) {
                    content.top = ypx;
                    changed = true;
                    this.m_offsetValV = -ypx / content._calheight;
                    this.m_scrollBarV.setBarPosVal(this.m_offsetValV);
                }
            }
            if (changed) {
                this.setDirty();
            }
        };
        RUIScrollView.prototype.onLayoutPost = function () {
            if (this.m_scrollVertical != RUIScrollType.Disabled) {
                var maxScrollV = this._calheight - this.m_content._calheight;
                if (maxScrollV >= 0) {
                    this.m_scrollBarV.setEnable(false);
                }
                else {
                    this.m_scrollBarV.setEnable(true);
                    this.m_maxscrollV = maxScrollV;
                    var val = this._calheight / this.m_content._calheight;
                    this.m_scrollBarV.setBarSizeVal(val);
                }
            }
            if (this.m_scrollHorizontal != RUIScrollType.Disabled) {
                var maxScrollH = this._calwidth - this.m_content._calwidth;
                if (maxScrollH >= 0) {
                    this.m_scrollBarH.setEnable(false);
                }
                else {
                    this.m_scrollBarH.setEnable(true);
                    this.m_maxscrollH = maxScrollH;
                    var val = this._calwidth / this.m_content._calwidth;
                    this.m_scrollBarH.setBarSizeVal(val);
                }
            }
        };
        RUIScrollView.prototype.onMouseWheel = function (e) {
            var hasVertical = this.m_scrollVertical != RUIScrollType.Disabled;
            var hasHorizontal = this.m_scrollHorizontal != RUIScrollType.Disabled;
            var wheelVertical = true;
            if (hasVertical) {
                if (hasHorizontal) {
                    wheelVertical = this.wheelScroolPriority == RUIObject_11.RUIOrientation.Vertical;
                }
            }
            else {
                if (hasHorizontal) {
                    wheelVertical = false;
                }
                else {
                    return;
                }
            }
            var delta = e.delta * 0.5;
            var content = this.m_content;
            var newoffset = (wheelVertical ? content.top : content.left) - delta;
            if (wheelVertical) {
                this.setContentScrollPos(null, newoffset);
            }
            else {
                this.setContentScrollPos(newoffset, null);
            }
            e.Use();
        };
        RUIScrollView.prototype.addChild = function (ui) {
            this.m_content.addChild(ui);
        };
        RUIScrollView.prototype.removeChild = function (ui) {
            this.m_content.removeChild(ui);
        };
        return RUIScrollView;
    }(RUIContainer_7.RUIContainer));
    exports.RUIScrollView = RUIScrollView;
});
define("rui/widget/RUIButtonGroup", ["require", "exports", "rui/RUIContainer", "rui/RUIObject", "rui/RUIStyle"], function (require, exports, RUIContainer_8, RUIObject_12, RUIStyle_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIButtonGroup = /** @class */ (function (_super) {
        __extends(RUIButtonGroup, _super);
        function RUIButtonGroup(buttons, orientation) {
            var _this = _super.call(this) || this;
            _this.buttonSize = RUIButtonGroup.BUTTON_WIDTH;
            _this.m_initResized = false;
            _this.m_btnScrollOffset = 0;
            _this.m_hasBtnScroll = false;
            _this.m_buttons = buttons;
            _this.boxOrientation = orientation;
            _this.boxBorder = RUIStyle_6.RUIStyle.Default.primary0;
            _this.padding = [1, 1, 1, 1];
            for (var i = 0, len = buttons.length; i < len; i++) {
                var btn = buttons[i];
                _this.addButton(btn);
            }
            _this.m_isVertical = orientation == RUIObject_12.RUIOrientation.Vertical;
            _this.resizeButtons();
            return _this;
        }
        RUIButtonGroup.prototype.addChild = function (ui) {
            console.error('use addButton');
        };
        RUIButtonGroup.prototype.removeChild = function (ui) {
            console.error('use removeButton');
        };
        RUIButtonGroup.prototype.addButton = function (btn) {
            _super.prototype.addChild.call(this, btn);
        };
        RUIButtonGroup.prototype.removeButton = function (btn) {
            _super.prototype.removeChild.call(this, btn);
        };
        RUIButtonGroup.prototype.onLayoutPost = function () {
            _super.prototype.onLayoutPost.call(this);
            if (!this.m_initResized) {
                this.resizeButtons();
                this.setDirty();
                this.m_initResized = true;
            }
            else {
                var newisVertical = this.boxOrientation == RUIObject_12.RUIOrientation.Vertical;
                if (newisVertical != this.m_isVertical) {
                    this.m_isVertical = newisVertical;
                    this.resizeButtons();
                    this.setDirty();
                }
            }
        };
        RUIButtonGroup.prototype.resizeButtons = function () {
            var _this = this;
            var isvertical = this.m_isVertical;
            if (isvertical) {
                this.padding[3] = 1;
                if (this.width != RUIObject_12.RUIAuto) {
                    this.m_buttons.forEach(function (b) {
                        b.width = _this.width;
                    });
                }
                var totalsize_1 = 0;
                this.m_buttons.forEach(function (b) {
                    totalsize_1 += b._calheight;
                });
                this.m_btnTotalSize = totalsize_1;
            }
            else {
                this.padding[0] = 1;
                if (this.width == RUIObject_12.RUIAuto) {
                    this.m_buttons.forEach(function (b) {
                        b.width = _this.buttonSize;
                    });
                    this.m_btnTotalSize = this.m_buttons.length * this.buttonSize;
                }
                else {
                    var btnCounts = this.m_buttons.length;
                    var btnPerSize_1 = this._calwidth / btnCounts;
                    if (btnPerSize_1 < this.buttonSize) {
                        btnPerSize_1 = this.buttonSize;
                    }
                    this.m_buttons.forEach(function (b) {
                        b.width = btnPerSize_1;
                    });
                    this.m_btnTotalSize = this.m_buttons.length * btnPerSize_1;
                }
            }
        };
        RUIButtonGroup.prototype.onMouseWheel = function (e) {
            if (this.m_isVertical) {
                var offset = this.m_btnScrollOffset;
                if (this.m_btnTotalSize > this._calheight) {
                    var maxoffset = this.m_btnTotalSize - this._calheight;
                    offset -= e.delta * 0.25;
                    offset = RUIObject_12.CLAMP(offset, -maxoffset, 0);
                    this.m_hasBtnScroll = true;
                }
                else {
                    this.m_hasBtnScroll = false;
                    offset = 1;
                }
                if (offset != this.m_btnScrollOffset) {
                    this.m_btnScrollOffset = offset;
                    this.padding[0] = offset;
                    this.setDirty();
                }
            }
            else {
                var offset = this.m_btnScrollOffset;
                if (this.m_btnTotalSize > this._calwidth) {
                    var maxoffset = this.m_btnTotalSize - this._calwidth;
                    offset -= e.delta * 0.25;
                    offset = RUIObject_12.CLAMP(offset, -maxoffset, 0);
                    this.m_hasBtnScroll = true;
                }
                else {
                    this.m_hasBtnScroll = false;
                    offset = 1;
                }
                if (offset != this.m_btnScrollOffset) {
                    this.m_btnScrollOffset = offset;
                    this.padding[3] = offset;
                    this.setDirty();
                }
            }
        };
        RUIButtonGroup.BUTTON_WIDTH = 100;
        return RUIButtonGroup;
    }(RUIContainer_8.RUIContainer));
    exports.RUIButtonGroup = RUIButtonGroup;
});
define("rui/widget/RUIDebug", ["require", "exports", "rui/RUIContainer", "rui/widget/RUILabel", "rui/widget/RUIButton", "rui/RUIRectangle", "rui/RUIObject", "rui/RUIStyle", "rui/RUIFlexContainer", "rui/RUI"], function (require, exports, RUIContainer_9, RUILabel_1, RUIButton_1, RUIRectangle_3, RUIObject_13, RUIStyle_7, RUIFlexContainer_1, RUI_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIDebug = /** @class */ (function (_super) {
        __extends(RUIDebug, _super);
        function RUIDebug() {
            var _this = _super.call(this) || this;
            _this.width = 800;
            _this.padding = [10, 10, 10, 10];
            _this.boxBorder = RUI_10.RUI.RED;
            _this.boxClip = RUIContainer_9.RUIContainerClipType.NoClip;
            _this.LayoutContainer();
            _this.LayoutFlexContainer();
            _this.LayoutClip();
            _this.WidgetButtons();
            _this.WidgetLabel();
            return _this;
            // let button = new RUIButton("button1");
            // this.addChild(button);
            // {
            //     var btnGroup = new RUIButtonGroup([
            //         new RUIButton('AAA'),
            //         new RUIButton('BBB'),
            //         new RUIButton('CCC'),
            //         new RUIButton('DDD'),
            //         new RUIButton('EEE'),
            //     ],RUIOrientation.Horizontal);
            //     btnGroup.width = 450;
            //     this.addChild(btnGroup);
            //     // let canvas = new RUICanvas();
            //     // this.addChild(canvas);
            //     let btnGroupSwitch = new RUIButton('Switch BtnGroup',(b)=>{
            //         let orit = btnGroup.boxOrientation == RUIOrientation.Horizontal;
            //         btnGroup.boxOrientation = orit ? RUIOrientation.Vertical : RUIOrientation.Horizontal;
            //         if(orit){
            //             btnGroup.width =120;
            //             btnGroup.height = 70;
            //         }
            //         else{
            //             btnGroup.width = 450;
            //             btnGroup.height = RUIAuto;
            //         }
            //     });
            //     this.addChild(btnGroupSwitch);
            // }
            // {
            //     let rect1 = new RUIRectangle();
            //     rect1.height= 400;
            //     rect1.width =10;
            //     this.addChild(rect1);
            // }
            // {
            //     //relative container test
            //     var rcontainer = new RUIContainer();
            //     rcontainer.position = RUIPosition.Relative;
            //     rcontainer.left = 20;
            //     rcontainer.right = 400;
            //     rcontainer.top = 410;
            //     rcontainer.bottom = 10;
            //     this.addChild(rcontainer);
            //     var rect1 =new RUIRectangle();
            //     rect1.width = 20;
            //     rect1.height = 20;
            //     var t = ()=>{
            //         rect1.height= Math.random() *100;
            //         rect1.setDirty(true);
            //         setTimeout(t, 1000);
            //     }
            //     setTimeout(t, 1000);
            //     rcontainer.addChild(rect1);
            // }
            // {
            //     let scrollview = new RUIScrollView();
            //     scrollview.width = 400;
            //     scrollview.height= 200;
            //     this.addChild(scrollview);
            //     for(var i=0;i<10;i++){
            //         let rect1 = new RUIRectangle();
            //         rect1.width = 20 + 600* Math.random();
            //         rect1.height = 20 + 50 * Math.random();
            //         scrollview.addChild(rect1);
            //     }
            // }
        }
        RUIDebug.prototype.LayoutContainer = function () {
            var label = new RUILabel_1.RUILabel('1.0-Container');
            this.addChild(label);
            var container = new RUIContainer_9.RUIContainer();
            this.addChild(container);
            container.boxOrientation = RUIObject_13.RUIOrientation.Horizontal;
            container.boxBorder = RUIStyle_7.RUIStyle.Default.primary;
            container.padding = [3, 3, 3, 3];
            container.margin = [0, 0, 10, 0];
            //vertical
            {
                var c = new RUIContainer_9.RUIContainer();
                c.boxOrientation = RUIObject_13.RUIOrientation.Vertical;
                c.boxBorder = RUIStyle_7.RUIStyle.Default.primary;
                container.addChild(c);
                c.addChild(new RUIRectangle_3.RUIRectangle(50, 30));
                c.addChild(new RUIRectangle_3.RUIRectangle(100, 30));
            }
            //horizontal
            {
                var c = new RUIContainer_9.RUIContainer();
                c.boxBorder = RUIStyle_7.RUIStyle.Default.primary;
                c.margin = [0, 0, 0, 10];
                c.boxOrientation = RUIObject_13.RUIOrientation.Horizontal;
                container.addChild(c);
                c.addChild(new RUIRectangle_3.RUIRectangle(30, 50));
                c.addChild(new RUIRectangle_3.RUIRectangle(30, 100));
                c.addChild(new RUIRectangle_3.RUIRectangle(30, 70));
            }
            //nested 
            {
                var c = new RUIContainer_9.RUIContainer();
                c.boxBorder = RUIStyle_7.RUIStyle.Default.primary;
                c.margin = [0, 0, 0, 10];
                c.boxOrientation = RUIObject_13.RUIOrientation.Vertical;
                container.addChild(c);
                c.addChild(new RUIRectangle_3.RUIRectangle(50, 30));
                {
                    var c1 = new RUIContainer_9.RUIContainer();
                    c1.boxOrientation = RUIObject_13.RUIOrientation.Horizontal;
                    c1.addChild(new RUIRectangle_3.RUIRectangle(30, 30));
                    c1.addChild(new RUIRectangle_3.RUIRectangle(30, 50));
                    c1.addChild(new RUIRectangle_3.RUIRectangle(30, 10));
                    c.addChild(c1);
                }
                c.addChild(new RUIRectangle_3.RUIRectangle(70, 30));
            }
        };
        RUIDebug.prototype.LayoutFlexContainer = function () {
            var label = new RUILabel_1.RUILabel('1.1-FlexContainer');
            this.addChild(label);
            var container = new RUIContainer_9.RUIContainer();
            this.addChild(container);
            container.boxOrientation = RUIObject_13.RUIOrientation.Horizontal;
            container.boxBorder = RUIStyle_7.RUIStyle.Default.primary;
            container.padding = [3, 3, 3, 3];
            container.margin = [0, 0, 10, 0];
            //Flex vertical
            {
                var c = new RUIFlexContainer_1.RUIFlexContainer();
                container.addChild(c);
                c.boxOrientation = RUIObject_13.RUIOrientation.Horizontal;
                c.boxBorder = RUIStyle_7.RUIStyle.Default.primary;
                c.padding = [3, 3, 3, 3];
                c.margin = [0, 10, 0, 0];
                c.width = 100;
                c.height = 70;
                var r1 = new RUIRectangle_3.RUIRectangle();
                r1.flex = 1;
                var r2 = new RUIRectangle_3.RUIRectangle();
                r2.flex = 1;
                r2.height = 40;
                var r3 = new RUIRectangle_3.RUIRectangle();
                r3.flex = 2;
                r3.height = 30;
                c.addChild(r1);
                c.addChild(r2);
                c.addChild(r3);
            }
            //Flex horizontal
            {
                var c = new RUIFlexContainer_1.RUIFlexContainer();
                container.addChild(c);
                c.boxOrientation = RUIObject_13.RUIOrientation.Vertical;
                c.boxBorder = RUIStyle_7.RUIStyle.Default.primary;
                c.padding = [3, 3, 3, 3];
                c.margin = [0, 10, 0, 0];
                c.width = 100;
                c.height = 70;
                var r1 = new RUIRectangle_3.RUIRectangle();
                r1.flex = 1;
                r1.width = 50;
                var r2 = new RUIRectangle_3.RUIRectangle();
                r2.flex = 1;
                r2.width = 70;
                var r3 = new RUIRectangle_3.RUIRectangle();
                r3.flex = 2;
                r3.width = 60;
                c.addChild(r1);
                c.addChild(r2);
                c.addChild(r3);
            }
            //Flex vertical exten
            {
                var c = new RUIFlexContainer_1.RUIFlexContainer();
                c._debugname = "hhhh";
                container.addChild(c);
                c.boxOrientation = RUIObject_13.RUIOrientation.Horizontal;
                c.boxBorder = RUIStyle_7.RUIStyle.Default.primary;
                c.padding = [3, 3, 3, 3];
                c.margin = [0, 10, 0, 0];
                c.width = 100;
                //auto expands to container's height
                var r1 = new RUIRectangle_3.RUIRectangle();
                r1.flex = 1;
                var r2 = new RUIRectangle_3.RUIRectangle();
                r2.flex = 1;
                r2.height = 60;
                var r3 = new RUIRectangle_3.RUIRectangle();
                r3.flex = 2;
                r3.height = 30;
                c.addChild(r1);
                c.addChild(r2);
                c.addChild(r3);
            }
            //Flex horizontal exten
            {
                var c = new RUIFlexContainer_1.RUIFlexContainer();
                container.addChild(c);
                c.boxOrientation = RUIObject_13.RUIOrientation.Vertical;
                c.boxBorder = RUIStyle_7.RUIStyle.Default.primary;
                c.padding = [3, 3, 3, 3];
                c.margin = [0, 10, 0, 0];
                c.height = 70;
                var r1 = new RUIRectangle_3.RUIRectangle();
                r1.flex = 1;
                r1.width = 50;
                var r2 = new RUIRectangle_3.RUIRectangle();
                r2.flex = 1;
                r2.width = 100;
                var r3 = new RUIRectangle_3.RUIRectangle();
                r3.flex = 2;
                c.addChild(r1);
                c.addChild(r2);
                c.addChild(r3);
            }
        };
        RUIDebug.prototype.LayoutClip = function () {
            var label = new RUILabel_1.RUILabel('1.1-LayoutClip');
            this.addChild(label);
            var container = new RUIContainer_9.RUIContainer();
            this.addChild(container);
            container.boxOrientation = RUIObject_13.RUIOrientation.Horizontal;
            container.boxBorder = RUIStyle_7.RUIStyle.Default.primary;
            container.padding = [3, 3, 3, 3];
            {
                var container2 = new RUIContainer_9.RUIContainer();
                container2.padding = [2, 2, 2, 2];
                container2.margin = [0, 50, 0, 0];
                container2.height = 94;
                container2.width = 40;
                container2.boxBorder = RUIStyle_7.RUIStyle.Default.primary;
                container2.boxClip = RUIContainer_9.RUIContainerClipType.NoClip;
                container.addChild(container2);
                //clip default
                var r1 = new RUIRectangle_3.RUIRectangle();
                r1.width = 50;
                r1.height = 30;
                container2.addChild(r1);
                //clip offset
                var r2 = new RUIRectangle_3.RUIRectangle();
                r2.width = 50;
                r2.height = 30;
                r2.position = RUIObject_13.RUIPosition.Offset;
                r2.left = 20;
                container2.addChild(r2);
                //clip relative clip
                var r3 = new RUIRectangle_3.RUIRectangle();
                r3.width = 50;
                r3.height = 30;
                r3.position = RUIObject_13.RUIPosition.Relative;
                r3.left = 22;
                r3.top = 62;
                container2.addChild(r3);
            }
            {
                var container1 = new RUIContainer_9.RUIContainer();
                container1.padding = [2, 2, 2, 2];
                container1.margin = [0, 50, 0, 0];
                container1.height = 94;
                container1.width = 40;
                container1.boxBorder = RUIStyle_7.RUIStyle.Default.primary;
                container.addChild(container1);
                //clip default
                var r1 = new RUIRectangle_3.RUIRectangle();
                r1.width = 50;
                r1.height = 30;
                container1.addChild(r1);
                //clip offset
                var r2 = new RUIRectangle_3.RUIRectangle();
                r2.width = 50;
                r2.height = 30;
                r2.position = RUIObject_13.RUIPosition.Offset;
                r2.left = 20;
                container1.addChild(r2);
                //clip relative clip
                var r3 = new RUIRectangle_3.RUIRectangle();
                r3.width = 50;
                r3.height = 30;
                r3.position = RUIObject_13.RUIPosition.Relative;
                r3.left = 22;
                r3.top = 62;
                container1.addChild(r3);
            }
            {
                var container1 = new RUIContainer_9.RUIContainer();
                container1.padding = [2, 2, 2, 2];
                container1.height = 94;
                container1.width = 40;
                container1.boxBorder = RUIStyle_7.RUIStyle.Default.primary;
                container.addChild(container1);
                //clip default
                var r1 = new RUIRectangle_3.RUIRectangle();
                r1.width = 50;
                r1.height = 30;
                r1.isClip = false;
                container1.addChild(r1);
                //clip offset
                var r2 = new RUIRectangle_3.RUIRectangle();
                r2.width = 50;
                r2.height = 30;
                r2.position = RUIObject_13.RUIPosition.Offset;
                r2.left = 20;
                r2.isClip = false;
                container1.addChild(r2);
                //clip relative clip
                var r3 = new RUIRectangle_3.RUIRectangle();
                r3.width = 50;
                r3.height = 30;
                r3.position = RUIObject_13.RUIPosition.Relative;
                r3.left = 22;
                r3.top = 62;
                r3.isClip = false;
                container1.addChild(r3);
            }
            {
                var c = new RUIContainer_9.RUIContainer();
                c.padding = [2, 2, 2, 2];
                c.margin = [0, 0, 0, 50];
                c.height = 100;
                c.width = 100;
                c.boxBorder = RUIStyle_7.RUIStyle.Default.primary;
                container.addChild(c);
                var c1 = new RUIContainer_9.RUIContainer();
                c1.padding = RUI_10.RUI.Vector(10);
                c1.width = 70;
                c1.height = 70;
                c1.boxBorder = RUIStyle_7.RUIStyle.Default.primary;
                c1.position = RUIObject_13.RUIPosition.Offset;
                c1.left = 50;
                c1.top = 70;
                c1.addChild(new RUIRectangle_3.RUIRectangle(60, 60));
                c.addChild(c1);
                var c2 = new RUIContainer_9.RUIContainer();
                c2.boxBorder = RUIStyle_7.RUIStyle.Default.primary;
                c2.boxClip = RUIContainer_9.RUIContainerClipType.ClipSelf;
                c2.position = RUIObject_13.RUIPosition.Relative;
                c2.padding = RUI_10.RUI.Vector(2);
                c2.width = 70;
                c2.height = 60;
                c2.top = 0;
                c2.right = -30;
                var r2 = new RUIRectangle_3.RUIRectangle(70, 60);
                r2.position = RUIObject_13.RUIPosition.Offset;
                r2.left = -50;
                r2.top = -20;
                c2.addChild(r2);
                c.addChild(c2);
            }
        };
        RUIDebug.prototype.WidgetButtons = function () {
            var label = new RUILabel_1.RUILabel('2.0-Buttons');
            this.addChild(label);
            this.addChild(new RUIButton_1.RUIButton('Button1'));
            {
                var btn1 = new RUIButton_1.RUIButton('LongText');
                btn1.width = 70;
                this.addChild(btn1);
            }
            //Button in container
            {
                var c = new RUIContainer_9.RUIContainer();
                c.width = 100;
                c.padding = [1, 1, 1, 50];
                c.boxBorder = RUIStyle_7.RUIStyle.Default.primary;
                this.addChild(c);
                var btn = new RUIButton_1.RUIButton('Hello');
                btn.width = 100;
                c.addChild(btn);
            }
        };
        RUIDebug.prototype.WidgetLabel = function () {
            this.addChild(new RUILabel_1.RUILabel("2.1-Label"));
        };
        return RUIDebug;
    }(RUIContainer_9.RUIContainer));
    exports.RUIDebug = RUIDebug;
});
define("rui/RUITest", ["require", "exports", "rui/RUICanvas", "rui/RUICmdList", "rui/RUIRoot", "rui/RUILayouter", "rui/widget/RUIDebug"], function (require, exports, RUICanvas_1, RUICmdList_2, RUIRoot_2, RUILayouter_2, RUIDebug_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUITest = /** @class */ (function () {
        function RUITest(canvas) {
            this.m_ruicanvas = new RUICanvas_1.RUICanvas(canvas);
            this.buildUI();
        }
        RUITest.prototype.buildUI = function () {
            this.m_ruicmdlist = new RUICmdList_2.RUICmdList();
            this.m_ruilayouter = new RUILayouter_2.RUILayouter();
            var ui = new RUIDebug_1.RUIDebug();
            var root = new RUIRoot_2.RUIRoot(ui, false);
            root.root = ui;
            root.resizeRoot(this.m_ruicanvas.m_width, this.m_ruicanvas.m_height);
            this.m_ruicanvas.EventOnResize.on(function (e) {
                root.resizeRoot(e.object.width, e.object.height);
            });
            this.m_ruicanvas.EventOnUIEvent.on(function (e) { return root.dispatchEvent(e); });
            this.m_ruiroot = root;
        };
        RUITest.prototype.OnFrame = function (ts) {
            var uiroot = this.m_ruiroot;
            var renderer = this.m_ruicanvas.renderer;
            if (uiroot.isdirty || renderer.needRedraw) {
                var start = Date.now();
                this.m_ruilayouter.build(uiroot);
                console.log('> ' + (Date.now() - start));
                this.m_ruicmdlist.draw(uiroot);
                renderer.DrawCmdList(this.m_ruicmdlist);
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
define("rui/widget/RUITabView", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
// import { UIObject, UIAlign } from "../UIObject";
// import { RUIDrawCall } from "../RUIDrawCall";
// import { RUIStyle } from "../RUIStyle";
// import { RUIMouseEvent } from "../RUIEventSys";
// import { UIUtil } from "../UIUtil";
// export class UICheckbox extends UIObject{
//     private m_checked:boolean = false;
//     private m_align: UIAlign = UIAlign.Center;
//     private static readonly BoxSize:number = 16;
//     private m_rectOuter:number[];
//     private m_active:boolean =false;
//     public constructor(checked?:boolean,align?:UIAlign){
//         super();
//         if(checked != null){
//             this.m_checked = checked;
//         }
//         if(align != null){
//             this.m_align = align;
//         }
//     }
//     public onBuild(){
//         this.height = 23;
//         this.visibleSelf =true;
//     }
//     public onMouseClick(e:RUIMouseEvent){
//         if(UIUtil.RectContains(this.m_rectOuter,e.mousex,e.mousey)){
//             this.m_checked = !this.m_checked;
//             this.setDirty(true);
//         }
//     }
//     public onActive(){
//         this.m_active = true;
//     }
//     public onInactive(){
//         this.m_active = false;
//         this.setDirty(true);
//     }
//     public onDraw(cmd:RUIDrawCall){
//         let offsetx = 3;
//         if(this.m_align == UIAlign.Center){
//             offsetx = (this._width - UICheckbox.BoxSize)/2;
//         }else if(this.m_align == UIAlign.Right){
//             offsetx = this._width - 3 - UICheckbox.BoxSize;
//         }
//         let offsety = (this._height - UICheckbox.BoxSize) / 2;
//         let rectOuter = [this._calculateX + offsetx,this._calculateY+ offsety,UICheckbox.BoxSize,UICheckbox.BoxSize];
//         this.m_rectOuter = rectOuter;
//         cmd.DrawBorder(rectOuter,RUIStyle.Default.inactive);
//         if(this.m_checked){
//             let rectInner = [rectOuter[0]+2,rectOuter[1]+2,rectOuter[2]-4,rectOuter[3]-4];
//             cmd.DrawRectWithColor(rectInner,this.m_active? RUIStyle.Default.primary: RUIStyle.Default.primary0);
//         }
//     }
// }
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
// import { UIObject, UIDisplayMode, UIOrientation } from "../UIObject";
// import { RUIDrawCall } from "../RUIDrawCall";
// import { RUIFontTexture } from "../RUIFontTexture";
// import { UIInput } from "./UIInput";
// import { UILable } from "./UILabel";
// import { UISlider } from "./UISlider";
// import { UICheckbox } from "./UICheckbox";
// export abstract class UIField extends UIObject{
//     public m_label:string;
//     public constructor(label:string){
//         super();
//         this.m_label = label;
//     }
//     public onBuild(){
//         this.visibleSelf = true;
//     }
//     public get label(): string {
//         return this.m_label;
//     }
//     public set label(val: string) {
//         this.m_label = val;
//         this.setDirty(true);
//     }
//     public onDraw(cmd:RUIDrawCall){
//         let rect = [this._calculateX,this._calculateY,this._width,this._height];
//         let totalWidth = this._width;
//         let labelsize = 0;
//         let label = this.m_label;
//         if(label != null && label != ''){
//             labelsize = RUIFontTexture.ASIICTexture.MeasureTextWith(label);
//             labelsize = Math.min(labelsize + 10,Math.max(150,totalWidth *0.5));
//             let labelRect = [rect[0],rect[1],labelsize,rect[3]];
//             cmd.DrawText(label,labelRect);
//         }
//     }
// }
// export class UIInputField extends UIObject{
//     private m_input:UIInput;
//     private m_label:UILable;
//     public constructor(label:string,value:string = ''){
//         super();
//         this.m_input = new UIInput(value);
//         this.m_label = new UILable(label);
//     }
//     public onBuild(){
//         this.displayMode = UIDisplayMode.Flex;
//         this.orientation = UIOrientation.Horizontal;
//         this.height = 23;
//         this.m_label.width = 100;
//         this.m_input.flex = 1;
//         this.addChild(this.m_label);
//         this.addChild(this.m_input);
//     }
// }
// export class UICheckboxField extends UIObject{
//     private m_label:UILable;
//     private m_checkbox:UICheckbox;
//     public constructor(label:string,checked:boolean){
//         super();
//         this.m_label = new UILable(label);
//         this.m_checkbox = new UICheckbox(checked);
//     }
//     public onBuild(){
//         this.height = 23;
//         this.displayMode = UIDisplayMode.Flex;
//         this.orientation = UIOrientation.Horizontal;
//         this.m_label.width = 100;
//         this.m_checkbox.flex = 1;
//         this.addChild(this.m_label);
//         this.addChild(this.m_checkbox);
//     }
// }
// export class UISliderFiled extends  UIObject{
//     private m_label:UILable;
//     private m_slider:UISlider;
//     private m_max:number;
//     private m_min:number;
//     public constructor(label:string,value:number,min:number = 0.0,max:number = 1.0){
//         super();
//         this.m_label= new UILable(label);
//         this.m_max = max;
//         this.m_min = min;
//         let sval = (value - min) / (max - min);
//         this.m_slider = new UISlider(sval);
//     }
//     public onBuild(){
//         this.displayMode = UIDisplayMode.Flex;
//         this.orientation = UIOrientation.Horizontal;
//         this.height = 23;
//         this.m_label.width =100;
//         this.m_slider.flex = 1;
//         this.addChild(this.m_label);
//         this.addChild(this.m_slider);
//     }
// }
// import { UIObject } from "../UIObject";
// import { RUIDrawCall } from "../RUIDrawCall";
// import { RUIFontTexture } from "../RUIFontTexture";
// import { RUIStyle } from "../RUIStyle";
// import { RUIEvent } from "../RUIEventSys";
// import { RUICursorType } from "../RUICursor";
// import { IInputUI, RUIInput } from "../RUIInput";
// export class UIInput extends UIObject implements IInputUI {
//     public m_text: string;
//     public m_isFocuesd: boolean =false;
//     private m_isOnHover:boolean = false;
//     public constructor(content?: string) {
//         super();
//         this.height = 23;
//         this.m_text = content;
//         this.color = RUIStyle.Default.background0;
//     }
//     public get text(): string {
//         return this.m_text;
//     }
//     public set text(val: string) {
//         this.m_text = val;
//         this.setDirty(true);
//     }
//     public onBuild() {
//         this.visibleSelf = true;
//     }
//     public onActive(){
//         this.m_isFocuesd= true;
//         this.setColor();
//         this.setDirty(true);
//         //this._canvas.setActiveInputUI(this);
//     }
//     public onInactive(){
//         this.m_isFocuesd= false;
//         this.setColor();
//         this.setDirty(true);
//         //this._canvas.setInActiveInputUI(this);
//     }
//     public onKeyPress(e:KeyboardEvent): void {
//         this.m_text = RUIInput.ProcessTextKeyPress(this.m_text,e);
//         this.setDirty(true);
//     }
//     public onKeyDown(e:KeyboardEvent):void{
//         this.m_text = RUIInput.ProcessTextKeyDown(this.m_text,e);
//         this.setDirty(true);
//     }
//     public onMouseEnter(e:RUIEvent){
//         e.canvas.cursor.SetCursor(RUICursorType.text);
//         this.m_isOnHover = true;
//         this.setColor();
//         this.setDirty(true);
//     }
//     public onMouseLeave(e:RUIEvent){
//         e.canvas.cursor.SetCursor(RUICursorType.default);
//         this.m_isOnHover = false;
//         this.setColor();
//         this.setDirty(true);
//     }
//     private setColor(){
//         let style = RUIStyle.Default;
//         if(this.m_isFocuesd){
//             this.color = style.background2;
//         }
//         else{
//             this.color = this.m_isOnHover? style.background1: style.background0;
//         }
//     }
//     public onDraw(cmd: RUIDrawCall) {
//         let rect = [this._calculateX,this._calculateY,this._width,this._height];
//         cmd.DrawRectWithColor(rect,this.color);
//         let text = this.m_text;
//         if(text != null && text != ''){
//             cmd.DrawText(text,rect);
//         }
//         if(this.m_isFocuesd){
//             let offset = 1;
//             let borderR = [rect[0]+offset,rect[1]+offset,rect[2]-2 * offset,rect[3]-2* offset];
//             cmd.DrawBorder(borderR,RUIStyle.Default.primary);
//         }
//     }
// }
// import { UIObject } from "../UIObject";
// import { RUIDrawCall } from "../RUIDrawCall";
// import { RUIStyle } from "../RUIStyle";
// import { RUIMouseEvent, RUIMouseDragEvent } from "../RUIEventSys";
// export class UISlider extends UIObject{
//     private static readonly OFFSET:number = 2;
//     private m_value:number = 0;
//     private m_onDrag:boolean = false;
//     public constructor(value:number){
//         super();
//         this.m_value = value <0 ? 0: (value >1.0? 1.0:value); 
//         this.height = 23;
//     }
//     public get value():number{
//         return this.m_value;
//     }
//     public onBuild(){
//         this.visibleSelf = true;
//     }
//     public onMouseClick(e:RUIMouseEvent){
//         let value = (e.mousex - this._calculateX) / this._width;
//         this.m_value = this.clampValue(value);
//         this.setDirty(true);
//         e.prevent();
//     }
//     public onMouseDrag(e:RUIMouseDragEvent){
//         let value = (e.mousex - this._calculateX) / this._width;
//         this.m_value = this.clampValue(value);
//         this.m_onDrag = !e.isDragEnd;
//         this.setDirty(true);
//         e.prevent();
//     }
//     private calculateValue(mouse:number) : number{
//         return (mouse - this._calculateX - UISlider.OFFSET) / (this._width - UISlider.OFFSET * 2);
//     }
//     private clampValue(value:number):number{
//         return  value <0 ? 0: (value >1.0? 1.0:value); 
//     }
//     public onDraw(cmd:RUIDrawCall){
//         let rect = [this._calculateX+UISlider.OFFSET,this._calculateY+UISlider.OFFSET,this._width-2* UISlider.OFFSET,this._height-2 * UISlider.OFFSET];
//         cmd.DrawRectWithColor(rect,RUIStyle.Default.background1);
//         let width = rect[2] * this.m_value;
//         let srect = [rect[0],rect[1],width,rect[3]];
//         cmd.DrawRectWithColor(srect,this.m_onDrag ? RUIStyle.Default.primary: RUIStyle.Default.inactive);
//     }
// }
