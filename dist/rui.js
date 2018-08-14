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
                this.drawList.push(cmd);
            }
            else {
                //skip draw
                return;
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
            this.background0 = RUI_2.RUI.ColorUNorm(15, 15, 15, 255);
            this.background1 = RUI_2.RUI.ColorUNorm(30, 30, 30, 255);
            this.background2 = RUI_2.RUI.ColorUNorm(37, 37, 38);
            this.background3 = RUI_2.RUI.ColorUNorm(51, 51, 51);
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
            //onLayoutPre
            for (var i = 0; i < clen; i++) {
                children[i].onLayoutPre();
            }
            if (updateMode == RUIContainer_1.RUIContainerUpdateMode.LayoutUpdate) {
                for (var i = 0; i < clen; i++) {
                    var c = children[i];
                    if (!c._enabled)
                        continue;
                    c.onLayout();
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
                    if (!c._enabled)
                        continue;
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
                if (this._calwidth == null) {
                    this._calwidth = 0;
                }
                if (this._calheight == null) {
                    this._calheight = 0;
                }
                for (var i = 0; i < clen; i++) {
                    var c = children[i];
                    if (!c._enabled)
                        continue;
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
            else {
                if (this._calwidth == null)
                    this._calwidth = 0;
                if (this._calheight == null)
                    this._calheight = 0;
            }
            if (this._calwidth == null || this._calheight == null) {
                console.error(this);
                throw new Error();
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
            _this.boxBackground = null;
            _this.children = [];
            /** mark execute for children ui of @function traversal */
            _this.skipChildTraversal = false;
            return _this;
        }
        RUIContainer.prototype.onBuild = function () {
        };
        Object.defineProperty(RUIContainer.prototype, "isVertical", {
            get: function () {
                return this.boxOrientation == RUIObject_3.RUIOrientation.Vertical;
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
        RUIContainer.prototype.onLayout = function () {
            var isVertical = this.boxOrientation == RUIObject_3.RUIOrientation.Vertical;
            var children = this.children;
            var clen = children.length;
            //check for dirty
            var updateMode = this.containerUpdateCheck();
            if (updateMode == RUIContainerUpdateMode.None)
                return;
            //onLayoutPre
            for (var i = 0; i < clen; i++) {
                children[i].onLayoutPre();
            }
            if (updateMode == RUIContainerUpdateMode.LayoutUpdate) {
                for (var i = 0; i < clen; i++) {
                    var c = children[i];
                    if (!c._enabled)
                        continue;
                    c.onLayout();
                }
                return;
            }
            var isRelative = (this.position == RUIObject_3.RUIPosition.Relative || this.position == RUIObject_3.RUIPosition.Absolute);
            //fillsize
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
                    if (!c._enabled)
                        continue;
                    if (c.isOnFlow == false) {
                        relativeChildren.push(c);
                        continue;
                    }
                    c._flexwidth = null;
                    c._flexheight = null;
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
            else {
                if (this._root.root == this) {
                    var cleft = this.left;
                    var cright = this.right;
                    var ctop = this.top;
                    var cbottom = this.bottom;
                    var constraintH = cleft != RUIObject_3.RUIAuto && cright != RUIObject_3.RUIAuto;
                    var constraintV = ctop != RUIObject_3.RUIAuto && cbottom != RUIObject_3.RUIAuto;
                    var cwidth = this.width;
                    var cheight = this.height;
                    var rrect = this._root.rootRect;
                    if (rrect == null) {
                        console.error(this._root);
                        throw new Error();
                    }
                    var rwidth = rrect[2];
                    var rheight = rrect[3];
                    if (constraintH) {
                        this._calwidth = rwidth - cleft - cright;
                        this._caloffsetx = cleft;
                    }
                    else {
                        if (cwidth != RUIObject_3.RUIAuto) {
                            this._calwidth = cwidth;
                            if (cleft != RUIObject_3.RUIAuto) {
                                this._caloffsetx = cleft;
                            }
                            else if (cright != RUIObject_3.RUIAuto) {
                                this._caloffsetx = rwidth - cwidth - cright;
                            }
                            else {
                                this._caloffsetx = RUIObject_3.ROUND((rwidth - cwidth) / 2.0);
                            }
                        }
                        else {
                            throw new Error();
                        }
                    }
                    if (constraintV) {
                        this._calheight = rheight - ctop - cbottom;
                        this._caloffsety = ctop;
                    }
                    else {
                        if (cheight != RUIObject_3.RUIAuto) {
                            this._calwidth = cwidth;
                            if (ctop != RUIObject_3.RUIAuto) {
                                this._caloffsety = ctop;
                            }
                            else if (cbottom != RUIObject_3.RUIAuto) {
                                this._caloffsety = rheight - cheight - cbottom;
                            }
                            else {
                                this._caloffsety = RUIObject_3.ROUND((rheight - cheight) / 2.0);
                            }
                        }
                        else {
                            throw new Error();
                        }
                    }
                }
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
                if (!c._enabled)
                    continue;
                if (c.visible)
                    c.onDraw(cmd);
            }
            this.onDrawPost(cmd);
        };
        RUIContainer.prototype.onDrawPre = function (cmd) {
            var rect = this.calculateRect();
            this._rect = rect;
            if (this.boxBackground != null)
                cmd.DrawRectWithColor(rect, this.boxBackground);
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
                if (!ui._enabled)
                    return;
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
                if (!ui._enabled)
                    return;
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
            this.enabled = true;
            this._enabled = true;
            this._caloffsetx = 0;
            this._caloffsety = 0;
            this._calx = 0;
            this._caly = 0;
            this._resized = true;
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
        RUIObject.prototype.onLayoutPre = function () {
            if (this.enabled != this._enabled) {
                this._enabled = this.enabled;
                this.setDirty(true);
            }
        };
        RUIObject.prototype.onLayout = function () {
            if (this._root == null) {
                console.error(this);
                throw new Error('ui root is null');
            }
            var isRoot = this.isRoot;
            this.isdirty = false;
            if (!this._resized) {
                var calw = this._calwidth;
                var calh = this._calheight;
                if (calw == null)
                    throw new Error();
                if (calh == null)
                    throw new Error();
                if (this._flexheight == calh && this._flexwidth == calw) {
                    return;
                }
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
        RUIObject.prototype.setRoot = function (root) {
            this._root = root;
        };
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
    exports.GLSL_VERT_TEXT = '#version 300 es\nprecision mediump float;\nin vec3 aPosition;\nin vec4 aColor;\nin vec2 aUV;\nin vec4 aClip;\n\nuniform vec4 uProj;\nout vec4 vColor;\nout vec2 vUV;\n\nvoid main(){\nvec2 pos = aPosition.xy;\npos = clamp(pos,aClip.xy,aClip.zw);\n\nvec2 offset = aPosition.xy - pos;\npos = pos * uProj.xy;\npos.y = 2.0 - pos.y;\npos.xy -=1.0;\ngl_Position = vec4(pos,aPosition.z,1);\nvColor = aColor;\nvUV =aUV - offset / 128.0;\n}';
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
        RUICanvas.prototype.setSize = function (w, h) {
            this.m_width = w;
            this.m_height = h;
        };
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
            var rootrect = uiroot.rootRect;
            ui._calx = rootrect[0] + ui._caloffsetx;
            ui._caly = rootrect[1] + ui._caloffsety;
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
            this._rectclip = RUI_6.RUI.RectClip(rect, cmd.clipRect);
            this._rect = this._rectclip;
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
define("rui/widget/RUILabel", ["require", "exports", "rui/RUIObject", "rui/RUI", "rui/RUIFontTexture"], function (require, exports, RUIObject_6, RUI_7, RUIFontTexture_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUILabel = /** @class */ (function (_super) {
        __extends(RUILabel, _super);
        function RUILabel(label) {
            var _this = _super.call(this) || this;
            _this.m_textwidth = NaN;
            _this.label = label;
            _this.width = 100;
            return _this;
        }
        RUILabel.prototype.onLayoutPost = function () {
            if (this.m_textwidth == NaN) {
                var ftw = RUIFontTexture_3.RUIFontTexture.ASIICTexture.MeasureTextWith(this.label) + 20;
                if (ftw != NaN) {
                    this.m_textwidth = ftw;
                    this.width = ftw;
                    this.setDirty(true);
                }
            }
        };
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
            _this.m_color = RUIStyle_2.RUIStyle.Default.background3;
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
define("rui/widget/RUIButtonGroup", ["require", "exports", "rui/RUIContainer", "rui/RUIObject", "rui/RUIStyle"], function (require, exports, RUIContainer_6, RUIObject_9, RUIStyle_3) {
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
            _this.boxBorder = RUIStyle_3.RUIStyle.Default.primary0;
            _this.boxClip = RUIContainer_6.RUIContainerClipType.ClipSelf;
            _this.padding = [1, 1, 1, 1];
            for (var i = 0, len = buttons.length; i < len; i++) {
                var btn = buttons[i];
                _this.addButton(btn);
            }
            _this.m_isVertical = orientation == RUIObject_9.RUIOrientation.Vertical;
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
        RUIButtonGroup.prototype.getButtonIndex = function (btn) {
            return this.m_buttons.indexOf(btn);
        };
        RUIButtonGroup.prototype.onLayoutPost = function () {
            _super.prototype.onLayoutPost.call(this);
            if (!this.m_initResized) {
                this.resizeButtons();
                this.setDirty();
                this.m_initResized = true;
            }
            else {
                var newisVertical = this.boxOrientation == RUIObject_9.RUIOrientation.Vertical;
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
                if (this.width != RUIObject_9.RUIAuto) {
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
                if (this.width == RUIObject_9.RUIAuto) {
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
                    offset = RUIObject_9.CLAMP(offset, -maxoffset, 0);
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
                    offset = RUIObject_9.CLAMP(offset, -maxoffset, 0);
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
    }(RUIContainer_6.RUIContainer));
    exports.RUIButtonGroup = RUIButtonGroup;
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
define("rui/widget/RUIScrollBar", ["require", "exports", "rui/RUIObject", "rui/RUIContainer", "rui/RUIStyle", "rui/RUIRectangle", "rui/RUIEvent"], function (require, exports, RUIObject_10, RUIContainer_7, RUIStyle_4, RUIRectangle_2, RUIEvent_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // import { RUISlider } from "./RUISlider";
    // import { RUIOrientation, RUIPosition, RUIObject, ROUND, CLAMP } from "../RUIObject";
    // import { RUIScrollType } from "./RUIScrollView";
    // import { RUICmdList } from "../RUICmdList";
    // import { RUIStyle } from "../RUIStyle";
    // import { RUIContainer } from "../RUIContainer";
    // import { RUIRectangle } from "../RUIRectangle";
    // import { RUIMouseDragEvent, RUIMouseDragStage, RUIMouseEvent, RUIEventEmitter } from "../RUIEvent";
    // import { RUI } from "../RUI";
    // class RUIScrollBarThumb extends RUIRectangle{
    //     private m_scrollBar: RUIScrollBar;
    //     private m_dragStart: number;
    //     private m_dragStartTop:number;
    //     public position: number;
    //     private m_isVertical:boolean;
    //     public constructor(scrollbar: RUIScrollBar){
    //         super();
    //         this.m_scrollBar = scrollbar;
    //         this.m_debugColor = RUIStyle.Default.background2;
    //         this.m_isVertical= scrollbar.isVertical;
    //     }
    //     public onMouseDrag(e:RUIMouseDragEvent){
    //         let stage = e.stage;
    //         if(stage == RUIMouseDragStage.Begin){
    //             if(this.m_isVertical){
    //                 this.m_dragStart = e.mousey;
    //                 this.m_dragStartTop = this.top;
    //             }
    //             else{
    //                 this.m_dragStart = e.mousex;
    //                 this.m_dragStartTop =this.left;
    //             }
    //         }
    //         else if(stage == RUIMouseDragStage.Update){
    //             if(this.m_isVertical){
    //                 this.position = (e.mousey - this.m_dragStart + this.m_dragStartTop);
    //                 this.m_scrollBar.setBarPos(this.position);
    //             }
    //             else{
    //                 this.position = (e.mousex - this.m_dragStart + this.m_dragStartTop);
    //                 this.m_scrollBar.setBarPos(this.position);
    //             }
    //         }
    //     }
    // }
    // export class RUIScrollBar extends RUIContainer{
    //     public EventOnScroll: RUIEventEmitter<number> = new RUIEventEmitter();
    //     public scrollType: RUIScrollType;
    //     private m_show : boolean= false;
    //     private m_onHover:boolean = false;
    //     private m_thumb: RUIScrollBarThumb;
    //     private m_thumbMaxSize: number;
    //     private m_enabled:boolean = true;
    //     public static readonly BAR_SIZE:number = 10;
    //     public static readonly THUMB_SIZE:number = 10;
    //     public setEnable(enable:boolean){
    //         if(this.m_enabled != enable){
    //             this.m_enabled = enable;
    //             this.visible = enable;
    //             this.setDirty();
    //         }
    //     }
    //     public get isVertical():boolean{
    //         return this.boxOrientation == RUIOrientation.Vertical;
    //     }
    //     public constructor(orientation: RUIOrientation,scrollType: RUIScrollType){
    //         super();
    //         this.boxOrientation = orientation;
    //         this.scrollType = scrollType;
    //         //add thumb
    //         let rect = new RUIScrollBarThumb(this);
    //         rect.position = RUIPosition.Offset;
    //         if(this.isVertical){
    //             rect.left = 0;
    //             rect.width = RUIScrollBar.THUMB_SIZE;
    //             rect.height = 0;
    //         }
    //         else{
    //             rect.left=0;
    //             rect.height = RUIScrollBar.THUMB_SIZE;
    //             rect.width = 100;
    //         }
    //         this.m_thumb = rect;
    //         this.addChild(rect);
    //     }
    //     public onMouseLeave(){
    //         this.m_onHover= false;
    //         if(this.scrollType == RUIScrollType.Enabled){
    //             var self = this;
    //             setTimeout(() => {
    //                 self.doHide();
    //             }, 1000);
    //         }
    //     }
    //     public onMouseDown(e:RUIMouseEvent){
    //         let thumb = this.m_thumb;
    //         if(this.isVertical){
    //             let offset = e.mousey - this._caly;
    //             if(offset < thumb.top){
    //                 this.setBarPos(offset);
    //             }
    //             else{
    //                 let pos = offset - thumb.height;
    //                 this.setBarPos(pos);
    //             }
    //             this.setDirty();
    //         }
    //         else{
    //             let offset = e.mousex - this._calx;
    //             if(offset < thumb.left){
    //                 this.setBarPos(offset);
    //             }
    //             else{
    //                 let pos = offset - thumb.width;
    //                 this.setBarPos(pos);
    //             }
    //             this.setDirty();
    //         }
    //     }
    //     public onLayout(){
    //         super.onLayout();
    //     }
    //     public onMouseEnter(){
    //         this.m_onHover = true;
    //         this.show();
    //     }
    //     private doHide(){
    //         if(!this.m_onHover){
    //             this.m_show = false;
    //             this.m_thumb.visible= false;
    //             this.m_thumb.setDirty();
    //             this.setDirty();
    //         }
    //     }
    //     public show(){
    //         if(this.m_show) return;
    //         if(this.scrollType == RUIScrollType.Enabled){
    //             this.m_show=true;
    //             this.m_thumb.visible= true;
    //             this.setDirty();
    //             var self = this;
    //             setTimeout(() => {
    //                 self.doHide();
    //             }, 1000);
    //         }
    //     }
    //     public setBarSize(px:number){
    //         if(isNaN(px)) return;
    //         let thumb= this.m_thumb;
    //         if(this.isVertical){
    //             if(thumb.height != px){
    //                 this.m_thumbMaxSize = this._calheight - px;
    //                 thumb.height = px;
    //                 thumb.setDirty(true);
    //             }
    //         }
    //         else{
    //             if(thumb.width != px){
    //                 this.m_thumbMaxSize = this._calwidth - px;
    //                 thumb.width = px;
    //                 thumb.setDirty(true);
    //             }
    //         }
    //     }
    //     public setBarPos(px:number){
    //         if(isNaN(px)) return;
    //         px = CLAMP(px,0,this.m_thumbMaxSize);
    //         let thumb = this.m_thumb;
    //         if(this.isVertical){
    //             if(thumb.top != px){
    //                 this.EventOnScroll.emitRaw(px / this._calheight);
    //                 this.show();
    //                 thumb.top = px;
    //                 thumb.setDirty();
    //                 this.setDirty();
    //             }
    //         }
    //         else{
    //             if(thumb.left != px){
    //                 this.EventOnScroll.emitRaw(px / this._calwidth);
    //                 this.show();
    //                 thumb.left = px;
    //                 thumb.setDirty();
    //                 this.setDirty();
    //             }
    //         }
    //     }
    //     public setBarSizeVal(v:number){
    //         if(this.isVertical){
    //             this.setBarSize(ROUND(v * this._calheight));
    //         }
    //         else{
    //             this.setBarSize(ROUND(v * this._calwidth));
    //         }
    //     }
    //     public setBarPosVal(v:number){
    //         if(this.isVertical){
    //             this.setBarPos(ROUND(v * this._calheight));
    //         }else{
    //             this.setBarPos(ROUND(v * this._calwidth));
    //         }
    //     }
    //     public onDrawPre(cmd:RUICmdList){
    //         super.onDrawPre(cmd);
    //         let scrolltype = this.scrollType;
    //         if(scrolltype == RUIScrollType.Disabled) return;
    //         if(scrolltype == RUIScrollType.Always || this.m_show){
    //             cmd.DrawRectWithColor(this._rect,RUI.BLACK);
    //             //draw thumb
    //         }
    //     }
    //     public onDrawPost(cmd:RUICmdList){
    //         super.onDrawPost(cmd);
    //     }
    // }
    var RUIScrollType;
    (function (RUIScrollType) {
        RUIScrollType[RUIScrollType["Enabled"] = 0] = "Enabled";
        RUIScrollType[RUIScrollType["Disabled"] = 1] = "Disabled";
        RUIScrollType[RUIScrollType["Always"] = 2] = "Always";
    })(RUIScrollType = exports.RUIScrollType || (exports.RUIScrollType = {}));
    var RUIScrollBarThumb = /** @class */ (function (_super) {
        __extends(RUIScrollBarThumb, _super);
        function RUIScrollBarThumb(scrollbar) {
            var _this = _super.call(this) || this;
            _this.m_scrollbar = null;
            _this.m_onHover = false;
            _this.m_onDrag = false;
            _this.m_scrollbar = scrollbar;
            _this.m_debugColor = RUIStyle_4.RUIStyle.Default.background2;
            return _this;
        }
        RUIScrollBarThumb.prototype.onMouseDrag = function (e) {
            var isvertical = this.m_scrollbar.isVertical;
            if (e.stage == RUIEvent_6.RUIMouseDragStage.Begin) {
                this.m_dragStartOffset = (isvertical ? e.mousey - this.top : e.mousex - this.left);
                this.m_onDrag = true;
            }
            else if (e.stage == RUIEvent_6.RUIMouseDragStage.Update) {
                var pos = (isvertical ? e.mousey : e.mousex) - this.m_dragStartOffset;
                var bar = this.m_scrollbar;
                var barsize = isvertical ? bar._calheight : bar._calwidth;
                var off = isvertical ? this.top : this.left;
                pos = RUIObject_10.CLAMP(pos, 0, barsize - (isvertical ? this._calheight : this._calwidth));
                if (off == pos)
                    return;
                pos = pos / barsize;
                bar.onThumbDrag(pos);
                this.m_onDrag = true;
            }
            else {
                this.m_onDrag = false;
            }
            this.setDirty();
        };
        RUIScrollBarThumb.prototype.onMouseEnter = function () {
            this.m_onHover = true;
            this.setDirty();
        };
        RUIScrollBarThumb.prototype.onMouseLeave = function () {
            this.m_onHover = false;
            this.setDirty();
        };
        RUIScrollBarThumb.prototype.onLayoutPost = function () {
            if (this.m_onDrag) {
                this.m_debugColor = RUIStyle_4.RUIStyle.Default.primary0;
            }
            else if (this.m_onHover) {
                this.m_debugColor = RUIStyle_4.RUIStyle.Default.primary;
            }
            else {
                this.m_debugColor = RUIStyle_4.RUIStyle.Default.background3;
            }
        };
        return RUIScrollBarThumb;
    }(RUIRectangle_2.RUIRectangle));
    var RUIScrollBar = /** @class */ (function (_super) {
        __extends(RUIScrollBar, _super);
        function RUIScrollBar(orit, type) {
            if (orit === void 0) { orit = RUIObject_10.RUIOrientation.Horizontal; }
            if (type === void 0) { type = RUIScrollType.Enabled; }
            var _this = _super.call(this) || this;
            _this.m_show = true;
            _this.EventOnScroll = new RUIEvent_6.RUIEventEmitter();
            _this.boxOrientation = orit;
            _this.m_scrolltype = type;
            _this.m_size = 0.5;
            _this.m_position = 0.0;
            var thumb = new RUIScrollBarThumb(_this);
            thumb.width = 10;
            thumb.height = 10;
            thumb.position = RUIObject_10.RUIPosition.Offset;
            _this.m_thumb = thumb;
            _this.addChild(thumb);
            _this.setOrientation(_this.boxOrientation);
            _this.scrollSize = 0.5;
            return _this;
        }
        Object.defineProperty(RUIScrollBar.prototype, "scrollSize", {
            get: function () {
                return this.m_size;
            },
            set: function (val) {
                var v = RUIObject_10.CLAMP(val, 0, 1.0);
                if (this.m_size != v) {
                    this.m_show = true;
                    if (v == 0 || v == 1.0) {
                        this.scrollPos = 0;
                        this.EventOnScroll.emitRaw(0);
                        if (!this.isAlwayShow) {
                            this.m_show = false;
                        }
                    }
                    this.m_size = v;
                    this.setDirty(true);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUIScrollBar.prototype, "scrollPos", {
            get: function () {
                return this.m_position;
            },
            set: function (val) {
                var v = RUIObject_10.CLAMP(val, 0, 1.0 - this.m_size);
                if (this.m_position != v) {
                    this.m_position = v;
                    this.setDirty();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUIScrollBar.prototype, "isAlwayShow", {
            get: function () {
                return this.m_scrolltype == RUIScrollType.Always;
            },
            enumerable: true,
            configurable: true
        });
        RUIScrollBar.prototype.onThumbDrag = function (val) {
            this.scrollPos = val;
            this.EventOnScroll.emitRaw(val);
        };
        RUIScrollBar.prototype.onScrollBarClick = function (val) {
            this.scrollPos = val;
            this.EventOnScroll.emitRaw(val);
        };
        RUIScrollBar.prototype.onLayoutPost = function () {
            var isvertical = this.isVertical;
            var barsize = (isvertical ? this._calheight : this._calwidth);
            var thumbsize = barsize * this.m_size;
            var thumbpos = barsize * this.m_position;
            var thumb = this.m_thumb;
            if (isvertical) {
                if (thumb.height != thumbsize) {
                    thumb.height = thumbsize;
                    thumb.setDirty(true);
                }
                if (thumb.top != thumbpos) {
                    thumb.top = thumbpos;
                    thumb.setDirty();
                }
            }
            else {
                if (thumb.width != thumbsize) {
                    thumb.width = thumbsize;
                    thumb.setDirty(true);
                }
                if (thumb.left != thumbpos) {
                    thumb.left = thumbpos;
                    thumb.setDirty();
                }
            }
        };
        RUIScrollBar.prototype.onMouseDown = function (e) {
            if (this.scrollSize == 0)
                return;
            var isvertical = this.isVertical;
            if (isvertical) {
                var pos = (e.mousey - this._caly) / this._calheight;
                if (pos < this.m_position) {
                    this.onScrollBarClick(pos);
                }
                else {
                    var posend = this.scrollPos + this.scrollSize;
                    if (pos > posend) {
                        this.onScrollBarClick(pos - this.scrollSize);
                    }
                }
            }
            else {
                var pos = (e.mousex - this._calx) / this._calwidth;
                if (pos < this.m_position) {
                    this.onScrollBarClick(pos);
                }
                else {
                    var posend = this.scrollPos + this.scrollSize;
                    if (pos > posend) {
                        this.onScrollBarClick(pos - this.scrollSize);
                    }
                }
            }
        };
        RUIScrollBar.prototype.setOrientation = function (orit) {
            if (this.isVertical) {
                this.width = RUIScrollBar.BAR_SIZE;
            }
            else {
                this.height = RUIScrollBar.BAR_SIZE;
            }
        };
        RUIScrollBar.prototype.onDrawPre = function (cmd) {
            _super.prototype.onDrawPre.call(this, cmd);
            if (this.m_show) {
                cmd.DrawRectWithColor(this._rect, RUIStyle_4.RUIStyle.Default.background0);
            }
        };
        RUIScrollBar.BAR_SIZE = 10;
        return RUIScrollBar;
    }(RUIContainer_7.RUIContainer));
    exports.RUIScrollBar = RUIScrollBar;
});
define("rui/widget/RUIScrollView", ["require", "exports", "rui/RUIContainer", "rui/widget/RUIScrollBar", "rui/RUIObject", "rui/RUIStyle"], function (require, exports, RUIContainer_8, RUIScrollBar_1, RUIObject_11, RUIStyle_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // import { RUIContainer, RUIContainerClipType } from "../RUIContainer";
    // import { RUIPosition, RUIObject, RUIOrientation, RUIAuto, CLAMP, ROUND } from "../RUIObject";
    // import { RUISlider } from "./RUISlider";
    // import { RUIBind } from "../RUIBinder";
    // import { RUIScrollBar } from "./RUIScrollBar";
    // import { RUIWheelEvent } from "../RUIEvent";
    // import { RUIStyle } from "../RUIStyle";
    // export enum RUIScrollType{
    //     Enabled,
    //     Disabled,
    //     Always
    // }
    // export class RUIScrollView extends RUIContainer{
    //     private m_scrollVertical: RUIScrollType;
    //     private m_scrollHorizontal :RUIScrollType;
    //     private m_content: RUIContainer;
    //     private m_scrollBarV: RUIScrollBar;
    //     private m_scrollBarH :RUIScrollBar;
    //     private m_maxscrollV :number = 0;
    //     private m_maxscrollH :number = 0;
    //     private m_offsetValV:number = 0;
    //     private m_offsetValH:number = 0;
    //     public wheelScroolPriority: RUIOrientation = RUIOrientation.Vertical;
    //     public constructor(scrollVertical: RUIScrollType =RUIScrollType.Enabled,scrollHorizontal: RUIScrollType = RUIScrollType.Enabled){
    //         super();
    //         this.m_scrollHorizontal = scrollHorizontal;
    //         this.m_scrollVertical = scrollVertical;
    //         this.boxBorder = RUIStyle.Default.border0;
    //         //add container
    //         let content = new RUIContainer();
    //         content.visible =true;
    //         content.position = RUIPosition.Offset;
    //         super.addChild(content);
    //         this.m_content = content;
    //         //add scrollbar
    //         this.addScrollBar();
    //     }
    //     private addScrollBar(){
    //         let hasVerticalBar = false;
    //         let scrollVertical = this.m_scrollVertical;
    //         if(scrollVertical != RUIScrollType.Disabled){
    //             let slider = new RUIScrollBar(RUIOrientation.Vertical,scrollVertical);
    //             slider.width = RUIScrollBar.BAR_SIZE;
    //             slider.position = RUIPosition.Relative;
    //             slider.right = 0;
    //             slider.top = 0;
    //             slider.bottom = 0;
    //             this.m_scrollBarV = slider;
    //             super.addChild(slider);
    //             var self = this;
    //             slider.EventOnScroll.on((val)=>{
    //                 self.setContentScrollPosVal(null,val.object);
    //             });
    //             hasVerticalBar = true;
    //         }
    //         let scrollHorizontal = this.m_scrollHorizontal;
    //         if(scrollHorizontal != RUIScrollType.Disabled){
    //             let slider = new RUIScrollBar(RUIOrientation.Horizontal,scrollHorizontal);
    //             slider.height = RUIScrollBar.BAR_SIZE;
    //             slider.position = RUIPosition.Relative;
    //             slider.left = 0;
    //             slider.right = hasVerticalBar ? RUIScrollBar.BAR_SIZE : 0;
    //             slider.bottom = 0;
    //             this.m_scrollBarH = slider;
    //             super.addChild(slider);
    //             var self = this;
    //             slider.EventOnScroll.on((val)=>{
    //                 self.setContentScrollPosVal(val.object,null);
    //             })
    //         }
    //     }
    //     private setContentScrollPosVal(xval?:number,yval?:number){
    //         this.setContentScrollPos(xval?(ROUND(-xval * this.m_content._calwidth)):null,yval?(-yval * this.m_content._calheight):null);
    //     }
    //     private setContentScrollPos(x?:number,y?:number){
    //         let changed = false;
    //         let content = this.m_content;
    //         if(x != null){
    //             let xpx = CLAMP(x,this.m_maxscrollH,0)
    //             if(!isNaN(xpx) && xpx != content.left){
    //                 content.left = xpx;
    //                 changed = true;
    //                 this.m_offsetValH = -xpx / content._calwidth;
    //                 this.m_scrollBarH.setBarPosVal(this.m_offsetValH);
    //             }
    //         }
    //         if(y != null){
    //             let ypx = CLAMP(y,this.m_maxscrollV,0)
    //             if(!isNaN(ypx) && ypx != content.top){
    //                 content.top = ypx;
    //                 changed= true;
    //                 this.m_offsetValV = -ypx / content._calheight;
    //                 this.m_scrollBarV.setBarPosVal(this.m_offsetValV);
    //             }
    //         }
    //         if(changed){
    //             this.setDirty();
    //         }
    //     }
    //     public onLayoutPost(){
    //         if(this.m_scrollVertical != RUIScrollType.Disabled){
    //             let maxScrollV = this._calheight -  this.m_content._calheight;
    //             if(maxScrollV >=0 ){
    //                 this.m_scrollBarV.setEnable(false);
    //             }
    //             else{
    //                 this.m_scrollBarV.setEnable(true);
    //                 this.m_maxscrollV = maxScrollV;
    //                 let val = this._calheight / this.m_content._calheight;
    //                 this.m_scrollBarV.setBarSizeVal(val);
    //             }
    //         }
    //         if(this.m_scrollHorizontal != RUIScrollType.Disabled){
    //             let maxScrollH =  this._calwidth - this.m_content._calwidth;
    //             if(maxScrollH >= 0){
    //                 this.m_scrollBarH.setEnable(false);
    //             }
    //             else{
    //                 this.m_scrollBarH.setEnable(true);
    //                 this.m_maxscrollH = maxScrollH;
    //                 let val =this._calwidth / this.m_content._calwidth;
    //                 this.m_scrollBarH.setBarSizeVal(val);
    //             }
    //         }
    //     }
    //     public onMouseWheel(e:RUIWheelEvent){
    //         let hasVertical = this.m_scrollVertical != RUIScrollType.Disabled;
    //         let hasHorizontal = this.m_scrollHorizontal != RUIScrollType.Disabled;
    //         let wheelVertical = true;
    //         if(hasVertical){
    //             if(hasHorizontal){
    //                 wheelVertical = this.wheelScroolPriority == RUIOrientation.Vertical;
    //             }
    //         }
    //         else{
    //             if(hasHorizontal){
    //                 wheelVertical = false;
    //             }
    //             else{
    //                 return;
    //             }
    //         }
    //         let delta = e.delta *0.5;
    //         let content = this.m_content;
    //         let newoffset = (wheelVertical ? content.top : content.left) - delta;
    //         if(wheelVertical){
    //             this.setContentScrollPos(null,newoffset);
    //         }
    //         else{
    //             this.setContentScrollPos(newoffset,null);
    //         }
    //         e.Use();
    //     }
    //     public addChild(ui:RUIObject){
    //         this.m_content.addChild(ui);
    //     }
    //     public removeChild(ui:RUIObject){
    //         this.m_content.removeChild(ui);
    //     }
    // }
    var RUIScrollView = /** @class */ (function (_super) {
        __extends(RUIScrollView, _super);
        function RUIScrollView(scrollH, scrollV) {
            if (scrollH === void 0) { scrollH = RUIScrollBar_1.RUIScrollType.Enabled; }
            if (scrollV === void 0) { scrollV = RUIScrollBar_1.RUIScrollType.Enabled; }
            var _this = _super.call(this) || this;
            _this.boxBorder = RUIStyle_5.RUIStyle.Default.border0;
            _this.padding = [1, 11, 11, 1];
            var content = new RUIContainer_8.RUIContainer();
            content.position = RUIObject_11.RUIPosition.Offset;
            _super.prototype.addChild.call(_this, content);
            _this.m_content = content;
            _this.scrollVertical = scrollV;
            _this.scrollHorizontal = scrollH;
            return _this;
        }
        Object.defineProperty(RUIScrollView.prototype, "scrollVertical", {
            get: function () {
                return this.m_scrolltypeV;
            },
            set: function (type) {
                var bar = this.m_scrollbarV;
                if (bar == null) {
                    bar = new RUIScrollBar_1.RUIScrollBar(RUIObject_11.RUIOrientation.Vertical, type);
                    bar.EventOnScroll.on(this.onBarScrollVertical.bind(this));
                    bar.position = RUIObject_11.RUIPosition.Relative;
                    bar.top = 0;
                    bar.bottom = 0;
                    bar.right = 0;
                    _super.prototype.addChild.call(this, bar);
                    this.m_scrollbarV = bar;
                }
                this.m_scrolltypeV = type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RUIScrollView.prototype, "scrollHorizontal", {
            get: function () {
                return this.m_scrolltypeH;
            },
            set: function (type) {
                var bar = this.m_scrollbarH;
                if (bar == null) {
                    bar = new RUIScrollBar_1.RUIScrollBar(RUIObject_11.RUIOrientation.Horizontal, type);
                    bar.EventOnScroll.on(this.onBarScrollHorizontal.bind(this));
                    bar.position = RUIObject_11.RUIPosition.Relative;
                    bar.left = 0;
                    bar.right = this.m_scrolltypeV == RUIScrollBar_1.RUIScrollType.Disabled ? 0 : RUIScrollBar_1.RUIScrollBar.BAR_SIZE;
                    bar.bottom = 0;
                    _super.prototype.addChild.call(this, bar);
                    this.m_scrollbarH = bar;
                }
                this.m_scrolltypeH = type;
            },
            enumerable: true,
            configurable: true
        });
        RUIScrollView.prototype.onBarScrollVertical = function (e) {
            this.m_content.top = -RUIObject_11.ROUND(e.object * (this.m_content._calheight));
        };
        RUIScrollView.prototype.onBarScrollHorizontal = function (e) {
            this.m_content.left = -RUIObject_11.ROUND(e.object * (this.m_content._calwidth));
        };
        RUIScrollView.prototype.setScrollPosition = function (h, v) {
            if (h != null)
                this.m_scrollbarH.scrollPos = 0;
            if (v != null)
                this.m_scrollbarV.scrollPos = 0;
        };
        RUIScrollView.prototype.updateScrollBarVertical = function () {
            var content = this.m_content;
            //Vertical
            var contenth = content._calheight;
            var contentvalV = 0;
            if (contenth > this._calheight) {
                contentvalV = (this._calheight - 12) / contenth;
            }
            if (contentvalV != this.m_contentvalV) {
                this.m_contentvalV = contentvalV;
                if (this.m_scrolltypeV != RUIScrollBar_1.RUIScrollType.Disabled) {
                    this.m_scrollbarV.scrollSize = contentvalV;
                }
                this.FixHorizontalBarSize();
            }
        };
        RUIScrollView.prototype.updateScrollBarHorizontal = function () {
            var content = this.m_content;
            //Horizontal
            var contentw = content._calwidth;
            var contentvalH = 0;
            if (contentw > this._calwidth) {
                contentvalH = (this._calheight - 12) / contentw;
            }
            if (contentvalH != this.m_contentvalH) {
                this.m_contentvalH = contentvalH;
                if (this.m_scrolltypeH != RUIScrollBar_1.RUIScrollType.Disabled) {
                    this.m_scrollbarH.scrollSize = contentvalH;
                }
            }
        };
        RUIScrollView.prototype.onLayoutPost = function () {
            this.updateScrollBarVertical();
            this.updateScrollBarHorizontal();
        };
        RUIScrollView.prototype.FixHorizontalBarSize = function () {
            if (this.m_scrollbarV.enabled) {
                this.m_scrollbarH.right = RUIScrollBar_1.RUIScrollBar.BAR_SIZE;
            }
            else {
                this.m_scrollbarH.right = 0;
            }
        };
        RUIScrollView.prototype.addChild = function (ui) {
            this.m_content.addChild(ui);
        };
        RUIScrollView.prototype.removeChild = function (ui) {
            this.m_content.removeChild(ui);
        };
        RUIScrollView.prototype.removeChildByIndex = function (index) {
            return this.m_content.removeChildByIndex(index);
        };
        RUIScrollView.prototype.hasChild = function (ui) {
            return this.m_content.hasChild(ui);
        };
        return RUIScrollView;
    }(RUIContainer_8.RUIContainer));
    exports.RUIScrollView = RUIScrollView;
});
define("rui/widget/RUITabView", ["require", "exports", "rui/RUIContainer", "rui/RUIObject", "rui/widget/RUIButtonGroup", "rui/widget/RUIButton", "rui/RUIStyle", "rui/RUIBinder", "rui/widget/RUIScrollView"], function (require, exports, RUIContainer_9, RUIObject_12, RUIButtonGroup_1, RUIButton_1, RUIStyle_6, RUIBinder_1, RUIScrollView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUITabView = /** @class */ (function (_super) {
        __extends(RUITabView, _super);
        function RUITabView(pages, tabpos) {
            if (tabpos === void 0) { tabpos = RUIObject_12.RUIConst.TOP; }
            var _this = _super.call(this) || this;
            _this.boxBorder = RUIStyle_6.RUIStyle.Default.primary;
            var self = _this;
            _this.m_pages = pages;
            var buttons;
            if (pages != null) {
                buttons = [];
                pages.forEach(function (page) {
                    buttons.push(new RUIButton_1.RUIButton(page.label, _this.onMenuClick.bind(self)));
                });
            }
            var pagewrap = new RUIScrollView_1.RUIScrollView();
            pagewrap.boxBorder = null;
            var menu;
            if (tabpos == RUIObject_12.RUIConst.TOP || tabpos == RUIObject_12.RUIConst.BOTTOM) {
                _this.boxOrientation = RUIObject_12.RUIOrientation.Vertical;
                menu = new RUIButtonGroup_1.RUIButtonGroup(buttons, RUIObject_12.RUIOrientation.Horizontal);
                if (tabpos == RUIObject_12.RUIConst.TOP) {
                    _super.prototype.addChild.call(_this, menu);
                    _super.prototype.addChild.call(_this, pagewrap);
                }
                else {
                    _super.prototype.addChild.call(_this, pagewrap);
                    _super.prototype.addChild.call(_this, menu);
                }
            }
            else {
                _this.boxOrientation = RUIObject_12.RUIOrientation.Horizontal;
                menu = new RUIButtonGroup_1.RUIButtonGroup(buttons, RUIObject_12.RUIOrientation.Vertical);
                menu.width = 100;
                RUIBinder_1.RUIBind(_this, "_calheight", function (v) { return menu.height = v; });
                if (tabpos == RUIObject_12.RUIConst.LEFT) {
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
            //Bind
            RUIBinder_1.RUIBind(_this, "_calheight", function (v) { return pagewrap.height = v; });
            RUIBinder_1.RUIBind(_this, "_calwidth", function (v) { return pagewrap.width = v - 100; });
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
                wrap.setScrollPosition(0, 0);
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
    }(RUIContainer_9.RUIContainer));
    exports.RUITabView = RUITabView;
});
define("rui/widget/RUICollapsibleContainer", ["require", "exports", "rui/RUIContainer", "rui/widget/RUIButton", "rui/RUI", "rui/RUIStyle"], function (require, exports, RUIContainer_10, RUIButton_2, RUI_9, RUIStyle_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUICollapsibleContainer = /** @class */ (function (_super) {
        __extends(RUICollapsibleContainer, _super);
        function RUICollapsibleContainer(label, show) {
            var _this = _super.call(this) || this;
            _this.m_show = show;
            _this.boxBorder = RUIStyle_7.RUIStyle.Default.border0;
            _this.boxBackground = RUIStyle_7.RUIStyle.Default.background0;
            _this.padding = RUI_9.RUI.Vector(1);
            var button = new RUIButton_2.RUIButton(label, _this.onButtonClick.bind(_this));
            _super.prototype.addChild.call(_this, button);
            var container = new RUIContainer_10.RUIContainer();
            _this.m_container = container;
            if (_this.m_show)
                _super.prototype.addChild.call(_this, container);
            console.log(_this.m_container);
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
    }(RUIContainer_10.RUIContainer));
    exports.RUICollapsibleContainer = RUICollapsibleContainer;
});
define("rui/widget/RUIDebug", ["require", "exports", "rui/RUIContainer", "rui/widget/RUILabel", "rui/widget/RUIButton", "rui/RUIRectangle", "rui/RUIObject", "rui/widget/RUIButtonGroup", "rui/RUIStyle", "rui/RUIFlexContainer", "rui/RUI", "rui/widget/RUITabView", "rui/widget/RUIScrollBar", "rui/widget/RUIScrollView", "rui/widget/RUICollapsibleContainer"], function (require, exports, RUIContainer_11, RUILabel_1, RUIButton_3, RUIRectangle_3, RUIObject_13, RUIButtonGroup_2, RUIStyle_8, RUIFlexContainer_1, RUI_10, RUITabView_1, RUIScrollBar_2, RUIScrollView_2, RUICollapsibleContainer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RUIDebug = /** @class */ (function (_super) {
        __extends(RUIDebug, _super);
        function RUIDebug() {
            var _this = _super.call(this) || this;
            _this.boxBorder = RUIStyle_8.RUIStyle.Default.border0;
            _this.position = RUIObject_13.RUIPosition.Absolute;
            _this.left = 100;
            _this.right = 100;
            _this.top = 100;
            _this.bottom = 100;
            var pages = [];
            pages.push({ label: 'basis', ui: _this.PageBasis() });
            pages.push({ label: 'container', ui: _this.PageContainer() });
            var tabview = new RUITabView_1.RUITabView(pages, RUIObject_13.RUIConst.LEFT);
            tabview.position = RUIObject_13.RUIPosition.Relative;
            tabview.left = 0;
            tabview.right = 0;
            tabview.top = 0;
            tabview.bottom = 0;
            _this.addChild(tabview);
            return _this;
            // this.BasisEnable();
            // this.BasisChildren();
            // this.LayoutContainer();
            // this.LayoutFlexContainer();
            // this.LayoutClip();
            // this.LayoutMarginPadding();
            // this.WidgetButtons();
            // this.WidgetLabel();
            // this.WidgetTabView();
            // this.WidgetScrollView();
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
        RUIDebug.prototype.PageBasis = function () {
            var container = new RUIContainer_11.RUIContainer();
            this.PageBasisAddRemove(container);
            return container;
        };
        RUIDebug.prototype.PageContainer = function () {
            var container = new RUIContainer_11.RUIContainer();
            this.PageContainerRUIContainer(container);
            this.PageContainerMarginPadding(container);
            this.PageContainerFlexContainer(container);
            return container;
        };
        RUIDebug.prototype.PageContainerRUIContainer = function (parent) {
            var collapse = new RUICollapsibleContainer_1.RUICollapsibleContainer('RUIContainer', true);
            collapse.width = 400;
            parent.addChild(collapse);
            {
                collapse.addChild(new RUILabel_1.RUILabel('Vertical'));
                var c = new RUIContainer_11.RUIContainer();
                c.boxOrientation = RUIObject_13.RUIOrientation.Vertical;
                c.boxBorder = RUIStyle_8.RUIStyle.Default.primary;
                collapse.addChild(c);
                c.addChild(new RUIRectangle_3.RUIRectangle(50, 30));
                c.addChild(new RUIRectangle_3.RUIRectangle(100, 30));
            }
            {
                collapse.addChild(new RUILabel_1.RUILabel('Horizontal'));
                var c = new RUIContainer_11.RUIContainer();
                c.boxBorder = RUIStyle_8.RUIStyle.Default.primary;
                c.margin = [0, 0, 0, 10];
                c.boxOrientation = RUIObject_13.RUIOrientation.Horizontal;
                collapse.addChild(c);
                c.addChild(new RUIRectangle_3.RUIRectangle(30, 50));
                c.addChild(new RUIRectangle_3.RUIRectangle(30, 100));
                c.addChild(new RUIRectangle_3.RUIRectangle(30, 70));
            }
            {
                collapse.addChild(new RUILabel_1.RUILabel('Nested'));
                var c = new RUIContainer_11.RUIContainer();
                c.boxBorder = RUIStyle_8.RUIStyle.Default.primary;
                c.margin = [0, 0, 0, 10];
                c.boxOrientation = RUIObject_13.RUIOrientation.Vertical;
                collapse.addChild(c);
                c.addChild(new RUIRectangle_3.RUIRectangle(50, 30));
                {
                    var c1 = new RUIContainer_11.RUIContainer();
                    c1.boxOrientation = RUIObject_13.RUIOrientation.Horizontal;
                    c1.addChild(new RUIRectangle_3.RUIRectangle(30, 30));
                    c1.addChild(new RUIRectangle_3.RUIRectangle(30, 50));
                    c1.addChild(new RUIRectangle_3.RUIRectangle(30, 10));
                    c.addChild(c1);
                }
                c.addChild(new RUIRectangle_3.RUIRectangle(70, 30));
            }
        };
        RUIDebug.prototype.PageContainerMarginPadding = function (parent) {
            var collapse = new RUICollapsibleContainer_1.RUICollapsibleContainer('Margin/Padding', true);
            collapse.width = 400;
            parent.addChild(collapse);
            var c = new RUIContainer_11.RUIContainer();
            c.boxOrientation = RUIObject_13.RUIOrientation.Horizontal;
            collapse.addChild(c);
            {
                var c1 = new RUIContainer_11.RUIContainer();
                c1.margin = [0, 20, 0, 20];
                c1.boxBorder = RUI_10.RUI.RED;
                c1.width = 50;
                c1.padding = [1, 1, 1, -20];
                c.addChild(c1);
                c1.addChild(new RUIRectangle_3.RUIRectangle(50, 30));
            }
            {
                var c2 = new RUIContainer_11.RUIContainer();
                c2.margin = [0, 20, 0, 20];
                c2.boxBorder = RUI_10.RUI.RED;
                c2.width = 50;
                c2.padding = [1, 1, 1, -20];
                c2.boxClip = RUIContainer_11.RUIContainerClipType.NoClip;
                c.addChild(c2);
                c2.addChild(new RUIRectangle_3.RUIRectangle(50, 30));
            }
            {
                var c3 = new RUIContainer_11.RUIContainer();
                c3.margin = [0, 20, 0, 20];
                c3.boxBorder = RUI_10.RUI.RED;
                c3.width = 50;
                c3.padding = [1, 1, 1, 20];
                c.addChild(c3);
                c3.addChild(new RUIRectangle_3.RUIRectangle(50, 30));
            }
            {
                var c4 = new RUIContainer_11.RUIContainer();
                c4.margin = [0, 20, 0, 20];
                c4.boxBorder = RUI_10.RUI.RED;
                c4.width = 50;
                c4.padding = [1, 1, 1, 20];
                c.addChild(c4);
                var r = new RUIRectangle_3.RUIRectangle(50, 30);
                r.isClip = false;
                c4.addChild(r);
            }
        };
        RUIDebug.prototype.PageContainerFlexContainer = function (parent) {
            var collapse = new RUICollapsibleContainer_1.RUICollapsibleContainer('FlexContainer', true);
            collapse.width = 400;
            parent.addChild(collapse);
            var fc = new RUIContainer_11.RUIContainer();
            collapse.addChild(fc);
            fc.boxOrientation = RUIObject_13.RUIOrientation.Horizontal;
            fc.boxBorder = RUIStyle_8.RUIStyle.Default.primary;
            fc.padding = [3, 3, 3, 3];
            fc.margin = [0, 0, 10, 0];
            {
                var c = new RUIFlexContainer_1.RUIFlexContainer();
                fc.addChild(c);
                c.boxOrientation = RUIObject_13.RUIOrientation.Horizontal;
                c.boxBorder = RUIStyle_8.RUIStyle.Default.primary;
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
            {
                var c = new RUIFlexContainer_1.RUIFlexContainer();
                fc.addChild(c);
                c.boxOrientation = RUIObject_13.RUIOrientation.Vertical;
                c.boxBorder = RUIStyle_8.RUIStyle.Default.primary;
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
            {
                var c = new RUIFlexContainer_1.RUIFlexContainer();
                fc.addChild(c);
                c.boxOrientation = RUIObject_13.RUIOrientation.Vertical;
                c.boxBorder = RUIStyle_8.RUIStyle.Default.primary;
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
            var fc2 = new RUIContainer_11.RUIContainer();
            collapse.addChild(fc2);
            fc2.boxOrientation = RUIObject_13.RUIOrientation.Horizontal;
            fc2.boxBorder = RUIStyle_8.RUIStyle.Default.primary;
            fc2.padding = [3, 3, 3, 3];
            fc2.margin = [20, 0, 10, 0];
            {
                var c1 = new RUIFlexContainer_1.RUIFlexContainer();
                c1.padding = RUI_10.RUI.Vector(3);
                c1.height = 100;
                fc2.addChild(c1);
                var r1 = new RUIRectangle_3.RUIRectangle();
                r1.flex = 1;
                r1.width = 100;
                var r2 = new RUIButton_3.RUIButton('flexbtn');
                r2.height = 50;
                r2.width = 120;
                var r3 = new RUIRectangle_3.RUIRectangle();
                r3.flex = 2;
                r3.width = 30;
                c1.addChild(r1);
                c1.addChild(r2);
                c1.addChild(r3);
            }
        };
        RUIDebug.prototype.PageBasisAddRemove = function (parent) {
            var collapse = new RUICollapsibleContainer_1.RUICollapsibleContainer('remove/add children', true);
            collapse.width = 400;
            collapse.padding = RUI_10.RUI.Vector(3);
            collapse.boxBorder = RUIStyle_8.RUIStyle.Default.primary;
            parent.addChild(collapse);
            var c = new RUIContainer_11.RUIContainer();
            c.boxOrientation = RUIObject_13.RUIOrientation.Horizontal;
            collapse.addChild(c);
            var btnAdd = new RUIButton_3.RUIButton('Add', function (b) {
                c.addChild(new RUIRectangle_3.RUIRectangle(20, 20));
                c.setDirty();
            });
            btnAdd.width = 50;
            collapse.addChild(btnAdd);
            var btnDel = new RUIButton_3.RUIButton('Remove', function (b) {
                c.removeChildByIndex(0);
            });
            btnDel.width = 50;
            collapse.addChild(btnDel);
        };
        RUIDebug.prototype.BasisEnable = function () {
            this.addChild(new RUILabel_1.RUILabel('0.0-Enabled'));
            var container = new RUIContainer_11.RUIContainer();
            container.boxBorder = RUIStyle_8.RUIStyle.Default.primary;
            container.boxOrientation = RUIObject_13.RUIOrientation.Horizontal;
            container.padding = RUI_10.RUI.Vector(2);
            this.addChild(container);
            //container
            {
                var c = new RUIContainer_11.RUIContainer();
                c.padding = RUI_10.RUI.Vector(3);
                c.boxBorder = RUIStyle_8.RUIStyle.Default.primary;
                container.addChild(c);
                var r1 = new RUIRectangle_3.RUIRectangle(120, 20);
                var btn = new RUIButton_3.RUIButton('enable/disable', function (b) {
                    r1.enabled = !r1.enabled;
                    r1.setDirty(true);
                });
                btn.width = 100;
                c.addChild(btn);
                c.addChild(r1);
            }
            //container has  single child
            {
                var rect = new RUIRectangle_3.RUIRectangle(50, 50);
                rect.enabled = true;
                var btn = new RUIButton_3.RUIButton("ClickMe", function (b) {
                    rect.enabled = !rect.enabled;
                    rect.setDirty(true);
                });
                btn.width = 50;
                var c = new RUIContainer_11.RUIContainer();
                c.padding = RUI_10.RUI.Vector(3);
                c.boxBorder = RUIStyle_8.RUIStyle.Default.primary;
                c.addChild(rect);
                container.addChild(c);
                container.addChild(btn);
            }
            //flex
            {
                var c = new RUIFlexContainer_1.RUIFlexContainer();
                c.padding = RUI_10.RUI.Vector(3);
                c.boxBorder = RUIStyle_8.RUIStyle.Default.primary;
                c.height = 70;
                var r = new RUIRectangle_3.RUIRectangle(120);
                r.flex = 1;
                var btn = new RUIButton_3.RUIButton('enable/disable', function (b) {
                    r.enabled = !r.enabled;
                    r.setDirty(true);
                });
                btn.width = 100;
                btn.flex = 2;
                c.addChild(btn);
                c.addChild(r);
                container.addChild(c);
            }
            //flex has single child
            {
                var r2 = new RUIRectangle_3.RUIRectangle(50, 50);
                r2.flex = 1;
                r2.enabled = true;
                var btn = new RUIButton_3.RUIButton("ClickMe", function (b) {
                    r2.enabled = !r2.enabled;
                    r2.setDirty(true);
                });
                btn.width = 50;
                var c2 = new RUIFlexContainer_1.RUIFlexContainer();
                c2.padding = RUI_10.RUI.Vector(3);
                c2.height = 56;
                c2.boxBorder = RUIStyle_8.RUIStyle.Default.primary;
                c2.addChild(r2);
                container.addChild(c2);
                container.addChild(btn);
            }
        };
        RUIDebug.prototype.LayoutClip = function () {
            var label = new RUILabel_1.RUILabel('1.1-LayoutClip');
            this.addChild(label);
            var container = new RUIContainer_11.RUIContainer();
            this.addChild(container);
            container.boxOrientation = RUIObject_13.RUIOrientation.Horizontal;
            container.boxBorder = RUIStyle_8.RUIStyle.Default.primary;
            container.padding = [3, 3, 3, 3];
            {
                var container2 = new RUIContainer_11.RUIContainer();
                container2.padding = [2, 2, 2, 2];
                container2.margin = [0, 50, 0, 0];
                container2.height = 94;
                container2.width = 40;
                container2.boxBorder = RUIStyle_8.RUIStyle.Default.primary;
                container2.boxClip = RUIContainer_11.RUIContainerClipType.NoClip;
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
                var container1 = new RUIContainer_11.RUIContainer();
                container1.padding = [2, 2, 2, 2];
                container1.margin = [0, 50, 0, 0];
                container1.height = 94;
                container1.width = 40;
                container1.boxBorder = RUIStyle_8.RUIStyle.Default.primary;
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
                var container1 = new RUIContainer_11.RUIContainer();
                container1.padding = [2, 2, 2, 2];
                container1.height = 94;
                container1.width = 40;
                container1.boxBorder = RUIStyle_8.RUIStyle.Default.primary;
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
                var c = new RUIContainer_11.RUIContainer();
                c.padding = [2, 2, 2, 2];
                c.margin = [0, 0, 0, 50];
                c.height = 100;
                c.width = 100;
                c.boxBorder = RUIStyle_8.RUIStyle.Default.primary;
                container.addChild(c);
                var c1 = new RUIContainer_11.RUIContainer();
                c1.padding = RUI_10.RUI.Vector(10);
                c1.width = 70;
                c1.height = 70;
                c1.boxBorder = RUIStyle_8.RUIStyle.Default.primary;
                c1.position = RUIObject_13.RUIPosition.Offset;
                c1.left = 50;
                c1.top = 70;
                c1.addChild(new RUIRectangle_3.RUIRectangle(60, 60));
                c.addChild(c1);
                var c2 = new RUIContainer_11.RUIContainer();
                c2.boxBorder = RUIStyle_8.RUIStyle.Default.primary;
                c2.boxClip = RUIContainer_11.RUIContainerClipType.ClipSelf;
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
            this.addChild(new RUIButton_3.RUIButton('Button1'));
            {
                var btn1 = new RUIButton_3.RUIButton('LongText');
                btn1.width = 70;
                this.addChild(btn1);
            }
            //Button in container
            {
                var c = new RUIContainer_11.RUIContainer();
                c.width = 100;
                c.padding = [1, 1, 1, -50];
                c.boxBorder = RUIStyle_8.RUIStyle.Default.primary;
                this.addChild(c);
                var btn = new RUIButton_3.RUIButton('Hello');
                btn.width = 100;
                c.addChild(btn);
            }
            //ButtonGroup
            {
                var btnGroup = new RUIButtonGroup_2.RUIButtonGroup([
                    new RUIButton_3.RUIButton('AAA'),
                    new RUIButton_3.RUIButton('BBB'),
                    new RUIButton_3.RUIButton('CCC'),
                    new RUIButton_3.RUIButton('DDD'),
                    new RUIButton_3.RUIButton('EEE'),
                ], RUIObject_13.RUIOrientation.Horizontal);
                btnGroup.width = 450;
                this.addChild(btnGroup);
                // let canvas = new RUICanvas();
                // this.addChild(canvas);
                var btnGroupSwitch = new RUIButton_3.RUIButton('Switch BtnGroup', function (b) {
                    var orit = btnGroup.boxOrientation == RUIObject_13.RUIOrientation.Horizontal;
                    btnGroup.boxOrientation = orit ? RUIObject_13.RUIOrientation.Vertical : RUIObject_13.RUIOrientation.Horizontal;
                    if (orit) {
                        btnGroup.width = 120;
                        btnGroup.height = 70;
                    }
                    else {
                        btnGroup.width = 450;
                        btnGroup.height = RUIObject_13.RUIAuto;
                    }
                });
                this.addChild(btnGroupSwitch);
            }
        };
        RUIDebug.prototype.WidgetLabel = function () {
            this.addChild(new RUILabel_1.RUILabel("2.1-Label"));
        };
        RUIDebug.prototype.WidgetTabView = function () {
            {
                var c1 = new RUIContainer_11.RUIContainer();
                c1.addChild(new RUIRectangle_3.RUIRectangle(100, 20));
                c1.addChild(new RUIRectangle_3.RUIRectangle(40, 50));
                c1.addChild(new RUIRectangle_3.RUIRectangle(500, 100));
                c1.addChild(new RUIRectangle_3.RUIRectangle(20, 200));
                var tabview1 = new RUITabView_1.RUITabView([
                    { label: 'Tab1', ui: new RUIRectangle_3.RUIRectangle(30, 40) },
                    { label: 'Tab2', ui: c1 }
                ], RUIObject_13.RUIConst.LEFT);
                tabview1.width = 400;
                tabview1.height = 300;
                this.addChild(tabview1);
            }
        };
        RUIDebug.prototype.WidgetScrollView = function () {
            this.addChild(new RUILabel_1.RUILabel("2.2-scrollView"));
            {
                var c = new RUIContainer_11.RUIContainer();
                c.boxOrientation = RUIObject_13.RUIOrientation.Horizontal;
                this.addChild(c);
                var sbarHorizontal = new RUIScrollBar_2.RUIScrollBar(RUIObject_13.RUIOrientation.Horizontal, RUIScrollBar_2.RUIScrollType.Always);
                sbarHorizontal.width = 500;
                this.addChild(sbarHorizontal);
                var btnszInc = new RUIButton_3.RUIButton('szInc', function (b) {
                    sbarHorizontal.scrollSize += 0.1;
                });
                btnszInc.width = 50;
                c.addChild(btnszInc);
                var btnszDec = new RUIButton_3.RUIButton('szDec', function (b) {
                    sbarHorizontal.scrollSize -= 0.1;
                });
                btnszDec.width = 50;
                c.addChild(btnszDec);
                var btnposInc = new RUIButton_3.RUIButton('posInc', function (b) {
                    sbarHorizontal.scrollPos += 0.1;
                });
                btnposInc.width = 50;
                c.addChild(btnposInc);
                var btnposDec = new RUIButton_3.RUIButton('posDec', function (b) {
                    sbarHorizontal.scrollPos -= 0.1;
                });
                btnposDec.width = 50;
                c.addChild(btnposDec);
            }
            {
                var c2 = new RUIContainer_11.RUIContainer();
                c2.boxOrientation = RUIObject_13.RUIOrientation.Horizontal;
                c2.margin = [10, 0, 0, 0];
                this.addChild(c2);
                var sbarVertical = new RUIScrollBar_2.RUIScrollBar(RUIObject_13.RUIOrientation.Vertical, RUIScrollBar_2.RUIScrollType.Enabled);
                sbarVertical.height = 120;
                c2.addChild(sbarVertical);
                {
                    var sv = new RUIScrollView_2.RUIScrollView(RUIScrollBar_2.RUIScrollType.Always, RUIScrollBar_2.RUIScrollType.Always);
                    sv.margin = [0, 0, 0, 10];
                    sv.width = 150;
                    sv.height = 150;
                    c2.addChild(sv);
                    var rect1 = new RUIRectangle_3.RUIRectangle(250, 50);
                    var btn = new RUIButton_3.RUIButton('Click', function (b) {
                        if (sv.hasChild(rect1)) {
                            sv.removeChild(rect1);
                        }
                        else {
                            sv.addChild(rect1);
                        }
                    });
                    btn.width = 100;
                    btn.height = 50;
                    sv.addChild(new RUIRectangle_3.RUIRectangle(50, 50));
                    sv.addChild(btn);
                    sv.addChild(new RUIRectangle_3.RUIRectangle(20, 50));
                }
            }
        };
        return RUIDebug;
    }(RUIContainer_11.RUIContainer));
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
define("rui/widget/RUISlider", ["require", "exports", "rui/RUIObject", "rui/RUIStyle"], function (require, exports, RUIObject_14, RUIStyle_9) {
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
            cmd.DrawRectWithColor(rect, RUIStyle_9.RUIStyle.Default.primary0);
        };
        return RUISlider;
    }(RUIObject_14.RUIObject));
    exports.RUISlider = RUISlider;
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
