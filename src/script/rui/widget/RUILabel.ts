import { RUIObject } from "../RUIObject";
import { RUICmdList } from "../RUICmdList";
import { RUI } from "../RUI";
import { RUIFontTexture } from "../RUIFontTexture";

export class RUILabel extends RUIObject{

    public label:string;

    private m_textwidth:number = NaN;

    public constructor(label:string){
        super();
        this.label= label;
        this.width = 100;

    }

    public onLayoutPost(){
        if(this.m_textwidth == NaN){
            let ftw = RUIFontTexture.ASIICTexture.MeasureTextWith(this.label) + 20;
            if(ftw != NaN){
                this.m_textwidth = ftw;
                this.width= ftw;
                this.setDirty(true);
            }
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