import { RUIOrientation, RUIConst, RUIAuto, ROUND, RUIObject, RUIPosition } from "./RUIObject";
import { RUIContainer, RUIContainerUpdateMode } from "./RUIContainer";
import { RUILayouter, RUILayoutData, RUIVal } from "./RUI";


export class RUIFlexContainer extends RUIContainer {


    public layoutFlexAccu: number;
    public layoutFixedAccu: number;

    public constructor() {
        super();
        this.layouter = RUIFlexLayouter.Default;
    }

    public onLayout() {

        let isVertical = this.boxOrientation == RUIOrientation.Vertical;
        let children = this.children;

        let clen = children.length;

        //check for dirty
        let updateMode = this.containerUpdateCheck();
        if (updateMode == RUIContainerUpdateMode.None) return;

        //onLayoutPre

        for (var i = 0; i < clen; i++) {
            children[i].onLayoutPre();
        }

        if (updateMode == RUIContainerUpdateMode.LayoutUpdate) {
            for (var i = 0; i < clen; i++) {
                let c = children[i];
                if (!c._enabled) continue;
                c.onLayout();
            }
            return;
        }



        this.fillSize();

        if (null == (isVertical ? this._calheight : this._calwidth)) throw new Error();



        if (clen != 0) {
            //accumulate flex
            let flexaccu = 0;
            let fixedaccu = 0;

            let contentTotal = 0;
            let contentSide = 0;

            let contentwidth = contentTotal = this._calwidth - this.padding[RUIConst.LEFT] - this.padding[RUIConst.RIGHT];
            let contentheight = this._calheight - this.padding[RUIConst.TOP] - this.padding[RUIConst.BOTTOM];


            let sideIsAuto = false;

            if (isVertical) {
                contentTotal = contentheight;
                contentSide = contentwidth;

                sideIsAuto = this._calwidth == null;
            }
            else {
                contentTotal = contentwidth;
                contentSide = contentheight;

                sideIsAuto = this._calheight == null || this._calheight == RUIAuto;
            }

            let childMaxSide = RUIAuto;

            let marginAry: number[] = [];
            let marginValue = 0;
            let marginPos = isVertical ? RUIConst.TOP : RUIConst.LEFT;
            let marginPosSide = isVertical ? RUIConst.BOTTOM : RUIConst.RIGHT;
            let marginTotal = 0;

            let relativeChildren: RUIObject[] = [];

            for (var i = 0; i < clen; i++) {
                let c = children[i];

                if (!c._enabled) continue;

                if (!c.isOnFlow) {
                    relativeChildren.push(c);
                    continue;
                }

                if (c.flex == null) {
                    let cfixed = isVertical ? c.height : c.width;
                    if (cfixed == RUIAuto) {
                        throw new Error("flex object must have fixed size");
                    }
                    else {
                        fixedaccu += cfixed;
                    }
                }
                else {
                    flexaccu += c.flex;
                }

                let cmargin = c.margin;

                let cmarginValue = cmargin[marginPos];
                marginValue = Math.max(marginValue, cmarginValue);

                marginAry.push(marginValue);
                marginTotal += marginValue;
                marginValue = cmargin[marginPosSide];

                let cmaxside = 0;
                if (isVertical) {
                    cmaxside = c.width + cmargin[RUIConst.LEFT] + cmargin[RUIConst.RIGHT];
                }
                else {
                    cmaxside = c.height + cmargin[RUIConst.TOP] + cmargin[RUIConst.BOTTOM];
                }
                childMaxSide = Math.max(childMaxSide, cmaxside);
            }

            marginAry.push(marginValue);
            marginTotal += marginValue;

            let sizePerFlex = (contentTotal - fixedaccu - marginTotal) / flexaccu;

            let offset = this.padding[isVertical ? RUIConst.TOP : RUIConst.LEFT];
            let offsetside = this.padding[isVertical ? RUIConst.LEFT : RUIConst.TOP];

            if (childMaxSide != RUIAuto && sideIsAuto) {
                contentSide = childMaxSide;

                if (isVertical) {
                    this._calwidth = childMaxSide + this.padding[RUIConst.LEFT] + this.padding[RUIConst.RIGHT];
                }
                else {
                    this._calheight = childMaxSide + this.padding[RUIConst.TOP] + this.padding[RUIConst.BOTTOM];
                }
            }

            if (this._calwidth == null) {
                this._calwidth = 0;
            }
            if (this._calheight == null) {
                this._calheight = 0;
            }

            for (var i = 0; i < clen; i++) {
                let c = children[i];

                if (!c._enabled) continue;

                if (!c.isOnFlow) continue;

                let flowsize = c.flex == null ? (isVertical ? c.height : c.width) : ROUND(c.flex * sizePerFlex);

                if (isVertical) {
                    c._flexheight = flowsize;
                    c._flexwidth = (c.width == RUIAuto) ? contentSide : c.width;
                }
                else {
                    c._flexheight = (c.height == RUIAuto) ? contentSide : c.height;
                    c._flexwidth = flowsize;
                }

                c.onLayout();

                offset += marginAry[i];

                if (isVertical) {
                    c._caloffsety = offset;
                    c._caloffsetx = offsetside + c.margin[RUIConst.LEFT];
                    offset += c._calheight;
                }
                else {
                    c._caloffsety = offsetside + c.margin[RUIConst.TOP];
                    c._caloffsetx = offset;

                    offset += c._calwidth;
                }


                //offset
                c.fillPositionOffset();
            }


            this.onLayoutRelativeUI(relativeChildren);
        }
        else {
            if (this._calwidth == null) this._calwidth = 0;
            if (this._calheight == null) this._calheight = 0;
        }

        if (this._calwidth == null || this._calheight == null) {
            console.error(this);
            throw new Error();
        }

        this.isdirty = false;
        this._resized = false;

    }

}

export class RUIFlexLayouter implements RUILayouter {
    private static s_default = new RUIFlexLayouter();
    public static get Default(): RUIFlexLayouter {
        return this.s_default;
    }

    private constructor() {
    }

    private AccuFlex(flex: RUIFlexContainer, ui: RUIObject, isvertical: boolean) {
        if (ui.flex != null) {
            flex.layoutFlexAccu += ui.flex;
        }
        else {
            if (flex.isVertical) {
                if (ui.layoutHeight === RUIVal.Auto) {
                    throw new Error();
                }
                else {
                    flex.layoutFixedAccu += ui.layoutHeight.value;
                }
            }
            else {
                if (ui.layoutWidth === RUIVal.Auto) {
                    throw new Error();
                } else {
                    flex.layoutFixedAccu += ui.layoutWidth.value;
                }
            }
        }
    }

    public Layout(ui: RUIObject) {
        if (!(ui instanceof RUIFlexContainer)) throw new Error();
        var cui = <RUIFlexContainer>ui;


        let children = cui.children;
        let clen = children.length;

        let flowChildren = [];
        for (var i = 0; i < clen; i++) {
            let c = children[i];
            if (c.isOnFlow) flowChildren.push(c);
        }
        children = flowChildren;

        var self = this;

        cui.layoutWidth = cui.rWidth.Clone;
        cui.layoutHeight = cui.rHeight.Clone;

        cui.layoutFlexAccu = 0;
        cui.layoutFixedAccu = 0;



        if (cui.isVertical) {
            if (cui.layoutWidth == RUIVal.Auto) {
                let maxwidth = -1;
                children.forEach(c => {
                    c.Layout();
                    if (c.layoutWidth != RUIVal.Auto) {
                        maxwidth = Math.max(maxwidth, c.layoutWidth.value);
                    }
                    self.AccuFlex(cui, c, true);
                })
                cui.layoutWidth = maxwidth == -1 ? RUIVal.Auto : new RUIVal(maxwidth);
                return;
            }
            else {
                children.forEach(c => {
                    c.Layout();
                    self.AccuFlex(cui, c, true);
                });
                return;
            }
        }
        else {
            if (cui.layoutHeight === RUIVal.Auto) {

                let maxheight = -1;
                children.forEach(c => {
                    c.Layout();
                    if (c.layoutHeight != RUIVal.Auto) {
                        maxheight = Math.max(maxheight, c.layoutHeight.value);
                    }
                    self.AccuFlex(cui, c, false);
                })
                cui.layoutHeight = maxheight == -1 ? RUIVal.Auto : new RUIVal(maxheight);
                return;
            }
            else {

                children.forEach(c => {
                    c.Layout();
                    self.AccuFlex(cui, c, false);
                })
                return;
            }
        }
    }

    public LayoutPost(ui: RUIObject, data: RUILayoutData) {
        if (!(ui instanceof RUIFlexContainer)) throw new Error();



        var cui = <RUIFlexContainer>ui;
        let children = cui.children;
        var isvertical = cui.isVertical;

        //Fill flex
        if (data.flexWidth != null) {
            cui.layoutWidth = new RUIVal(data.flexWidth);
        }
        if (data.flexHeight != null) {
            cui.layoutHeight = new RUIVal(data.flexHeight);
        }

        if (ui.layoutWidth === RUIVal.Auto) {
            ui.layoutWidth = data.containerWidth.Clone;
        }
        if (ui.layoutHeight == RUIVal.Auto) {
            ui.layoutHeight = data.containerHeight.Clone;
        }

        //start flex calculate
        var sizePerFlex = 0;
        if (isvertical) {
            sizePerFlex = (cui.layoutHeight.value - cui.layoutFixedAccu) / cui.layoutFlexAccu;
        }
        else {
            sizePerFlex = (cui.layoutWidth.value - cui.layoutFixedAccu) / cui.layoutFlexAccu;
        }

        var cdata = new RUILayoutData();

        cdata.containerHeight = cui.layoutHeight.Clone;
        cdata.containerWidth = cui.layoutWidth.Clone;

        cui.rCalWidth = cui.layoutWidth.value;
        cui.rCalHeight = cui.layoutHeight.value;

        if (cui.boxSideExtens) {
            if (isvertical) {
                cdata.containerWidth = data.containerWidth.Clone;
                cui.rCalWidth = cdata.containerWidth.value;
            }
            else {
                cdata.containerHeight = data.containerHeight.Clone;
                cui.rCalHeight = cdata.containerHeight.value;
            }
        }

        var offset = 0;

        children.forEach(c => {
            if(!c.isOnFlow) return;
            let csize = 0;
            if (c.flex != null) {
                csize = ROUND(c.flex * sizePerFlex);
            } else {
                csize = isvertical ? c.layoutHeight.value : c.layoutWidth.value;
            }

            if (isvertical) {
                cdata.flexWidth = null;
                cdata.flexHeight = csize;
            }
            else {
                cdata.flexHeight = null;
                cdata.flexWidth = csize;
            }

            c.LayoutPost(cdata);

            if (isvertical) {
                c.rOffx = 0;
                c.rOffy = offset;

                offset += c.rCalHeight;
            }
            else {
                c.rOffx = offset;
                c.rOffy = 0;
                offset += c.rCalWidth;
            }

        });

        //Process relative

        cui.LayoutRelativeUI(cui,children);

    }

    
}