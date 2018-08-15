import { RUILayouter, RUIVal, RUISizePair } from "./RUI";
import { RUIObject, RUIAuto } from "./RUIObject";

export class RUIDefaultLayouter implements RUILayouter{

    private static s_layouter = new RUIDefaultLayouter();

    public static get Layouter():RUIDefaultLayouter{
        return this.s_layouter;
    }

    private constructor(){

    }

    public onLayout(ui:RUIObject,width:RUIVal,height:RUIVal,maxwidth?:number,maxheight?:number){

        let rwidth = ui.rWith;
        let rheight = ui.rHeight;
        
        //calculate width
        if(rwidth === RUIVal.Auto){
            if(width === RUIVal.Auto){
                if(maxwidth == null) throw new Error();
                ui.rCalWidth = maxwidth;
            }
            else{
                ui.rCalWidth = width.value;
            }
        }
        else{
            ui.rCalWidth = rwidth.value;
        }

        //calculate height
        if(rheight === RUIVal.Auto){
            if(height === RUIVal.Auto){
                if(maxheight == null) throw new Error();
                ui.rCalHeight = maxheight;
            }
            else{
                ui.rCalHeight = height.value;
            }
        }
        else{
            ui.rCalHeight = rheight.value;
        }


    }

    public estimateSize(ui:RUIObject):RUISizePair{
        return {width:ui.rWith,height:ui.rHeight};
    }
}