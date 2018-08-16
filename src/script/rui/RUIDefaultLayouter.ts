import { RUILayouter, RUIVal, RUISizePair, RUILayoutData, ROUND } from "./RUI";
import { RUIObject, RUIAuto } from "./RUIObject";
import { RUIContainer } from "./RUIContainer";

export class RUIDefaultLayouter implements RUILayouter {

    private static s_layouter = new RUIDefaultLayouter();
    public static get Layouter(): RUIDefaultLayouter {
        return this.s_layouter;
    }


    public Layout(ui: RUIObject) {

        ui.layoutWidth = ui.rWidth.Clone;
        ui.layoutHeight = ui.rHeight.Clone;

    }

    public LayoutPost(ui: RUIObject, data: RUILayoutData) {

        if (data.flexWidth != null) {
            ui.rCalWidth = data.flexWidth;
        }
        else {
            if (ui.layoutWidth === RUIVal.Auto) {
                ui.rCalWidth = data.containerWidth.value;
            }
            else {
                ui.rCalWidth = ui.layoutWidth.value;
            }
        }

        if (data.flexHeight != null) {
            ui.rCalHeight = data.flexHeight;
        }
        else {
            if (ui.layoutHeight === RUIVal.Auto) {
                ui.rCalHeight = data.containerHeight.value;
            }
            else {
                ui.rCalHeight = ui.layoutHeight.value;
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

        let cwidth = 0;
        let cheight = 0;

        let coffx = cleft;
        let coffy = ctop;

        c.Layout();

        if (constraintHori) {
            cwidth = Math.max(0, cpw - cleft - cright);
        }
        else {
            if (c.layoutWidth != RUIVal.Auto) {
                cwidth = c.layoutWidth.value;
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
                throw new Error();
            }
        }

        if (constraintVert) {
            cheight = Math.max(0, cph - ctop - cbottom);
        }
        else {
            if (c.layoutHeight != RUIVal.Auto) {
                cheight = c.layoutHeight.value;
                if (ctop != RUIAuto) {
                }
                else if (cbottom != RUIAuto) {
                    coffy = cph - cbottom - cheight;
                }
                else {
                    coffy = ROUND((cph - cheight) / 2);
                }
            } else {
                throw new Error();
            }
        }

        let data = new RUILayoutData();
        data.flexWidth = cwidth;
        data.flexHeight = cheight;
        data.containerWidth = new RUIVal(cpw);
        data.containerHeight = new RUIVal(cph);

        c.LayoutPost(data);
        c.rCalWidth = cwidth;
        c.rCalHeight = cheight;
        c.rOffx = coffx;
        c.rOffy = coffy;
    }

}