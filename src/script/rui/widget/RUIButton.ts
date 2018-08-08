import { RUIObject } from "../RUIObject";
import { RUICmdList } from "../RUICmdList";
import { RUIStyle } from "../RUIStyle";

export class RUIButton extends RUIObject{

    public label:string;

    private m_color:number[] = RUIStyle.Default.background1;
    private m_onhover:boolean = false;

    public constructor(label:string){
        super();
        this.label = label;
    }

    public onDraw(cmd:RUICmdList){
        let rect=  this.calculateRect();

        this._rect= rect;

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

    public onMouseDown(){
        this.m_color = RUIStyle.Default.primary0;
        this.setDirty();
    }

    public onMouseUp(){
        if(this.m_onhover){
            this.m_color = RUIStyle.Default.primary;
        }
        else{
            this.m_color = RUIStyle.Default.background1;
        }
        this.setDirty();
    }
}