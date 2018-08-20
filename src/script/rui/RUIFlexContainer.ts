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
                if (ui.layoutHeight == RUIAuto) {
                    throw new Error();
                }
                else {
                    flex.layoutFixedAccu += ui.layoutHeight;
                }
            }
            else {
                if (ui.layoutWidth == RUIAuto) {
                    throw new Error();
                } else {
                    flex.layoutFixedAccu += ui.layoutWidth;
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

        cui.layoutWidth = cui.rWidth;
        cui.layoutHeight = cui.rHeight;

        cui.layoutFlexAccu = 0;
        cui.layoutFixedAccu = 0;



        if (cui.isVertical) {
            if (cui.layoutWidth == RUIAuto) {
                let maxwidth = -1;
                children.forEach(c => {
                    c.Layout();
                    if (c.layoutWidth != RUIAuto) {
                        maxwidth = Math.max(maxwidth, c.layoutWidth);
                    }
                    self.AccuFlex(cui, c, true);
                })
                cui.layoutWidth = maxwidth == -1 ? RUIAuto : maxwidth;
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
            if (cui.layoutHeight == RUIAuto) {

                let maxheight = -1;
                children.forEach(c => {
                    c.Layout();
                    if (c.layoutHeight != RUIAuto) {
                        maxheight = Math.max(maxheight, c.layoutHeight);
                    }
                    self.AccuFlex(cui, c, false);
                })
                cui.layoutHeight = maxheight == -1 ? RUIAuto : maxheight;
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
            cui.layoutWidth = data.flexWidth;
        }
        if (data.flexHeight != null) {
            cui.layoutHeight = data.flexHeight;
        }

        if (ui.layoutWidth === RUIAuto) {
            ui.layoutWidth = data.containerWidth;
        }
        if (ui.layoutHeight == RUIAuto) {
            ui.layoutHeight = data.containerHeight;
        }

        //start flex calculate
        var sizePerFlex = 0;
        if (isvertical) {
            sizePerFlex = (cui.layoutHeight - cui.layoutFixedAccu) / cui.layoutFlexAccu;
        }
        else {
            sizePerFlex = (cui.layoutWidth - cui.layoutFixedAccu) / cui.layoutFlexAccu;
        }



        var containerHeight = cui.layoutHeight;
        var containerWidth = cui.layoutWidth;

        cui.rCalWidth = cui.layoutWidth;
        cui.rCalHeight = cui.layoutHeight;

        if (cui.boxSideExtens) {
            if (isvertical) {
                if(cui.width == RUIAuto){
                    containerWidth = data.containerWidth;
                    cui.rCalWidth = containerWidth;
                }
            }
            else {
                if(cui.height == RUIAuto){
                    containerHeight = data.containerHeight;
                    cui.rCalHeight = containerHeight;
                }
                
            }
        }

        var offset = 0;

        children.forEach(c => {
            if(!c.isOnFlow) return;
            let csize = 0;

            if (c.flex != null) {
                csize = ROUND(c.flex * sizePerFlex);
            } else {
                csize = isvertical ? c.layoutHeight : c.layoutWidth;
            }

            let cdata = new RUILayoutData();
            cdata.containerWidth = containerWidth;
            cdata.containerHeight = containerHeight;

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