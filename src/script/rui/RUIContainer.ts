import { RUIObject, RUIOverflow, RUIOrientation, RUIConst, RUIAuto, RUIPosition, ROUND, RUIRect, RUICLIP_NULL, RUIDefaultLayouter } from "./RUIObject";
import { RUICmdList } from "./RUICmdList";
import { RUIRoot } from "./RUIRoot";
import { RUIWheelEvent } from "./RUIEvent";
import { RUI, RUILayouter, RUIVal, RUISizePair, RUILayoutData, RUICHECK, SIZE } from "./RUI";

export enum RUIContainerUpdateMode {
    None,
    LayoutUpdate,
    LayoutFull,
}

export enum RUIContainerClipType {
    NoClip,
    Clip, /** Nesting clip */
    ClipSelf,
}

export class RUIContainer extends RUIObject {
    public boxClip: RUIContainerClipType = RUIContainerClipType.Clip;
    public boxOverflow: RUIOverflow = RUIOverflow.Clip;
    public boxOrientation: RUIOrientation = RUIOrientation.Vertical;
    public boxBorder?: number[] = null;
    public boxBackground?: number[] = null;
    public boxSideExtens: boolean = false;

    public boxMatchWidth: boolean = false;
    public boxMatchHeight: boolean = false;

    public children: RUIObject[] = [];

    public layoutSideChildMax?: number;
    public layoutSkipDraw: boolean = false;

    public layoutClipRect: RUIRect;
    public layoutClipRectPadded: RUIRect;
    /** mark execute for children ui of @function traversal */
    public skipChildTraversal: boolean = false;

    public constructor(orit: RUIOrientation = RUIOrientation.Vertical) {
        super();
        this.boxOrientation = orit;
        this.layouter = RUIContainerLayouter.Layouter;
    }

    public get isVertical() {
        return this.boxOrientation == RUIOrientation.Vertical;
    }

    public addChild(ui: RUIObject) {
        if (ui == null) {
            console.warn('can not add undefined child');
            return;
        }
        let c = this.children;
        if (c.indexOf(ui) >= 0) {
            console.warn('skip add child');
            return;
        }

        ui.parent = this;
        ui.setRoot(this._root);
        c.push(ui);

        ui.setDirty();
    }

    public hasChild(ui: RUIObject): boolean {
        return this.children.indexOf(ui) >= 0;
    }

    public removeChild(ui: RUIObject) {
        if (ui == null) return;
        let c = this.children;
        let index = c.indexOf(ui);
        if (index < 0) return;
        c.splice(index, 1);
        this.setDirty();
        ui.parent = null;
        ui.setRoot(null);
    }

    public removeChildByIndex(index: number): RUIObject {
        let c = this.children;
        if (index < 0 || index >= c.length) return null;
        let ui = c[index];
        c.splice(index, 1);
        this.setDirty();
        ui.parent = null;
        ui.setRoot(null);
    }

    protected containerUpdateCheck(): RUIContainerUpdateMode {
        if (!this.isdirty && !this._resized) {
            let children = this.children;
            let cisdirty = false;
            let cisresize = false;
            for (var i = 0, clen = children.length; i < clen; i++) {
                let c = children[i];
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
    }

    public LayoutRelativeUI(container: RUIContainer, children: RUIObject[]) {
        let root = container._root.root;

        let rw = root.rCalWidth;
        let rh = root.rCalHeight;
        let cw = container.rCalWidth;
        let ch = container.rCalHeight;

        let layoutRelative = RUIDefaultLayouter.LayoutRelative;

        for (var i = 0, clen = children.length; i < clen; i++) {
            let c = children[i];
            if (c.isOnFlow) continue;

            let isrelative = c.position == RUIPosition.Relative;
            if (isrelative) {
                layoutRelative(c, cw, ch);
            }
            else {
                layoutRelative(c, rw, rh);
            }
        }
    }

    public onDraw(cmd: RUICmdList) {
        this.onDrawPre(cmd);
        if (this.clipMask == null) return;

        let children = this.children;
        for (var i = 0, clen = children.length; i < clen; i++) {
            let c = children[i];
            if (!c.enable) continue;

            cmd.currentOrder = c._order;

            if (c.visible) {
                if (c.isClip) {
                    c.clipMask = c.isOnFlow ? this.layoutClipRectPadded : this.layoutClipRect;
                    c.onDraw(cmd);
                }
                else {
                    let parent = this.parent;
                    if (parent == null) {
                        c.clipMask = this._root.rootRect;
                    }
                    else {
                        c.clipMask = c.isOnFlow ? parent.layoutClipRectPadded : parent.layoutClipRect;
                    }
                    c.onDraw(cmd);
                }
            }
        }

        this.onDrawPost(cmd);
    }

    public onDrawPre(cmd: RUICmdList) {
        let boxclip = this.boxClip;
        let rect = this.calculateRect();
        this._rect = rect;
        let paddingrect = this.RectMinusePadding(rect, this.padding);

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
                let parent = this.parent;
                let rootrect = this._root.rootRect;
                this.layoutClipRect = RUI.RectClip(rect, parent == null ? rootrect : parent.layoutClipRect);
                this.layoutClipRectPadded = RUI.RectClip(paddingrect, parent == null ? rootrect : (this.isOnFlow ? parent.layoutClipRectPadded : parent.layoutClipRect));
                break;
            case RUIContainerClipType.ClipSelf:
                this.layoutClipRect = rect;
                this.layoutClipRectPadded = paddingrect;
                break;
        }

        let cliprect = this.layoutClipRect;
        this._drawClipRect = cliprect;

        cmd.currentOrder = this._order;
        //background
        if (this.boxBackground != null && cliprect != null) cmd.DrawRectWithColor(rect, this.boxBackground, cliprect);
    }
    public onDrawPost(cmd: RUICmdList) {
        let rect = this._rect;
        let clipRect = this._drawClipRect;
        if (clipRect == null) return;
        //cmd.currentOrder = this._order;
        if (this.boxBorder != null && rect != RUICLIP_NULL) cmd.DrawBorder(rect, this.boxBorder, clipRect);
    }

    protected RectMinusePadding(recta: RUIRect, offset: number[]): RUIRect {
        let pleft = Math.max(offset[3], 0);
        let ptop = Math.max(offset[0], 0);

        return [
            recta[0] + pleft,
            recta[1] + ptop,
            recta[2] - Math.max(offset[1], 0) - pleft,
            recta[3] - Math.max(offset[2], 0) - ptop
        ];
    }

    public setRoot(root: RUIRoot) {
        if (this._root == root) return;

        this._root = root;

        let children = this.children;
        for (var i = 0, clen = children.length; i < clen; i++) {
            let c = children[i];
            c.setRoot(root);
        }
    }

    public onMouseWheel(e: RUIWheelEvent) {

    }

    public traversal(f: (c: RUIObject) => void) {

        if (f == null) return;
        f(this);
        if (this.skipChildTraversal) return;
        let children = this.children;
        for (var i = 0, clen = children.length; i < clen; i++) {
            let c = children[i];
            if (c instanceof RUIContainer) {
                c.traversal(f);
            }
            else {
                f(c);
            }
        }
    }
}

export class RUIContainerLayouter implements RUILayouter {

    private static s_layouter = new RUIContainerLayouter();
    public static get Layouter(): RUIContainerLayouter {
        return this.s_layouter;
    }

    public Layout(ui: RUIObject) {
        let cui = <RUIContainer>ui;
        let children = cui.children;
        let clen = children.length;
        let flowChildren = [];
        for (var i = 0; i < clen; i++) {
            let c = children[i];
            if (c.isOnFlow) flowChildren.push(c);
        }
        children = flowChildren;
        clen = children.length;
        let isvertical = cui.isVertical;

        cui.layoutSideChildMax = null;

        let f = (c) => c.Layout();
        var maxsize = -1;
        if (isvertical && cui.rWidth == RUIAuto) {
            f = (c) => {
                c.Layout();
                let clayoutwidth = c.layoutWidth;
                if (clayoutwidth != RUIAuto) maxsize = Math.max(maxsize, clayoutwidth);
            }
        }
        else if (!isvertical && cui.rHeight == RUIAuto) {
            f = (c) => {
                c.Layout();
                if (c.layoutHeight != RUIAuto) maxsize = Math.max(maxsize, c.layoutHeight);
            }
        }

        for (var i = 0; i < clen; i++) {
            let c = children[i];
            f(c);
        }

        cui.layoutSideChildMax = maxsize;

        let parent = cui.parent;
        let exten = cui.boxSideExtens && (parent == null || (parent != null && (<RUIContainer>parent).boxOrientation == cui.boxOrientation));

        //width
        if (cui.rWidth != RUIAuto) {
            cui.layoutWidth = cui.rWidth;
        }
        else {
            //exten
            if (isvertical) {
                if (exten) {
                    cui.layoutWidth = RUIAuto;
                }
                else {
                    if (maxsize != -1) {
                        cui.layoutWidth = maxsize;
                    }
                    else {
                        cui.layoutWidth = RUIAuto;
                    }
                }
            }
            else {
                cui.layoutWidth = RUIAuto;
            }
        }
        //height
        if (cui.rHeight != RUIAuto) {
            cui.layoutHeight = cui.rHeight;
        }
        else {
            //exten
            if (isvertical) {
                cui.layoutHeight = RUIAuto;
            }
            else {
                if (exten) {
                    cui.layoutHeight = RUIAuto;
                }
                else {
                    if (maxsize != -1) {
                        cui.layoutHeight = maxsize;
                    } else {
                        cui.layoutHeight = RUIAuto;
                    }
                }
            }
        }
    }

    public LayoutPost(ui: RUIObject, data: RUILayoutData) {
        if (ui.layoutHeight == null) {
            console.error(ui);
            throw new Error();
        }

        if (ui.layoutWidth == null) {
            throw new Error();
        }

        let cui = <RUIContainer>ui;
        let children = cui.children;
        let clen = children.length;
        let flowChildren = [];
        for (var i = 0; i < clen; i++) {
            let c = children[i];
            if (c.isOnFlow) flowChildren.push(c);
        }
        children = flowChildren;
        clen = children.length;

        if (data.containerHeight == null) {
            throw new Error();
        }
        if (data.containerWidth == null) {
            throw new Error();
        }

        let isFlexWidth = false;
        let isFlexHeight = false;

        //Fill flex
        let dataFlexWidth = data.flexWidth;
        let dataFlexHeight = data.flexHeight;
        if (dataFlexWidth != null && dataFlexWidth != RUIAuto) {
            cui.layoutWidth = data.flexWidth;
            isFlexWidth = true;
        }
        if (dataFlexHeight != null && dataFlexHeight != RUIAuto) {
            cui.layoutHeight = data.flexHeight;
            isFlexHeight = true;
        }

        //Fill auto
        var isvertical = cui.isVertical;

        if (isvertical) {
            if (cui.layoutWidth == RUIAuto) {
                cui.layoutWidth = data.containerWidth;
            }
        }
        else {
            if (cui.layoutHeight == RUIAuto) {
                cui.layoutHeight = data.containerHeight;
            }
        }
        //padding
        let padding = cui.padding;
        var paddingleft = padding[3];
        var paddingtop = padding[0];
        let paddingright = padding[1];
        let paddingbottom = padding[2];

        let paddinghorizontal = paddingleft + paddingright;
        let paddingvertical = paddingtop + paddingbottom;

        //Fixed Size
        if (cui.layoutWidth != RUIAuto && cui.layoutHeight != RUIAuto) {
            cui.rCalWidth = cui.layoutWidth;
            cui.rCalHeight = cui.layoutHeight;

            let cdata = new RUILayoutData();
            cdata.containerWidth = SIZE(cui.rCalWidth - paddinghorizontal);
            cdata.containerHeight = SIZE(cui.rCalHeight - paddingvertical);

            let accuSize = isvertical ? paddingtop : paddingleft;
            if (clen != 0) {
                if (isvertical) {
                    let marginSize = children[0].margin[RUIConst.TOP];
                    for (var i = 0; i < clen; i++) {
                        let c = children[i];
                        let cmargin = c.margin;

                        accuSize += Math.max(marginSize, cmargin[RUIConst.TOP]);
                        c.LayoutPost(cdata);
                        c.rOffx = paddingleft + cmargin[RUIConst.LEFT];
                        c.rOffy = accuSize;
                        accuSize += c.rCalHeight;
                        marginSize = cmargin[RUIConst.BOTTOM];

                        if (c.isPositionOffset) {
                            c.rOffx += c.positionOffsetX;
                            c.rOffy += c.positionOffsetY;
                        }
                    }
                }
                else {
                    let marginSize = children[0].margin[RUIConst.LEFT];
                    for (var i = 0; i < clen; i++) {
                        let c = children[i];
                        let cmargin = c.margin;
                        c.LayoutPost(cdata);

                        accuSize += Math.max(marginSize, cmargin[RUIConst.LEFT]);
                        c.rOffy = paddingtop + cmargin[RUIConst.TOP];
                        c.rOffx = accuSize;
                        accuSize += c.rCalWidth;
                        marginSize = cmargin[RUIConst.RIGHT];

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
        console.assert((cui.isVertical ? cui.layoutHeight : cui.layoutWidth) == RUIAuto);
        if (cui.isVertical) {
            let cdata = new RUILayoutData();
            cdata.containerWidth = SIZE(cui.layoutWidth - paddinghorizontal);
            cdata.containerHeight = SIZE(data.containerHeight - paddingvertical);

            var maxChildWidth = 0;
            var accuChildHeight = paddingtop;

            if (clen > 0) {
                let marginSize = children[0].margin[RUIConst.TOP];
                for (var i = 0; i < clen; i++) {
                    let c = children[i];
                    let cmargin = c.margin;
                    c.LayoutPost(cdata);
                    let cmarginleft = cmargin[RUIConst.LEFT];
                    accuChildHeight += Math.max(marginSize, cmargin[RUIConst.TOP])
                    c.rOffx = paddingleft + cmarginleft;
                    c.rOffy = accuChildHeight;
                    maxChildWidth = Math.max(maxChildWidth, c.rCalWidth + cmarginleft + cmargin[RUIConst.RIGHT]);
                    accuChildHeight += c.rCalHeight;
                    marginSize = cmargin[RUIConst.BOTTOM];

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
                    let paddinghorizontalFixed = SIZE(paddingleft) + SIZE(paddingright);
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
                    cui.rCalHeight = accuChildHeight - paddingtop + SIZE(paddingtop) + SIZE(paddingbottom);
                }
            }
            else {
                cui.rCalHeight = cui.layoutHeight;
            }
        }
        else {
            let cdata = new RUILayoutData();
            cdata.containerWidth = data.containerWidth;
            cdata.containerHeight = cui.layoutHeight;

            var maxChildHeight = 0;
            var accuChildWidth = paddingleft;

            if (clen > 0) {
                let marginSize = children[0].margin[RUIConst.LEFT];
                for (var i = 0; i < clen; i++) {
                    let c = children[i];
                    let cmargin = c.margin;
                    c.LayoutPost(cdata);
                    let cmargintop = cmargin[RUIConst.TOP];
                    accuChildWidth += Math.max(marginSize, cmargin[RUIConst.LEFT])
                    c.rOffy = paddingtop + cmargintop;
                    c.rOffx = accuChildWidth;
                    maxChildHeight = Math.max(maxChildHeight, c.rCalHeight + cmargintop + cmargin[RUIConst.BOTTOM]);
                    accuChildWidth += c.rCalWidth;
                    marginSize = cmargin[RUIConst.RIGHT];

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

                    let paddingverticalFix = SIZE(paddingtop) + SIZE(paddingbottom)
                    if (cui.boxSideExtens) {
                        if (maxChildHeight < data.containerHeight) {
                            cui.rCalHeight = data.containerHeight;
                        }
                        else {
                            cui.rCalHeight = maxChildHeight + paddingverticalFix;
                        }
                    } else {
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
                    cui.rCalWidth = accuChildWidth - paddingleft + SIZE(paddingleft) + SIZE(paddingright);
                }
            }
            else {
                cui.rCalWidth = cui.layoutWidth;
            }
        }
        cui.LayoutRelativeUI(cui, cui.children);
        return;
    }
}