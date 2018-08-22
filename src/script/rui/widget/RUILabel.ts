import { RUIObject } from "../RUIObject";
import { RUICmdList } from "../RUICmdList";
import { RUI } from "../RUI";
import { RUIFontTexture } from "../RUIFontTexture";
import { RUIContainerClipType } from "../RUIContainer";

export class RUILabel extends RUIObject{

    public m_label:string;

    public constructor(label:string){
        super();
        this.m_label= label;
        this.width = 100;
        this.height = 23;
    }   

    public get label(){
        return this.m_label;
    }

    public set label(l:string){
        if(l === this.m_label) return;
        this.m_label =l;
        this.setDirty();
    }

    public Layout(){
        super.Layout();
        let ftw = RUIFontTexture.ASIICTexture.MeasureTextWith(this.m_label) + 20;
        if(!Number.isNaN(ftw)){
            this.width= ftw;
            this.layoutWidth = ftw;
        }
    }

    
    public onDraw(cmd:RUICmdList){

        super.onDraw(cmd);

        let label = this.m_label;
        if(label == null || label === ''){
            return;
        }

        let cliprect = this._drawClipRect;
        if(cliprect == null){
            return;
        }
        cmd.DrawText(this.m_label,this._rect,null,cliprect);
    }
}