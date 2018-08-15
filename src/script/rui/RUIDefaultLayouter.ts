import { RUILayouter, RUIVal, RUISizePair, RUILayoutData } from "./RUI";
import { RUIObject, RUIAuto } from "./RUIObject";

export class RUIDefaultLayouter implements RUILayouter{

    private static s_layouter = new RUIDefaultLayouter();
    public static get Layouter():RUIDefaultLayouter{
        return this.s_layouter;
    }


    public Layout(ui:RUIObject){
        ui.layoutWidth = ui.rWith.Clone;
        ui.layoutHeight = ui.rHeight.Clone;
    }

    public LayoutPost(ui:RUIObject,data:RUILayoutData){


        console.log(data);
        console.log(ui);
        
        if(data.flexWidth != null){
            ui.rCalWidth = data.flexWidth;
        }
        else{
            if(ui.layoutWidth === RUIVal.Auto){
                ui.rCalWidth = data.containerWidth.value;
            }
            else{
                ui.rCalWidth= ui.layoutWidth.value;
            }
        }

        if(data.flexHeight != null){
            ui.rCalHeight = data.flexHeight;
        }
        else{
            if(ui.layoutHeight === RUIVal.Auto){
                ui.rCalHeight = data.containerHeight.value;
            }
            else{
                ui.rCalHeight = ui.layoutHeight.value;
            }
        }

        
    }

}