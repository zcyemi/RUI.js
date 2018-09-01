import { RUIObject } from "../RUIObject";
import { RUICmdList } from "../RUICmdList";
import { RUIUtil } from "../RUIUtil";
import { RUIFontTexture } from "../RUIFontTexture";
import { RUIContainerClipType } from "../RUIContainer";
import { RUIAuto } from "../RUIDefine";

export class RUILabel extends RUIObject{

    public m_label:string;
    protected m_fitTextWidth:boolean = true;

    public constructor(label:string,autowidth:boolean = false){
        super();
        this.m_label= label;
        this.width = autowidth? RUIAuto: 100;
        this.height = RUIUtil.LINE_HEIGHT_DEFAULT;
        this.responseToMouseEvent = false;
    }   

    public get label(){
        return this.m_label;
    }

    public set label(l:string){
        if(l === this.m_label) return;
        this.m_label =l;
        this.setDirty();
    }

    public get fixTextWidth(){
        return this.m_fitTextWidth;
    }
    public set fixTextWidth(val:boolean){
        this.m_fitTextWidth = val;
    }

    public Layout(){
        super.Layout();
        if(this.m_fitTextWidth){
            let ftw = RUIFontTexture.ASIICTexture.MeasureTextWith(this.m_label) + 20;
            if(!Number.isNaN(ftw)){
                this.width= ftw;
                this.layoutWidth = ftw;
            }
        }
    }

    
    public onDraw(cmd:RUICmdList):boolean{

        super.onDraw(cmd);
        let label = this.m_label;
        let cliprect = this._drawClipRect;
        if(cliprect == null){
            return false;
        }

        if(label == null || label === ''){
            return true;
        }
        cmd.DrawText(this.m_label,this._rect,null,cliprect);
        return true;
    }
}