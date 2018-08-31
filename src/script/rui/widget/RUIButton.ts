import { RUIObject } from "../RUIObject";
import { RUICmdList } from "../RUICmdList";
import { RUIStyle } from "../RUIStyle";
import { RUIMouseEvent } from "../RUIEvent";
import { RUIUtil } from "../RUIUtil";

export type RUIButtonFunc = (btn:RUIButton)=>void;

export class RUIButton extends RUIObject{

    public label:string;

    private m_color:number[] = RUIStyle.Default.background3;
    private m_onhover:boolean = false;

    public clickFunction?: RUIButtonFunc;

    public constructor(label:string,f?:RUIButtonFunc){
        super();
        this.label = label;
        this.clickFunction = f;
        this.height = RUIUtil.LINE_HEIGHT_DEFAULT;
    }

    public onDraw(cmd:RUICmdList){
        let rect= this.calculateRect();
        this._rect = rect;

        let cliprect = RUIUtil.RectClip(rect,this.clipMask);
        this._drawClipRect = cliprect; 

        if(cliprect == null){
            return;
        }
        cmd.DrawRectWithColor(rect,this.m_color,cliprect);
        cmd.DrawText(this.label,rect,null,cliprect);

    }

    public onMouseEnter(ontop?:boolean){
        if(ontop && !this.m_onhover){
            this.m_color = RUIStyle.Default.primary;
            this.setDirty();
            this.m_onhover = true;
        }

    }

    public onMouseLeave(){
        if(this.m_onhover){
            this.m_color = RUIStyle.Default.background3;
            this.setDirty();
            this.m_onhover = false;
        }
    }

    public onMouseClick(e:RUIMouseEvent){
        let f = this.clickFunction;
        if(f != null) f(this);
    }

    public onMouseDown(){
        this.m_color = RUIStyle.Default.primary0;
        this.setDirty();
    }

    public onMouseUp(){
        if(this.m_onhover){
            this.m_color = RUIStyle.Default.primary;
        }
        else{
            this.m_color = RUIStyle.Default.background3;
        }
        this.setDirty();
    }
}