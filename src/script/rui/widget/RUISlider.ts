import { RUIObject, RUIOrientation } from "../RUIObject";
import { RUICmdList } from "../RUICmdList";
import { RUIStyle } from "../RUIStyle";
import { SATURATE } from "../RUI";
import { RUIMouseEvent, RUIMouseDragEvent, RUIMouseDragStage } from "../RUIEvent";


export class RUISlider extends RUIObject{

    public static readonly SLIDER_HEIGHT: number = 10;

    private m_value :number = 0;
    public constructor(val:number,height:number = RUISlider.SLIDER_HEIGHT){
        super();
        this.value =val;
        this.height = height;
    }

    public get value():number{
        return this.m_value;
    }

    public set value(val:number){
        val = SATURATE(val);
        if(this.m_value == val) return;
        this.m_value = val;
        this.setDirty();
    }

    public onMouseDown(e:RUIMouseEvent){
        e.Use();
        let val =  (e.mousex - this.rCalx) / this.rCalWidth;
        if(val === NaN) return;
        this.value = val;    
    }

    public onMouseDrag(e:RUIMouseDragEvent){
        let stage = e.stage;
        if(stage == RUIMouseDragStage.Update){
            let val = (e.mousex - this.rCalx) / this.rCalWidth;
            if(val === NaN) return;
            this.value = val;
        }

        e.Use();
    }

    public onDraw(cmd:RUICmdList){
        super.onDraw(cmd);
        
        let cliprect= this._drawClipRect;
        if(cliprect == null) return;

        let rect = this._rect;
        cmd.DrawRectWithColor(rect,RUIStyle.Default.background0,cliprect);

        let val = this.m_value;
        if(val == 0) return;

        let vrect = rect.slice(0);
        vrect[2] *= val;

        cmd.DrawRectWithColor(vrect,RUIStyle.Default.primary0,cliprect);
    }
}