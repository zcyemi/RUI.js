import { RUIObject } from "../RUIObject";
import { RUICmdList } from "../RUICmdList";
import { RUIStyle } from "../RUIStyle";
import { RUIMouseEvent } from "../RUIEvent";
import { RUI } from "../RUI";

export type RUIButtonFunc = (btn:RUIButton)=>void;

export class RUIButton extends RUIObject{

    public label:string;

    private m_color:number[] = RUIStyle.Default.background1;
    private m_onhover:boolean = false;

    public clickFunction?: RUIButtonFunc;

    public constructor(label:string,f?:RUIButtonFunc){
        super();
        this.label = label;
        this.clickFunction = f;
    }

    public onDraw(cmd:RUICmdList){
        let rect= this.calculateRect();
        this._rectclip = RUI.RectClip(rect,cmd.clipRect);
        this._rect= this._rectclip;
        
        cmd.DrawRectWithColor(rect,this.m_color);
        cmd.DrawText(this.label,rect);
    }

    public onMouseEnter(){
        this.m_color = RUIStyle.Default.primary;
        this.setDirty();
        this.m_onhover = true;
    }

    public onMouseLeave(){
        this.m_color = RUIStyle.Default.background1;
        this.setDirty();
        this.m_onhover = false;
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
            this.m_color = RUIStyle.Default.background2;
        }
        this.setDirty();
    }
}