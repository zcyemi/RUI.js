import { RUIObject } from "../RUIObject";
import { RUICmdList } from "../RUICmdList";
import { RUI } from "../RUI";
import { RUIFontTexture } from "../RUIFontTexture";
import { RUIContainerClipType } from "../RUIContainer";

export class RUILabel extends RUIObject{

    public label:string;

    public constructor(label:string){
        super();
        this.label= label;
        this.width = 100;
        this.height = 23;

    }   

    public Layout(){
        super.Layout();
        let ftw = RUIFontTexture.ASIICTexture.MeasureTextWith(this.label) + 20;
        if(!Number.isNaN(ftw)){
            this.width= ftw;
            this.layoutWidth = ftw;
        }
    }

    
    public onDraw(cmd:RUICmdList){

        super.onDraw(cmd);

        let label = this.label;
        if(label == null || label === ''){
            return;
        }

        let cliprect = this._drawClipRect;
        if(cliprect == null){
            return;
        }
        cmd.DrawText(this.label,this._rect,null,cliprect);
    }
}