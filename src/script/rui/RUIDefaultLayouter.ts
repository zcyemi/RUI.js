import { RUILayouter, RUIVal, RUISizePair, RUILayoutData, ROUND } from "./RUI";
import { RUIObject, RUIAuto } from "./RUIObject";
import { RUIContainer } from "./RUIContainer";
import { RUICanvasNode } from "./widget/RUICanvas";

export class RUIDefaultLayouter implements RUILayouter {

    private static s_layouter = new RUIDefaultLayouter();
    public static get Layouter(): RUIDefaultLayouter {
        return this.s_layouter;
    }


    public Layout(ui: RUIObject) {

        ui.layoutWidth = ui.rWidth;
        ui.layoutHeight = ui.rHeight;

    }

    public LayoutPost(ui: RUIObject, data: RUILayoutData) {

        if (data.flexWidth != null) {
            ui.rCalWidth = data.flexWidth;
        }
        else {
            if (ui.layoutWidth == RUIAuto) {
                ui.rCalWidth = data.containerWidth;
            }
            else {
                ui.rCalWidth = ui.layoutWidth;
            }
        }

        if (data.flexHeight != null) {
            ui.rCalHeight = data.flexHeight;
        }
        else {
            if (ui.layoutHeight == RUIAuto) {
                ui.rCalHeight = data.containerHeight;
            }
            else {
                ui.rCalHeight = ui.layoutHeight;
            }
        }


    }

    public static LayoutRelative(c: RUIObject, cpw: number, cph: number) {


        let cleft = c.left;
        let cright = c.right;
        let ctop = c.top;
        let cbottom = c.bottom;

        let constraintHori = cleft != RUIAuto && cright != RUIAuto;
        let constraintVert = ctop != RUIAuto && cbottom != RUIAuto;

        let cwidth = RUIAuto;
        let cheight = RUIAuto;

        let coffx = cleft;
        let coffy = ctop;

        c.Layout();

        if (constraintHori) {
            cwidth = Math.max(0, cpw - cleft - cright);
        }
        else {
            if (c.layoutWidth != RUIAuto) {
                cwidth = c.layoutWidth;
                if (cleft != RUIAuto) {

                }
                else if (cright != RUIAuto) {
                    coffx = cpw - cright - cwidth;
                }
                else {
                    coffx = ROUND((cpw - cwidth) / 2);
                }
            }
            else {
                // console.error(c);
                // throw new Error();
                coffx = cleft;
            }
        }

        if (constraintVert) {
            cheight = Math.max(0, cph - ctop - cbottom);
        }
        else {
            if (c.layoutHeight != RUIAuto) {
                cheight = c.layoutHeight;
                if (ctop != RUIAuto) {
                }
                else if (cbottom != RUIAuto) {
                    coffy = cph - cbottom - cheight;
                }
                else {
                    coffy = ROUND((cph - cheight) / 2);
                }
            } else {
                // console.error(c);
                // throw new Error();
                coffy  =ctop;
            }
        }

        let data = new RUILayoutData();
        data.flexWidth = cwidth;
        data.flexHeight = cheight;
        data.containerWidth = cpw;
        data.containerHeight = cph;

        c.LayoutPost(data);
        // c.rCalWidth = cwidth;
        // c.rCalHeight = cheight;
        c.rOffx = coffx;
        c.rOffy = coffy;
    }

}