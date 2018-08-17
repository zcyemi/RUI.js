import { RUIObject } from "../RUIObject";
import { RUICmdList } from "../RUICmdList";
import { RUI } from "../RUI";
import { RUIFontTexture } from "../RUIFontTexture";

export class RUILabel extends RUIObject{

    public label:string;

    public constructor(label:string){
        super();
        this.label= label;
        this.width = 100;

    }   

    public Layout(){
        super.Layout();
        let ftw = RUIFontTexture.ASIICTexture.MeasureTextWith(this.label) + 20;
        if(ftw != NaN){
            this.width= ftw;
            this.layoutWidth = ftw;
        }
    }

    
    public onDraw(cmd:RUICmdList){
        let rect = this.calculateRect();
        this._rect = rect;
        this._rectclip = RUI.RectClip(rect,cmd.clipRect);

        let label = this.label;
        if(label == null || label === '')return;

        cmd.DrawText(this.label,rect);
    }
}