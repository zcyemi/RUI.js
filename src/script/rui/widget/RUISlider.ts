import { RUIObject, RUIOrientation } from "../RUIObject";
import { RUICmdList } from "../RUICmdList";
import { RUIStyle } from "../RUIStyle";


export class RUISlider extends RUIObject{

    public orientation: RUIOrientation;
    private m_value :number = 0;
    public constructor(orientation: RUIOrientation){
        super();
        this.orientation = orientation;
    }

    public get value():number{
        return this.m_value;
    }

    public set value(val:number){
        this.m_value = val;
    }

    

    public onDraw(cmd:RUICmdList){

        let rect = this.calculateRect();
        this._rect = rect;
        cmd.DrawRectWithColor(rect,RUIStyle.Default.primary0);
    }
}