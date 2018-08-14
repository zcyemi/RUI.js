import { RUIRoot } from "./RUIRoot";
import { RUIContainer } from "./RUIContainer";
import { RUIOrientation } from "./RUIObject";

export class RUILayout{

    public build(uiroot: RUIRoot){

        let isdirty = uiroot.isdirty;
        if(!isdirty) return;

        //Layout
        let ui = uiroot.root;
        // if(ui.isdirty || ui._resized){
        //     ui.onLayout();
        // }

        ui.onLayout();

        uiroot.isdirty = false;
        

        // ui._calx = 0;
        // ui._caly = 0;
        // ui._level = 0;

        //Calculate All offset

        let rootrect = uiroot.rootRect;

        ui._calx = rootrect[0] + ui._caloffsetx;
        ui._caly = rootrect[1]+ ui._caloffsety;
        if(ui instanceof RUIContainer){
            this.calculateOffset(ui);
        }
    }

    private calculateOffset(cui:RUIContainer){

        let children = cui.children;
        let clen = children.length;

        let isVertical = cui.boxOrientation == RUIOrientation.Vertical;

        if(clen > 0){

            let offx = cui._calx;
            let offy = cui._caly;

            let clevel = cui._level + 1;

            for(var i=0;i<clen;i++){
                var c= children[i];
                c._level = clevel;

                c._calx = offx + c._caloffsetx;
                c._caly = offy + c._caloffsety;

                if(c instanceof RUIContainer){
                    this.calculateOffset(c);
                }
                c.onLayoutPost();
            }
        }
    }


}