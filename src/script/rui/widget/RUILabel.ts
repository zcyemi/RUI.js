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
        let noclip = !this.isClip;
        
        let rect = this.calculateRect();
        this._rect = rect;

        let label = this.label;
        if(label == null || label === ''){
            return;
        }

        if(noclip) {
            cmd.PushClip(rect,null, RUIContainerClipType.NoClip);
        }
        else{
            if(cmd.isSkipDraw) return;
        }
        this._rectclip = RUI.RectClip(rect,cmd.clipRect);
        cmd.DrawText(this.label,rect);

        if(noclip) cmd.PopClipRect();
    }
}